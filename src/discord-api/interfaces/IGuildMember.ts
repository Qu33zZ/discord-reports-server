import {IUser} from "./IUser";
import {IRole} from "./IRole";

export interface IGuildMember{
	"user": IUser,
	"nick"?: string,
	"avatar"?:string,
	"roles": IRole[],
	"joined_at": string,
	"deaf": boolean,
	"mute": boolean
};