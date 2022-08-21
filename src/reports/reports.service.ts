import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {ReportEntity} from "./entities/report.entity";
import {MongoRepository} from "typeorm";
import {DiscordApiService} from "../discord-api/discord-api.service";
import {IReport} from "./interfaces/IReport";
import {IGuildMember} from "../discord-api/interfaces/IGuildMember";
import {WebsocketsService} from "../websockets/websockets.service";
import {IUser} from "../discord-api/interfaces/IUser";


@Injectable()
export class ReportsService {
	constructor(
		@InjectRepository(ReportEntity) private reportsRepository:MongoRepository<ReportEntity>,
		private discordApiService:DiscordApiService,
		private websocketsService:WebsocketsService
	) {};

	async create(createReportDto: CreateReportDto):Promise<IReport<IUser>>{
		const report = this.reportsRepository.create(createReportDto);
		await report.save();

		const fullReport = await this.getFullReportData(report);
		this.sendReportToClients(fullReport);
		return fullReport;
	}

	async findAll(page:number, itemsOnPage:number, guildId?:string):Promise<{reports:IReport[], pagesCount:number}> {
		page = page || 1;
		itemsOnPage = itemsOnPage || 10;
		const itemsToSkipp = page * itemsOnPage - itemsOnPage;

		let reports:ReportEntity[];

		if(guildId) reports = await this.reportsRepository.find({order:{createdAt:"DESC"}, skip:itemsToSkipp, take:itemsOnPage, where:{guild:guildId}});
		else reports = await this.reportsRepository.find({order:{createdAt:"DESC"}, skip:itemsToSkipp, take:itemsOnPage});

		const allGuildsUsersIds = reports.reduce((acc, report) => {
			const alreadyUsedGuild = acc.get(report.guild);

			if(alreadyUsedGuild){
				alreadyUsedGuild.add(report.fromUser)
				alreadyUsedGuild.add(report.toUser);
				acc.set(report.guild, alreadyUsedGuild);
			}else acc.set(report.guild, new Set([report.fromUser, report.toUser]));

			return acc;
		}, new Map<string, Set<string>>())

		const allGuildsUsers = new Map<string, Map<string, IGuildMember>>()

		for(const [guildId, members] of allGuildsUsersIds){
			const guildMembers = await this.discordApiService.getUsersByIds(Array.from(members), guildId);
			allGuildsUsers.set(guildId, guildMembers);
		}

		for(const report of reports){
			report.fromUser = (allGuildsUsers.get(report.guild)?.get(report.fromUser)?.user  || report.fromUser) as any;
			report.toUser = (allGuildsUsers.get(report.guild)?.get(report.toUser)?.user || report.toUser) as any;
		}

		const pagesCount = await this.countReportsPages(guildId, itemsOnPage);
		const allReports = reports as unknown as IReport[];
		return {
				reports:allReports,
				pagesCount,
			}
	};

	private async countReportsPages(guildId:string, itemsOnPage:number){
		const reportsCount = await this.reportsRepository.count({guild:guildId})
		return Math.ceil(reportsCount/itemsOnPage);
	}

	private async sendReportToClients(report:IReport<IUser>){
		this.websocketsService.sendMessageToAllClients("report", report);
	};

	async findOne(id: string) {
		const report = await this.reportsRepository.findOne({where:{id}});
		if(!report) throw new NotFoundException({message:"Report not found"});

		const fromUser = await this.discordApiService.getUser(report.fromUser);
		const toUser = await this.discordApiService.getUser(report.toUser);

		return {...report, fromUser:fromUser, toUser:toUser};
	};

	async update(id: string, updateReportDto: UpdateReportDto):Promise<ReportEntity>{
		const report = await this.reportsRepository.findOne({where:{id}});
		if(!report) throw new NotFoundException({message:"Report not found"});

		if(report.moder && report.moder !== updateReportDto.moder) throw new ForbiddenException({message:"This report already taken by another moderator!"});

		report.status = updateReportDto.status;
		report.moder = updateReportDto.moder;

		await report.save();
		console.log(report);
		return report;
	}

	async remove(id: string) {
		const report = await this.reportsRepository.findOne({where:{id}});
		if(!report) throw new NotFoundException({message:"Report not found"});

		await report.remove();

		return report;
	}

	private async getFullReportData(report:IReport):Promise<IReport<IUser>>{
		const fromUser = await this.discordApiService.getUser(report.fromUser);
		const toUser = await this.discordApiService.getUser(report.toUser);
		if(report.moder){
			const moder = await this.discordApiService.getUser(report.moder);
			return {...report, fromUser, toUser, moder:moder};
		}

		return {...report, fromUser, toUser};

	};
}

