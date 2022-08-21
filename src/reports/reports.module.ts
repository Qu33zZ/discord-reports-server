import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import {DiscordApiModule} from "../discord-api/discord-api.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ReportEntity} from "./entities/report.entity";
import {SessionEntity} from "../auth/models/session.entity";
import {GuildSettingsEntity} from "../guilds-settings/entities/guild.settings.entity";
import {UserModule} from "../user/user.module";
import {WebsocketsModule} from "../websockets/websockets.module";

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports:[
      DiscordApiModule,
      UserModule,
      TypeOrmModule.forFeature([ReportEntity, SessionEntity, GuildSettingsEntity]),
      WebsocketsModule
  ]
})
export class ReportsModule {}
