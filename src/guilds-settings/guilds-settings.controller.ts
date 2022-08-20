import {Body, Controller, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import { GuildsSettingsService } from './guilds-settings.service';
import {GuildSettingsUpdateDto} from "./dto/update.dto";
import {DiscordAuthGuard} from "../auth/guards/auth.guard";
import {GuildPermissionsGuard} from "./guards/settings.guard";
import {DiscordBotGuard} from "./guards/discord.bot.guard";

@Controller('guilds-settings')
export class GuildsSettingsController {
  constructor(private readonly guildsSettingsService: GuildsSettingsService) {}

  @Put("/:guidId")
  @UseGuards(DiscordAuthGuard, GuildPermissionsGuard)
  async updateSettings(@Param("guildId") guildId:string, @Body() updateDto:GuildSettingsUpdateDto){
    return await this.guildsSettingsService.editSettings(guildId, updateDto);
  };


  @Post("/:guildId")
  @UseGuards(DiscordBotGuard)
  async createSettings(@Param("guildId") guildId:string){
    return await this.guildsSettingsService.createSettings(guildId);
  };

};
