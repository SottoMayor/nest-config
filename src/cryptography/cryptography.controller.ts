import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeController } from '@nestjs/swagger';
import { CryptographyService } from './cryptography.service';

@ApiExcludeController()
@Controller('cryptography')

export class CryptographyController {
    private NODE_ENV = this.configService.get<string>('NODE_ENV')

    constructor(private configService: ConfigService, private cryptographyService: CryptographyService){}

    @Post('/enc')
    encrypt(@Body() payload: any) {
        if(this.NODE_ENV != 'development'){
            throw new NotFoundException('Cannot POST /cryptography/enc')
        }
        return { data: this.cryptographyService.encrypt(payload) }
    }

    @Post('/dec')
    decrypt(@Body() payload: any) {
        if(this.NODE_ENV != 'development'){
            throw new NotFoundException('Cannot POST /cryptography/dec')
        }
        const decryptString = this.cryptographyService.decrypt(payload.data)
        const decryptObject = JSON.parse(decryptString)
        return decryptObject
    }
}
