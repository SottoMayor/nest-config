import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthTokenDto } from './dto/auth-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('/login')
  @ApiResponse({ status: 200, description: 'The user has been logged-in.' })
  @HttpCode(200)
  async login(@Body() authCredentialsDto: AuthCredentialsDto): Promise<AuthTokenDto> {
    return await this.usersService.login(authCredentialsDto);
  }

  @UseGuards(AuthGuard())
  @Get()
  @ApiResponse({ status: 200, description: 'Return all users.' })
  findAll(@GetUser() authUser: User) {
    return this.usersService.findAll(authUser);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Return a user by ID.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(AuthGuard())
  @Patch(':id')
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @GetUser() authUser: User) {
    return this.usersService.update(+id, updateUserDto, authUser);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'The user has been successfully removed.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
