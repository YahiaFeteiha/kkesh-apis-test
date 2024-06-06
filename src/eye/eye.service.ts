import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateEyeDto } from './dto/create-eye.dto';
import { Eye } from './entities/eye.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class EyeService {
  constructor(
    @InjectRepository(Eye)
    private EyeRepository: Repository<Eye>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(CreateEyeDto: CreateEyeDto) {
    const res = await this.EyeRepository.save(CreateEyeDto);
    return res;
  }

  findAll() {
    return `This action returns all eye`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eye`;
  }

  remove(id: number) {
    return `This action removes a #${id} eye`;
  }
}
