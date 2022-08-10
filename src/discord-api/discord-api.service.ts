import { Injectable } from '@nestjs/common';
import {IUser} from "./interfaces/IUser";
import {$discordAxios, $discordAxiosUnAuth} from "./discord.axios.instance";
import {WebSocket} from "ws";
import {response} from "express";
import {IAuth} from "../auth/interfaces/IAuth";


@Injectable()
export class DiscordApiService {
	socket:WebSocket
	constructor() {
		this.getGatewayConnectionData().then((data) =>
			{
				const socket = this.createGatewayConnection(data);
				socket.on("open", () =>{
					console.log("SOCKET READY")
					this.socket = socket;
				});

				socket.on("message", (data) =>{
					const messageData = JSON.parse(data.toString());
					const {op} = messageData;
					if(op === 10){
						const {d} = messageData;
						console.log("Constructor op -- " + op);
						const {heartbeat_interval} = d;
						this.sendHeartbeat(this.socket, heartbeat_interval);
						socket.send(JSON.stringify({
							"op": 2,
							"d": {
								"token":process.env.DISCORD_BOT_TOKEN.split(" ")[1],
								"intents":513,
								"properties": {
									"os": "windows",
									"browser": "chrome",
									"device": "chrome"
								}
							}
						}));
					}
				})
			}
		)

	}


	async getUser(id:string):Promise<IUser>{
		try {
			const userResponse = await $discordAxios.get<IUser>(`/users/${id}`);
			return userResponse.data;
		}catch (e){
			console.log(e);
			return null;
		}
	};

	private async getGatewayConnectionData(){
		try{
			const response = await $discordAxios.get("/gateway/bot");
			if(response.status == 200) return response.data;
		}catch (e){
			return null;
		}
	};

	private createGatewayConnection(gatewayData){
		return new WebSocket(gatewayData.url);
	};

	getUsersByIds(idsArray:string[], guildId:string):Promise<Map<string, any>>{
		console.log("GET USRS")
		return new Promise((resolve, reject) =>{
			const reqMembersData = {
				"op": 8,
				"d": {
					"guild_id":guildId,
					// "query": "",
					"limit": 0,
					"user_ids":idsArray,
				}
			};
			this.socket.send(
				JSON.stringify(reqMembersData),
				(err) => err && reject(err)
			);

			const result = new Map<string, any>();

			const getMembersChunk = (data) =>{
				const {t, op, d, event} = JSON.parse(data.toString());
				if(t === "GUILD_MEMBERS_CHUNK"){
					for(const member of d.members){
						result.set(member.user.id, member);
					}
					this.socket.removeListener("message", getMembersChunk)
					resolve(result);
				}
			};


			this.socket.on("message", getMembersChunk);
		})

	};

	private sendHeartbeat(socket:WebSocket, ms:number){
		setInterval(() =>
			socket.send(
				JSON.stringify({op:1, d:null})
			), ms)
	};


	async getMe(authData:IAuth){
		try {
			const response = await $discordAxiosUnAuth.get("/users/@me", {headers:{authorization:`${authData.token_type} ${authData.access_token}`}});
			if(response.status === 200) return response.data;
			return null;
		}catch (err){
			return null
		}
	}
}
