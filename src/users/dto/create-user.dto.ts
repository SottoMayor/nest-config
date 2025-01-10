import { IsString, IsDateString, IsEnum, IsNumber, isEmail, IsEmail, Min, MinLength, MaxLength, Matches, IsStrongPassword } from 'class-validator';
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
  
  @ApiProperty({ description: 'The users\' email' })
  @IsEmail()
  email: string
  @ApiProperty({ description: 'The users\' password' })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  // @IsStrongPassword({
  //   minLength: 8,
  //   minLowercase: 1,
  //   minNumbers: 1,
  //   minSymbols: 1,
  //   minUppercase: 1,
  // })
  password: string
}