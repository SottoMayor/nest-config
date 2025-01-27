import { Module } from '@nestjs/common';
import { ProfessionsService } from './professions.service';
import { ProfessionsController } from './professions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profession } from './entities/profession.entity';
import { ProfessionUser } from './entities/profession-user.entity';

@Module({
  controllers: [ProfessionsController],
  providers: [ProfessionsService],
  imports: [TypeOrmModule.forFeature([Profession, ProfessionUser])],
})
export class ProfessionsModule {}
