import { Injectable } from '@nestjs/common';
import { AssociateDto } from './dto/associate.dto';
import { UsersService } from 'src/users/users.service';
import { Profession } from './entities/profession.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionUser } from './entities/profession-user.entity';
import ResponseService from 'src/interfaces/response-service.interface';

@Injectable()
export class ProfessionsService {

    constructor(
        @InjectRepository(Profession)
          private professionRepository: Repository<Profession>,
        @InjectRepository(ProfessionUser)
        private profUserRepository: Repository<ProfessionUser>,
        private usersService: UsersService
      ){}

    async associate({ userId, professionId }: AssociateDto): Promise<ResponseService<ProfessionUser>> {
        // Verificação de existência.
        const a =await this.usersService.findOne(userId);
        await this.professionRepository.findOneByOrFail({ id: professionId })
    
        const users = await a.data.professionsUsers
        console.log(users)
        // A constraint evita a duplicidade
        const profUser = this.profUserRepository.create({ userId, professionId });
    
        await this.profUserRepository.save(profUser);
    
        return { data: profUser };
      }
}
