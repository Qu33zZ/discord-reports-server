import {Controller, Get, Req} from '@nestjs/common';
import { DiscordApiService } from './discord-api.service';
import {Request} from "express";
@Controller('discord-api')
export class DiscordApiController {
  constructor(private readonly discordApiService: DiscordApiService) { };

  @Get("@me")
  async getMe(@Req() request:Request){
    return await this.discordApiService.getMe(request?.headers?.authorization);
  }

}
