import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import axios from "axios";
import {$discordAxiosUnAuth} from "../discord-api/discord.axios.instance";
import {DiscordApiService} from "../discord-api/discord-api.service";
import {InjectRepository} from "@nestjs/typeorm";
import {SessionEntity} from "./models/session.entity";
import {MongoRepository} from "typeorm";
import {IAuth} from "./interfaces/IAuth";
import {IUser} from "../discord-api/interfaces/IUser";

@Injectable()
export class AuthService {
	constructor(
		private discordApiService:DiscordApiService,
		@InjectRepository(SessionEntity) private sessionsRepo:MongoRepository<SessionEntity>,
	) {};

	async authorize(code:string){
		try {
			const data = {
				client_id: process.env.CLIENT_ID,
				client_secret: process.env.CLIENT_SECRET,
				grant_type: 'authorization_code',
				code,
			};
			const headers = {
				'Content-Type': 'application/x-www-form-urlencoded'
			};

			const response = await $discordAxiosUnAuth.post("/oauth2/token", data, {headers});

			if(response.status === 200) return await this.createSession(response.data);
			else throw new UnauthorizedException({message:"Invalid authorization code"});
		}catch (e){
			throw new UnauthorizedException({message:"Invalid authorization code"});
		}
	};

	private async createSession(authData:IAuth){
		const user:IUser = await this.discordApiService.getMe(authData);
		let session = await this.sessionsRepo.findOne({where:{user_id:user.id}});
		if(!session) session = new SessionEntity();

		session.user_id = user.id;
		session.accessToken = authData.access_token;
		session.refreshToken = authData.refresh_token;
		session.accessTokenType = authData.token_type;

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
				'grant_type': 'refresh_token',
				'refresh_token': refreshToken
			}
			const headers = {
				'Content-Type': 'application/x-www-form-urlencoded'
			}

			const response = await $discordAxiosUnAuth.post("/oauth2/token", data, {headers});
			if(response.status === 200) return await this.createSession(response.data);
			else throw new BadRequestException({message:"Invalid refresh token"});
		}catch (e){
			throw new BadRequestException({message:"Invalid refresh token"});
		}
	};
}
