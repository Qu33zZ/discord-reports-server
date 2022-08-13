import {Body, Controller, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import { GuildsSettingsService } from './guilds-settings.service';
import {GuildSettingsUpdateDto} from "./dto/update.dto";
import {DiscordAuthGuard} from "../auth/guards/auth.guard";
import {GuildPermissionsGuard} from "./guards/settings.guard";
import {AccessSettings} from "./decorators/access.settings.decorator";

@Controller('guilds-settings')
export class GuildsSettingsController {
  constructor(private readonly guildsSettingsService: GuildsSettingsService) {}

  @Put("/:guidId")
  async updateSettings(@Param("guildId") guildId:string, @Body() updateDto:GuildSettingsUpdateDto){
    return await this.guildsSettingsService.editSettings(guildId, updateDto);
  };


  @Post("/:guildId")
  @AccessSettings({admin:false, settingsExists:false, owner:true, rolesAllowed:false})
  @UseGuards(DiscordAuthGuard, GuildPermissionsGuard)
  async createSettings(@Param("guildId") guildId:string){
    return await this.guildsSettingsService.createSettings(guildId);
  };

};
