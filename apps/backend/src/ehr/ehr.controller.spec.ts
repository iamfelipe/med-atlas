import { Test, TestingModule } from '@nestjs/testing';
import { EhrController } from './ehr.controller';
import { EhrService } from './ehr.service';

describe('EhrController', () => {
  let controller: EhrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EhrController],
      providers: [EhrService],
    }).compile();

    controller = module.get<EhrController>(EhrController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
