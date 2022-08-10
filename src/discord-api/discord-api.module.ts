import { Module } from '@nestjs/common';
import { DiscordApiService } from './discord-api.service';
import { DiscordApiController } from './discord-api.controller';

@Module({
  controllers: [DiscordApiController],
  providers: [DiscordApiService],
  exports:[DiscordApiService]
})
export class DiscordApiModule {}
