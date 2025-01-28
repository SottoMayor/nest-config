import { Module } from '@nestjs/common';
import { ProfessionsService } from './professions.service';
import { ProfessionsController } from './professions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profession } from './entities/profession.entity';
import { ProfessionUser } from './entities/profession-user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ProfessionsController],
  providers: [ProfessionsService],
  imports: [TypeOrmModule.forFeature([Profession, ProfessionUser]), UsersModule],
})
export class ProfessionsModule {}
