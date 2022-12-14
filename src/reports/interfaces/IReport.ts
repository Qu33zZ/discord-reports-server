import {IUser} from "../../discord-api/interfaces/IUser";
import {reportStatusType} from "../entities/report.entity";

export interface IReport<T=string>{
	id:string;
	guild:string;

	fromUser:T;
	toUser:T;

	moder:T | string;

	reason:string;
	status:reportStatusType;
	createdAt:Date;

	files:any[];
}