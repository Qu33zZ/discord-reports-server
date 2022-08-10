export class CreateReportDto {
	guild:string;
	fromUser:string;
	toUser:string;
	reason:string;
	files?:any[];
}
