import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AssociateDto {
  @ApiProperty({ description: 'ID of Professions\' table' })
  @IsInt({ message: 'profession_id deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'profession_id não pode estar vazio.' })
  professionId: number;

  @ApiProperty({ description: 'ID of Users\' table' })
  @IsInt({ message: 'user_id deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'user_id não pode estar vazio.' })
  userId: number;
}
