import {BaseEntity, Column, Entity, ObjectID, ObjectIdColumn} from "typeorm";
import {nanoid} from "nanoid";

@Entity("guild_settings")
export class GuildSettingsEntity extends BaseEntity{
	@ObjectIdColumn()
	_id:ObjectID;

	@Column()
	id:string = nanoid();

	@Column()
	guildId:string;

	@Column()
	allowedRoles:string[] = [];

	@Column()
	allowAllAdmins:boolean = true;
}