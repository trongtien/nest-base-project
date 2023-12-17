/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';

import { ConfigurationService } from './configuration/configuration.service';
import { ValidateFieldService } from './validateField/validate-field.service';
import { EncryptService } from './utils/encrypt.service';
import { ConvertString } from './utils/convertString';
import { ExceptionCustom } from './exception/custom.exception';

@Global()
@Module({
    imports: [],
    providers: [ConfigurationService, ValidateFieldService, EncryptService, ConvertString, ExceptionCustom],
    exports: [ConfigurationService, ValidateFieldService, EncryptService, ConvertString, ExceptionCustom],
})
export class SharedModule {}
