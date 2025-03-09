import { Test } from '@nestjs/testing';
import { EhrController } from './ehr.controller';
import { EhrModule } from './ehr.module';
import { EhrService } from './ehr.service';

describe('EhrModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [EhrModule],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should provide EhrService', async () => {
    const module = await Test.createTestingModule({
      imports: [EhrModule],
    }).compile();

    const service = module.get<EhrService>(EhrService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(EhrService);
  });

  it('should provide EhrController', async () => {
    const module = await Test.createTestingModule({
      imports: [EhrModule],
    }).compile();

    const controller = module.get<EhrController>(EhrController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(EhrController);
  });
});
