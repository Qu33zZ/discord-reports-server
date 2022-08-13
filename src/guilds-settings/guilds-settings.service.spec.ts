import { Test, TestingModule } from '@nestjs/testing';
import { GuildsSettingsService } from './guilds-settings.service';

describe('GuildsSettingsService', () => {
  let service: GuildsSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildsSettingsService],
    }).compile();

    service = module.get<GuildsSettingsService>(GuildsSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
