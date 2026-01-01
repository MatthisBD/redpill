import { Module } from '@nestjs/common';
import { CoordinatesModule } from './coordinates/coordinates.module';

@Module({
  imports: [CoordinatesModule],
})
export class AppModule {}
