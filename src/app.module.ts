import { Module } from '@nestjs/common';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';
import { DiscordApiModule } from './discord-api/discord-api.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ReportEntity} from "./reports/entities/report.entity";
import {SessionEntity} from "./auth/models/session.entity";

@Module({
  imports: [
      ReportsModule,
      AuthModule,
      DiscordApiModule,
      TypeOrmModule.forRoot({
          type: 'mongodb',
          url: 'mongodb://127.0.0.1:27017/discord_reports',
          useNewUrlParser: true,
          entities: [ReportEntity, SessionEntity],
      })

  ],
})
export class AppModule {}
