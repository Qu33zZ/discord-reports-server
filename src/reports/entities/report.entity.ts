import {Column, Entity, ObjectID, ObjectIdColumn} from "typeorm";
import {nanoid} from "nanoid"
import {BaseEntity} from "typeorm";

export type reportStatusType = "CREATED" | "PENDING" | "ACCEPTED" | "REJECTED";

@Entity("reports")
export class ReportEntity extends BaseEntity{
	@ObjectIdColumn()
	_id:ObjectID;

	@Column({unique:true})
	id:string = nanoid();

	@Column()
	guild:string;

	@Column()
	fromUser:string;

	@Column()
	toUser:string;

	@Column()
	reason:string;

	@Column({nullable:true})
	files:any[] = null;

	@Column()
	status: reportStatusType = "CREATED";

	@Column({nullable:true})
	moderId:string = null;

	@Column()
	createdAt:Date;
}
