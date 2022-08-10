import {BaseEntity, Column, Entity, ObjectID, ObjectIdColumn} from "typeorm";
import {nanoid} from "nanoid";

@Entity("session")
export class SessionEntity extends BaseEntity{
	@ObjectIdColumn()
	_id:ObjectID;

	@Column()
	id:string = nanoid();

	@Column()
	user_id:string;

	@Column()
	accessToken:string;

	@Column()
	refreshToken:string;

	@Column()
	accessTokenType:string;

	@Column()
	createdAt:Date = new Date();
}