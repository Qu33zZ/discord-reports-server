import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {MongoRepository} from "typeorm";
import {GuildSettingsEntity} from "./entities/guild.settings.entity";
import {GuildSettingsUpdateDto} from "./dto/update.dto";

@Injectable()
export class GuildsSettingsService {
	constructor(
		@InjectRepository(GuildSettingsEntity) private guildsSettingsRepo:MongoRepository<GuildSettingsEntity>
	){};

	async createSettings(guildId:string):Promise<GuildSettingsEntity>{
		let guild = await this.guildsSettingsRepo.findOne({where:{guildId}});
		if(guild) throw new BadRequestException({message:"This guild is already in database"});

		guild = new GuildSettingsEntity();
		guild.guildId = guildId;

		return await guild.save();
	};

	async editSettings(guildId:string, updateDto:GuildSettingsUpdateDto){
		const guild = await this.guildsSettingsRepo.findOne({where:{guildId}});
		if(!guild) throw new NotFoundException({message:"Guild settings not found"});

		if(updateDto.allowedRoles) guild.allowedRoles = updateDto.allowedRoles;
		if(updateDto.allowAllAdmins !== null && updateDto.allowAllAdmins !== undefined ) guild.allowAllAdmins = updateDto.allowAllAdmins;

		return await guild.save();
	};
}
