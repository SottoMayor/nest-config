import { IsString, IsDateString, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Name of the user' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Birthdate of the user', type: String, format: 'date' })
  @IsDateString()
  birthdate: Date;

  @ApiProperty({ description: 'Gender of the user', enum: ['M', 'F'] })
  @IsEnum(['M', 'F'])
  gender: 'M' | 'F';

  @ApiProperty({ description: 'Height of the user in meters' })
  @IsNumber()
  height: number;

  @ApiProperty({ description: 'Weight of the user in kilograms' })
  @IsNumber()
  weight: number;
}
