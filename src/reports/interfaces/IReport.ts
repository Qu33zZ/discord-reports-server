import {IUser} from "../../discord-api/interfaces/IUser";
import {reportStatusType} from "../entities/report.entity";

export interface IReport{
	id:string;
	guild:string;

	fromUser:IUser | string;
	toUser:IUser | string;

	moderId:string;

	reason:string;
	status:reportStatusType;
	createdAt:Date;

	files:any[];
}