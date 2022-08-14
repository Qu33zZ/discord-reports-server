import {Injectable} from '@nestjs/common';
import {DiscordApiService} from "../discord-api/discord-api.service";
import {IGuild} from "../discord-api/interfaces/IGuild";
import {IUser} from "../discord-api/interfaces/IUser";
import {InjectRepository} from "@nestjs/typeorm";
import {GuildSettingsEntity} from "../guilds-settings/entities/guild.settings.entity";
import {MongoRepository} from "typeorm";
import {IGuildAccessCheckSettings} from "../reports/dto/guild.access.check.settings";

@Injectable()
export class UserService {
	constructor(
		private discordApiService:DiscordApiService,
		@InjectRepository(GuildSettingsEntity) private guildSettingsRepo:MongoRepository<GuildSettingsEntity>,
	) {};

	async getMe(accessToken:string):Promise<IUser>{
		return await this.discordApiService.getMe(accessToken);
	}

	async getMyGuilds(userId:string, accessToken:string):Promise<IGuild[]>{
		const allGuilds = await this.discordApiService.getUserGuilds(accessToken);

		const start = Date.now()
		const guilds:IGuild[] = [];

		console.log(`Filter started at ${start} ms`);
		for(const guild of allGuilds){
			const userAccess = await this.checkUserAccessToGuild(userId, guild.id, {admin:true, rolesAllowed:true, owner:true, settingsExists:true});
			console.log(`${guild.name} --- ${userAccess}`);
			if(userAccess) guilds.push(guild);
		}
		console.log(`Filter finished in ${Date.now() - start} ms`);
		return guilds as IGuild[];
	};

	async checkUserAccessToGuild(userId:string, guildId:string, settings:IGuildAccessCheckSettings):Promise<boolean>{
		const guildSettings = await this.guildSettingsRepo.findOne({where:{guildId}});
		if( settings.settingsExists && !guildSettings) return false;

		const guild = await this.discordApiService.getGuild(guildId);
		if(!guild) return false;

		const member = await this.discordApiService.getGuildMember(guildId, userId);
		if(!member) return false;

		const isMemberAllowedByRoles = member.roles.some(role => guildSettings?.allowedRoles?.includes(role.id));
		const isMemberOwner = member.user.id === guild.owner_id;
		const isMemberAdmin = member.roles.some(role => Boolean(Number(role.permissions) & 8));

		return (settings.admin && isMemberAdmin) || (settings.owner && isMemberOwner) || (settings.rolesAllowed && isMemberAllowedByRoles);
	}
}
