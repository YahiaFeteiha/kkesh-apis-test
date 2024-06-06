/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  CreateUserDto,
  DischargeReport,
  DischargeSummary,
  MedicalReport,
  MedicalReportRequest,
} from './dto/create-user.dto';
import { generateOTP, replaceArabicNumbers, sendSMS } from 'helpers';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(CreateUserDto: CreateUserDto) {
    const res = await this.userRepository.save(CreateUserDto);
    return res;
  }
  async getUserData(lang: string, body: any): Promise<any> {
    try {
      let { urn, nid } = body;
      console.log(`[GET USER DATA][BODY]: ${JSON.stringify(body)}`);
      urn = replaceArabicNumbers(urn);
      nid = replaceArabicNumbers(nid);

      const response = {
        data: [
          {
            Mobile: '01117132034',
            Name_Ar: 'يحيى',
            Name_En: 'yahia',
            National_Id: nid,
            File_Number: urn,
          },
        ],
        statusCode: 200,
      };
      if (response.data.length) {
        console.log(
          `[GET USER DATA][RESPONSE]: ${JSON.stringify(response.data)}`,
        );
        const mobile = response.data[0].Mobile;
        let name;
        if (lang == 'ar') {
          name = response.data[0].Name_Ar;
        } else {
          name = response.data[0].Name_En;
        }
        let otp = 1234;
        if (process.env.APP_ENV == 'production') {
          otp = generateOTP();
          //send sms to user
          let smsContent;
          if (lang == 'ar') {
            smsContent = `كود التحقق الخاص بك هو ${otp}`;
          } else {
            smsContent = `your otp is ${otp}`;
          }
          sendSMS(mobile, smsContent);
        }

        return {
          status_code: 1,
          name,
          mobile,
          otp,
        };
      } else {
        return {
          status_code: 0,
          data: {},
        };
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        return {
          status_code: 0,
        };
      } else {
        return {
          status_code: -1,
        };
      }
    }
  }

  async checkEligibility(lang: string, body: { urn: string }): Promise<any> {
    try {
      let { urn } = body;
      console.log(`[GET USER DATA][BODY]: ${JSON.stringify(body)}`);
      urn = replaceArabicNumbers(urn);

      const response = {
        data: [{ File_Number: urn }],
      };
      const eligibility =
        response.data.length > 0 ? 'Eligible' : 'Not Eligible';
      const eligibilityCode = eligibility == 'Eligible' ? 1 : 0;
      return {
        status_code: 1,
        eligibility: eligibilityCode,
      };
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        return {
          status_code: 0,
        };
      } else {
        return {
          status_code: -1,
        };
      }
    }
  }

  async getFileName(body: { urn: string; nid: string }): Promise<any> {
    try {
      let { urn, nid } = body;

      if (!urn || !nid) {
        console.error('[ERROR]: urn or nid is missing');
        return {
          status_code: 0,
          message: 'urn or nid is missing',
        };
      }

      console.log(`[GET USER FILE][BODY]: ${JSON.stringify(body)}`);
      urn = replaceArabicNumbers(urn);
      nid = replaceArabicNumbers(nid);

      const response = {
        data: [{ national_id: nid }],
      };

      if (response.data.length) {
        console.log(
          `[GET USER DATA][RESPONSE]: ${JSON.stringify(response.data)}`,
        );
        return {
          status_code: 1,
          urn,
        };
      } else {
        return {
          status_code: 0,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        status_code: -1,
      };
    }
  }
  async dischargeSummary(body: DischargeSummary): Promise<any> {
    try {
      let { urn, nid } = body;
      if (!urn || !nid) {
        console.error('[ERROR]: urn or nid is missing');
        return {
          status_code: 0,
          message: 'urn or nid is missing',
        };
      }

      console.log(`[GET USER DATA][BODY]: ${JSON.stringify(body)}`);
      urn = replaceArabicNumbers(urn);
      nid = replaceArabicNumbers(nid);

      const uri: string = process.env.HOST;
      const reportsArr: DischargeReport[] = [];
      const reportsData: any[] = [
        {
          MR_Id: '123',
          'Report Type': 'Discharge Summary',
          CareProvider: 'Dr. Ahmed',
          'Issued Date': '2024-05-01',
        },
        {
          MR_Id: '124',
          'Report Type': 'Discharge Summary',
          CareProvider: 'Dr. Maryam',
          'Issued Date': '2024-05-15',
        },
      ];

      const filteredReportsData = reportsData
        .filter((el: any) => el['Report Type'] === 'Discharge Summary')
        .slice(0, 3);

      if (filteredReportsData.length) {
        for (const report of filteredReportsData) {
          const reportUrl: string = `${process.env.BASEURL}/api-reverse-prod-v2/MedicalReportPDF/api/Report?MRN=${urn}&MR_Id=${report.MR_Id}`;

          const filename: string = `discharge_summary-${urn}-${report.MR_Id}`;
          console.log(`Downloading file from ${reportUrl} to ${filename}.pdf`);

          const text: string = `${report.CareProvider.slice(0, 10)} ${report['Issued Date']}`;
          reportsArr.push({
            date: report['Issued Date'],
            text,
            url: `${uri}/storage/${filename}.pdf`,
          });
        }
        return {
          status_code: 1,
          reports: reportsArr,
        };
      } else {
        return {
          status_code: 0,
        };
      }
    } catch (e) {
      console.error('[ERROR]:', e);
      return {
        status_code: -1,
        message: 'Internal server error',
      };
    }
  }
  async medicalReport(body: MedicalReport, lang: string): Promise<any> {
    try {
      let { urn, nid } = body;
      console.log(`[GET USER DATA][BODY]: ${JSON.stringify(body)}`);
      urn = replaceArabicNumbers(urn);
      nid = replaceArabicNumbers(nid);

      const uri: string = process.env.HOST;
      const reportsArr: MedicalReport[] = [];

      const reportsData: any[] = [
        {
          MR_Id: '123',
          'Report Type': 'Medical Report',
          CareProvider: 'Dr. Ahemd',
          'Issued Date': '2024-05-01',
        },
        {
          MR_Id: '124',
          'Report Type': 'Medical Report',
          CareProvider: 'Dr. Maryam',
          'Issued Date': '2024-05-15',
        },
      ];

      const filteredReportsData = reportsData
        .filter((el: any) => el['Report Type'] === 'Medical Report')
        .slice(0, 3);

      if (filteredReportsData.length) {
        for (const report of filteredReportsData) {
          const reportUrl: string = `${process.env.BASEURL}/api-reverse-prod-v2/MedicalReportPDFV2/api/MedicalReport/Report?MRN=${urn}&MR_Id=${report.MR_Id}&user=Chatbot`;

          const filename: string = `medical_report-${urn}-${report.MR_Id}`;
          console.log(`Downloading file from ${reportUrl} to ${filename}.pdf`);

          const text: string = `${report.CareProvider.slice(0, 10)} ${report['Issued Date']}`;
          reportsArr.push({
            date: report['Issued Date'],
            text,
            url: `${uri}/storage/${filename}.pdf`,
            urn: '',
            nid: '',
          });
        }
        return {
          status_code: 1,
          reports: reportsArr,
        };
      } else {
        return {
          status_code: 0,
        };
      }
    } catch (e) {
      console.error('[ERROR]:', e);
      return {
        status_code: -1,
        message: 'Internal server error',
      };
    }
  }
  async medicalReportRequest(body: MedicalReportRequest): Promise<any> {
    try {
      let {
        nid,
        urn,
        type_of_report,
        email_address,
        comments,
        physician_name,
        source,
      } = body;

      urn = replaceArabicNumbers(urn);
      nid = replaceArabicNumbers(nid);

      const userData: any = [];

      if (userData) {
        console.log(
          `[NEW MEDICAL REPORT REQUEST][USER DATA]: ${JSON.stringify(userData)}`,
        );

        const ArabicName: string = '';
        const MobileNumber: string = '';

        const response = await axios.post(
          '/api-reverse-prod-v2/CRM/api/MedicalReport_Request/',
          {
            FullName: ArabicName,
            NationalID: nid,
            RegistrationNo: urn,
            MobileNumber: MobileNumber,
            TypeOfReport: type_of_report,
            EmailAddress: email_address,
            Comments: comments,
            TransportBy: 'Email',
            PhysicianName: physician_name,
            RequestSource: 'ChatBot',
            UserAgent: `KKESH ${source}`,
            UserHostName: '3EF6C861-39BD6488-F09C863D-77F76158',
          },
        );

        console.log(response.data);

        if (response.data.Responsestatus.isSuccess === 1) {
          return {
            status_code: 1,
          };
        } else if (response.data.Responsestatus.errorCode === -1) {
        }
      } else {
        return {
          status_code: 0,
        };
      }
    } catch (e) {
      console.error('[ERROR]:', e);
      return {
        status_code: -1,
        message: 'Internal server error',
      };
    }
  }
}
