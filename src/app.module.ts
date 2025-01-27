import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptographyModule } from './cryptography/cryptography.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CryptographyInterceptor } from './interceptors/cryptography.interceptor';
import { BodyConverterInterceptor } from './interceptors/body-converter.interceptor';
import { ResponseNormalizationInterceptor } from './interceptors/response-normalization.interceptor';
import { AddressesModule } from './addresses/addresses.module';
import { ProfessionsModule } from './professions/professions.module';
import { Document } from './users/entities/document.entity';
import { Address } from './addresses/entities/address.entity';
import { Profession } from './professions/entities/profession.entity';
import { ProfessionUser } from './professions/entities/profession-user.entity';

@Module({
  imports: [
      ConfigModule.forRoot({
        envFilePath: './.env',
        isGlobal: true
      }),
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory(configService: ConfigService) {
          return {
            type: 'postgres',
            host: configService.get<string>('DB_HOST'),
            port: parseInt(configService.get<string>('DB_PORT')),
            username: configService.get<string>('DB_USER'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
            synchronize: false,
            entities: [
              User,
              Document,
              Address,
              Profession,
              ProfessionUser
            ],
          };
        }
      }),
    UsersModule,
    CryptographyModule,
    AddressesModule,
    ProfessionsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseNormalizationInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CryptographyInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: BodyConverterInterceptor,
    },
  ],
})
export class AppModule {}
