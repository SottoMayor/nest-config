import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import ResponseService from 'src/interfaces/response-service.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {

    const user = await this.usersRepository.findOneBy({ email: createUserDto.email })
    if(user){
      throw new BadRequestException('Esse email já está em uso, escolha outro.')
    }

    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<ResponseService<User>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return {data: user, message: 'iiihulll!', success: true};
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<ResponseService<User>> {
    const { data: user } = await this.findOne(id);
    this.usersRepository.merge(user, updateUserDto);
    return { data: await this.usersRepository.save(user), message: 'Usuário atualizado com sucesso!' };
  }

  async remove(id: number): Promise<void> {
    const { data: user } = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
