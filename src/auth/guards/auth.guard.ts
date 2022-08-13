import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {SessionEntity} from "../models/session.entity";
import {MongoRepository} from "typeorm";
import {DiscordApiService} from "../../discord-api/discord-api.service";
import {AccessToken} from "../../user/decorators/access.token.decorator";

@Injectable()
export class DiscordAuthGuard implements CanActivate {
	constructor(
		@InjectRepository(SessionEntity) private sessionsRepo:MongoRepository<SessionEntity>,
		private discordApiService:DiscordApiService
    ) {};

	async canActivate(
		context: ExecutionContext,
	):Promise<boolean>{
		const request = context.switchToHttp().getRequest();
		const token = request?.headers?.authorization?.split(" ")[1];
		if(!token) throw new UnauthorizedException({message:"Invalid authorization token"});

		const session = await this.sessionsRepo.findOne({where:{accessToken:token}});
		if(!session) throw new UnauthorizedException({message:"Invalid authorization token"});

		const user = await this.discordApiService.getMe(token);
		if(!user) throw new UnauthorizedException({message:"Discord user not found"});

		Reflect.defineMetadata("user", user, context.getHandler());
		return true;
	}
}