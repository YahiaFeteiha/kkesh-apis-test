export class CreateUserDto {
  id: number;
  name: string;
}

export interface DischargeSummary {
  urn: string;
  nid: string;
}

export interface DischargeReport {
  date: string;
  text: string;
  url: string;
}

export interface MedicalReport {
  urn: string;
  nid: string;
  date: string;
  text: string;
  url: string;
}

export interface MedicalReportRequest {
  nid: string;
  urn: string;
  type_of_report: string;
  email_address: string;
  comments: string;
  physician_name: string;
  source: string;
}
