import { Module } from '@nestjs/common';
import { GuildsSettingsService } from './guilds-settings.service';
import { GuildsSettingsController } from './guilds-settings.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {GuildSettingsEntity} from "./entities/guild.settings.entity";
import {UserModule} from "../user/user.module";
import {SessionEntity} from "../auth/models/session.entity";
import {DiscordApiModule} from "../discord-api/discord-api.module";

@Module({
  controllers: [GuildsSettingsController],
  providers: [GuildsSettingsService],
  imports:[
      TypeOrmModule.forFeature([GuildSettingsEntity, SessionEntity]),
      UserModule,
      DiscordApiModule
  ]
})
export class GuildsSettingsModule {}
