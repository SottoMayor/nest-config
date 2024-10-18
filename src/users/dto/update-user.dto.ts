import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'Name of the user', required: false })
    name?: string;

  @ApiProperty({ description: 'Birthdate of the user', type: String, format: 'date', required: false })
    birthdate?: Date;

  @ApiProperty({ description: 'Gender of the user', enum: ['M', 'F'], required: false })
  gender?: 'M' | 'F';

  @ApiProperty({ description: 'Height of the user in meters', required: false })
  height?: number;

  @ApiProperty({ description: 'Weight of the user in kilograms', required: false })
  weight?: number;
}

// Obs: Com essa abordagem UpdateUserDto herda todas as validações do CreateUserDto.
// Todos os seus campos, de atualização, são opcionais