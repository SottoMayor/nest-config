import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotAcceptableException } from '@nestjs/common';
import { AES, enc } from 'crypto-js';

@Injectable()
export class CryptographyService {
    private HASH_KEY: string

    constructor(private configService: ConfigService) {
        this.HASH_KEY = this.configService.get<string>('HASH_KEY');
    }

    public decrypt (ciphertext: string) {
        // Decrypt
        try{
          var bytes = AES.decrypt(
            ciphertext,
            this.HASH_KEY,
          );
          var originalText = bytes.toString(enc.Utf8);

          if(!originalText){
            throw new Error();
          }
        
          return originalText;
        }catch(e){
          console.log('[ERRO] Não foi possível descriptografar o payload!');
          console.log('ERRO =>', JSON.stringify(e));
    
          throw new NotAcceptableException('Não foi possível descriptografar o payload!')
        }
        
    };
    
    public encrypt (text: string) {
        // Encrypt
        var ciphertext = AES.encrypt(JSON.stringify(text), this.HASH_KEY).toString();
      
        return ciphertext;
    };
}
