import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Query,
	HttpStatus,
	HttpCode
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import {ReportEntity} from "./entities/report.entity";
import {IReport} from "./interfaces/IReport";
import {DiscordAuthGuard} from "../auth/guards/auth.guard";
import {GuildPermissionsGuard} from "../guilds-settings/guards/settings.guard";
import {AccessSettings} from "../guilds-settings/decorators/access.settings.decorator";
import {User} from "../user/decorators/user.decorator";
import {IUser} from "../discord-api/interfaces/IUser";

@Controller('reports')
export class ReportsController {
	constructor(private readonly reportsService: ReportsService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() createReportDto: CreateReportDto):Promise<IReport<IUser>> {
		return await this.reportsService.create(createReportDto);
	}

	@Get("/:guildId")
	@AccessSettings({admin:true, settingsExists:true, rolesAllowed:true, owner:true})
	@UseGuards(DiscordAuthGuard, GuildPermissionsGuard)
	async findAll(@Query("page") page:number, @Query("onPage") itemsOnPage:number, @Param("guildId") guildId:string):Promise<{reports:IReport[], pagesCount:number}> {
		return await this.reportsService.findAll(+page, +itemsOnPage, guildId);
	}

	@Get(':id')
	@AccessSettings({admin:true, settingsExists:true, rolesAllowed:true, owner:true})
	@UseGuards(DiscordAuthGuard, GuildPermissionsGuard)
	async findOne(@Param('id') id: string):Promise<IReport<IUser>>{
		return this.reportsService.findOne(id);
	}

	@Patch("/:guildId/:reportId")
	@AccessSettings({admin:true, settingsExists:true, rolesAllowed:true, owner:true})
	@UseGuards(DiscordAuthGuard, GuildPermissionsGuard)
	async update(@User() user:IUser, @Param('reportId') reportId: string, @Body() updateReportDto: UpdateReportDto):Promise<ReportEntity> {
		const valuesToUpdate = {...updateReportDto, moderId:user.id};
		return await this.reportsService.update(reportId, valuesToUpdate);
	}

	@Delete(':id')
	@AccessSettings({admin:true, settingsExists:true, rolesAllowed:true, owner:true})
	@UseGuards(DiscordAuthGuard, GuildPermissionsGuard)
	remove(@Param('id') id: string) {
		return this.reportsService.remove(id);
	}
}
