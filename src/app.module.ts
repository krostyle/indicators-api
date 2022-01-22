import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndicatorsController } from './indicators/indicators.controller';
import { IndicatorsModule } from './indicators/indicators.module';
import { IndicatorsService } from './indicators/indicators.service';


@Module({
  imports: [IndicatorsModule],
  controllers: [AppController, IndicatorsController, ],
  providers: [AppService, IndicatorsService],
})
export class AppModule {}
