import { Injectable } from '@nestjs/common';
import { Inquiry } from './entities/inquiry.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry) private InquiryRepository: Repository<Inquiry>,
  ) {}
  async create(CreateInquiryDto: CreateInquiryDto) {
    const res = await this.InquiryRepository.save(CreateInquiryDto);
    return res;
  }
  findAll() {
    return `This action returns all inquiry`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inquiry`;
  }

  remove(id: number) {
    return `This action removes a #${id} inquiry`;
  }
}
