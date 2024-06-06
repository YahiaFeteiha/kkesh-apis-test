import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { EyeService } from './eye.service';
import { CreateEyeDto } from './dto/create-eye.dto';

@Controller('eye')
export class EyeController {
  constructor(private readonly eyeService: EyeService) {}

  @Post()
  create(@Body() createEyeDto: CreateEyeDto) {
    return this.eyeService.create(createEyeDto);
  }

  @Get()
  findAll() {
    return this.eyeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eyeService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEyeDto: UpdateEyeDto) {
  //   return this.eyeService.update(+id, updateEyeDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eyeService.remove(+id);
  }
}
