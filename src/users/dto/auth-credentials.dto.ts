import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator"

export class AuthCredentialsDto {
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