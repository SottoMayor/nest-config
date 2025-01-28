import { Body, Controller, Post } from '@nestjs/common';
import { ProfessionsService } from './professions.service';
import { AssociateDto } from './dto/associate.dto';

@Controller('professions')
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @Post('/associate')
  create(@Body() associateDto: AssociateDto) {
    return this.professionsService.associate(associateDto);
  }
}
