import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

// Obs: Com essa abordagem UpdateUserDto herda todas as validações do CreateUserDto.
// Todos os seus campos, de atualização, são opcionais