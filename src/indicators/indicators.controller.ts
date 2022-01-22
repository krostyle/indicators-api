import { Controller, Get } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';


@Controller('api/indicators')
export class IndicatorsController {
    constructor(private readonly indicatorsService: IndicatorsService) { }
    @Get()
    getIndicators(): Promise<any> {
        return this.indicatorsService.getIndicators();
    }
}
