import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {MongoRepository} from "typeorm";
import {GuildSettingsEntity} from "../entities/guild.settings.entity";
import {DiscordApiService} from "../../discord-api/discord-api.service";
import {UserService} from "../../user/user.service";
import {IGuildAccessCheckSettings} from "../../reports/dto/guild.access.check.settings";

@Injectable()
export class GuildPermissionsGuard implements CanActivate {
	constructor(
		@InjectRepository(GuildSettingsEntity) private guildSettingsRepo:MongoRepository<GuildSettingsEntity>,
		private discordApiService:DiscordApiService,
		private userService:UserService
	) {};

	async canActivate(
		context: ExecutionContext,
	):Promise<boolean>{
		const request = context.switchToHttp().getRequest();

		const token = request?.headers?.authorization?.split(" ")[1];
		const guildId = request.params.guildId;

		const user = await this.discordApiService.getMe(token);
		if(!user) return false;

		const checkAccessSettings:IGuildAccessCheckSettings = Reflect.getMetadata("checkAccessSettings", context.getHandler());

		return await this.userService.checkUserAccessToGuild(user.id, guildId, checkAccessSettings);
	}
}