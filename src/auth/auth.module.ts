import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {DiscordApiModule} from "../discord-api/discord-api.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SessionEntity} from "./models/session.entity";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[
      TypeOrmModule.forFeature([SessionEntity]),
      DiscordApiModule,
  ]
})
export class AuthModule {}
