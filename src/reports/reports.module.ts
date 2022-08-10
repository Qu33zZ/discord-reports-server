import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import {DiscordApiModule} from "../discord-api/discord-api.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ReportEntity} from "./entities/report.entity";

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports:[
      DiscordApiModule,
      TypeOrmModule.forFeature([ReportEntity])
  ]
})
export class ReportsModule {}
