import { Injectable } from '@nestjs/common';
// import { CreateAppointmentDto } from './dto/create-appointment.dto';
// import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';

@Injectable()
export class AppointmentService {
  create: any;
  update: any;
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}
  async bookAppointment(urn: string, date: Date): Promise<any> {
    const appointment = this.appointmentRepository.create({
      urn,
      appointmentDate: date,
    });
    return this.appointmentRepository.save(appointment);
  }
  async getAppointments(urn: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({ where: { urn } });
  }

  findAll() {
    return `This action returns all appointment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
