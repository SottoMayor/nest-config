import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProfessionsService } from './professions.service';
import { AssociateDto } from './dto/associate.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('professions')
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @UseGuards(AuthGuard())
  @Post('/associate')
  create(@Body() associateDto: AssociateDto, @GetUser() authUser: User) {
    console.log(`\n[AuthUser]: \n${JSON.stringify(authUser)}\n`)
    return this.professionsService.associate(associateDto);
  }
}
