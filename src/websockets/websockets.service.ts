import { Injectable } from '@nestjs/common';
import {WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server} from "socket.io";

@Injectable()
@WebSocketGateway(3001,{
	cors:{
		origin:"*"
	}
})
export class WebsocketsService {
	@WebSocketServer()
	private wws:Server

	sendMessageToAllClients(eventName:string, message:any){
		this.wws.emit(eventName, message);
	}

}
