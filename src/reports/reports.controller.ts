import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import {ReportEntity} from "./entities/report.entity";
import {IReport} from "./interfaces/IReport";

@Controller('reports')
export class ReportsController {
	constructor(private readonly reportsService: ReportsService) {}

	@Post()
	async create(@Body() createReportDto: CreateReportDto):Promise<ReportEntity> {
		return await this.reportsService.create(createReportDto);
	}

	@Get()
	async findAll(@Param("page") page:number, @Param("onPage") itemsOnPage:number):Promise<IReport[]> {
		return await this.reportsService.findAll(+page, +itemsOnPage);
	}

	@Get(':id')
	async findOne(@Param('id') id: string) :Promise<IReport>{
		return this.reportsService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
		return this.reportsService.update(id, updateReportDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.reportsService.remove(id);
	}
}
