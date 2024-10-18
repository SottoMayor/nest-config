import { IsString, IsEnum, IsNumber, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsDateString()
  birthdate: Date;

  @IsEnum(['M', 'F'])
  gender: 'M' | 'F';

  @IsNumber()
  height: number;

  @IsNumber()
  weight: number;
}