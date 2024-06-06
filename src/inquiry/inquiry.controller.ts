import { Controller, Get, Param, Delete } from '@nestjs/common';
import { InquiryService } from './inquiry.service';

@Controller('inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  // @Post()
  // create(@Body() createInquiryDto: CreateInquiryDto) {
  //   return this.inquiryService.create(createInquiryDto);
  // }

  @Get()
  findAll() {
    return this.inquiryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inquiryService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inquiryService.remove(+id);
  }
}
