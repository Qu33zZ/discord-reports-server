import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {MongoRepository} from "typeorm";
import {GuildSettingsEntity} from "../entities/guild.settings.entity";
import {DiscordApiService} from "../../discord-api/discord-api.service";
import {UserService} from "../../user/user.service";
import {IGuildAccessCheckSettings} from "../../reports/dto/guild.access.check.settings";

@Injectable()
export class DiscordBotGuard implements CanActivate {
	constructor() {};

	async canActivate(
		context: ExecutionContext,
	):Promise<boolean>{
		const request = context.switchToHttp().getRequest();

		const botSecret = request?.headers?.authorization?.split(" ")[1];

		return botSecret === process.env.BOT_API_AUTH_SECRET

	}
}