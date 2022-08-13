import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {DiscordApiModule} from "../discord-api/discord-api.module";
import {AuthModule} from "../auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SessionEntity} from "../auth/models/session.entity";
import {GuildSettingsEntity} from "../guilds-settings/entities/guild.settings.entity";

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports:[
      DiscordApiModule,
      AuthModule,
      TypeOrmModule.forFeature([SessionEntity, GuildSettingsEntity])
  ],
  exports:[UserService]
})
export class UserModule {}
