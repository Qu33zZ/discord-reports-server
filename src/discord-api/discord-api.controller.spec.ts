import { Test, TestingModule } from '@nestjs/testing';
import { DiscordApiController } from './discord-api.controller';
import { DiscordApiService } from './discord-api.service';

describe('DiscordApiController', () => {
  let controller: DiscordApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscordApiController],
      providers: [DiscordApiService],
    }).compile();

    controller = module.get<DiscordApiController>(DiscordApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
