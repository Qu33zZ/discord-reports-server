import { Test, TestingModule } from '@nestjs/testing';
import { GuildsSettingsController } from './guilds-settings.controller';
import { GuildsSettingsService } from './guilds-settings.service';

describe('GuildsSettingsController', () => {
  let controller: GuildsSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuildsSettingsController],
      providers: [GuildsSettingsService],
    }).compile();

    controller = module.get<GuildsSettingsController>(GuildsSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
