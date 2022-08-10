import { Controller } from '@nestjs/common';
import { DiscordApiService } from './discord-api.service';

@Controller('discord-api')
export class DiscordApiController {
  constructor(private readonly discordApiService: DiscordApiService) {}

}
