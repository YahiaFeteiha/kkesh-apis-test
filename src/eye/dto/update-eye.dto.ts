import { PartialType } from '@nestjs/mapped-types';
import { CreateEyeDto } from './create-eye.dto';

export class UpdateEyeDto extends PartialType(CreateEyeDto) {}
