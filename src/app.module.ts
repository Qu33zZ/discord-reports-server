import { Module } from '@nestjs/common';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';
import { DiscordApiModule } from './discord-api/discord-api.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ReportEntity} from "./reports/entities/report.entity";
import {SessionEntity} from "./auth/models/session.entity";
import { UserModule } from './user/user.module';
import { GuildsSettingsModule } from './guilds-settings/guilds-settings.module';
import {GuildSettingsEntity} from "./guilds-settings/entities/guild.settings.entity";
import { WebsocketsModule } from './websockets/websockets.module';

@Module({
  imports: [
      ReportsModule,
      AuthModule,
      DiscordApiModule,
      TypeOrmModule.forRoot({
          type: 'mongodb',
          url: 'mongodb://127.0.0.1:27017/discord_reports',
          useNewUrlParser: true,
          entities: [ReportEntity, SessionEntity, GuildSettingsEntity],
      }),
      UserModule,
      GuildsSettingsModule,
      WebsocketsModule

  ],
})
export class AppModule {}
