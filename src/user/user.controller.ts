import { Controller, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { MedicalReport, MedicalReportRequest } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(':lang/get-user-data')
  getUserData(@Param('lang') lang: string, @Body() body: any) {
    return this.userService.getUserData(lang, body);
  }

  @Post(':lang/check-eligibility')
  checkEligibility(@Param('lang') lang: string, @Body() body: any) {
    return this.userService.checkEligibility(lang, body);
  }
  @Post('/file-name')
  getFileName(@Body() body: { urn: string; nid: string }) {
    return this.userService.getFileName(body);
  }
  @Post(':lang/medical-report')
  async medicalReport(
    @Param('lang') lang: string,
    @Body() body: { urn: string; nid: string },
  ): Promise<any> {
    const { urn, nid } = body;

    if (!urn || !nid) {
      console.error('[ERROR]: urn or nid is missing');
      return {
        status_code: 0,
        message: 'urn or nid is missing',
      };
    }

    const medicalReportData: MedicalReport = {
      urn,
      nid,
      date: '',
      text: '',
      url: '',
    };

    return await this.userService.medicalReport(medicalReportData, lang);
  }
  @Post(':lang/medical-report-request')
  async medicalReportRequest(
    @Param('lang') lang: string,
    @Body() body: MedicalReportRequest,
  ): Promise<any> {
    if (
      !body.urn ||
      !body.nid ||
      !body.type_of_report ||
      !body.email_address ||
      !body.comments ||
      !body.physician_name ||
      !body.source
    ) {
      console.error('[ERROR]: Required parameter is missing');
      return {
        status_code: 0,
        message: 'Required parameter is missing',
      };
    }
    return await this.userService.medicalReportRequest(body);
  }
}
