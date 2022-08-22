import {BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException} from '@nestjs/common';
import * as qs from "qs";
import {$discordAxiosUnAuth} from "../discord-api/discord.axios.instance";
import {DiscordApiService} from "../discord-api/discord-api.service";
import {InjectRepository} from "@nestjs/typeorm";
import {SessionEntity} from "./models/session.entity";
import {MongoRepository} from "typeorm";
import {IAuth} from "./interfaces/IAuth";
import {IUser} from "../discord-api/interfaces/IUser";
import {Cron, CronExpression} from "@nestjs/schedule";

@Injectable()
export class AuthService {
	private readonly logger:Logger;
	constructor(
		private discordApiService:DiscordApiService,
		@InjectRepository(SessionEntity) private sessionsRepo:MongoRepository<SessionEntity>,
	) {
		this.logger = new Logger(AuthService.name);
		this.deleteOldSessions();
	};

	async authorize(code:string){
		try {
			const data = {
				client_id: process.env.CLIENT_ID,
				client_secret: process.env.CLIENT_SECRET,
				grant_type: 'authorization_code',
				redirect_uri:"http://localhost:3000",
				code,
			};
			const headers = {
				'Content-Type': 'application/x-www-form-urlencoded'
			};

			const response = await $discordAxiosUnAuth.post("/oauth2/token", qs.stringify(data), {headers});

			if(response.status === 200) return await this.createSession(response.data);
			else throw new UnauthorizedException({message:"Invalid authorization code"});
		}catch (e){
			console.log(JSON.stringify(e));
			throw new UnauthorizedException({message:"Invalid authorization code"});
		}
	};

	private async createSession(authData:IAuth){
		const user:IUser = await this.discordApiService.getMe(authData.access_token);
		let session = await this.sessionsRepo.findOne({where:{user_id:user.id}});
		if(!session) session = new SessionEntity();

		session.user_id = user.id;
		session.accessToken = authData.access_token;
		session.refreshToken = authData.refresh_token;
		session.accessTokenType = authData.token_type;
		session.createdAt = new Date();

		await session.save();

		return {
			...authData,
			user
		};
	};

	async refresh(refreshToken:string){
		try {
			const data = {
				client_id: process.env.CLIENT_ID,
				client_secret: process.env.CLIENT_SECRET,
				grant_type: 'refresh_token',
				refresh_token: refreshToken
			}
			const headers = {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
			const response = await $discordAxiosUnAuth.post("/oauth2/token", qs.stringify(data), {headers});
			if(response.status === 200) return await this.createSession(response.data);
			else throw new BadRequestException({message:"Invalid refresh token"});
		}catch (e){
			console.log(e);
			throw new BadRequestException({message:"Invalid refresh token"});
		}
	};

	async logout(accessToken:string):Promise<void>{
		const session = await this.sessionsRepo.findOne({where:{accessToken}});
		if(!session) throw new NotFoundException({message:"Session not found"});
		await session.remove();
	};

	@Cron(CronExpression.EVERY_HOUR)
	private async deleteOldSessions(){
		await this.sessionsRepo.deleteMany({$where:"new Date().getTime() > this.createdAt.getTime() + 5*24*60*60*1000"});
		this.logger.log("Deleting old sessions from database")
	};
}
