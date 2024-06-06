import * as _ from 'lodash';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const SMS_PROVIDER_BASE_URL = process.env.SMS_PROVIDER_BASE_URL;
const SMS_PROVIDER_USERNAME = process.env.SMS_PROVIDER_USERNAME;
const SMS_PROVIDER_PASSWORD = process.env.SMS_PROVIDER_PASSWORD;
const SMS_PROVIDER_SENDER_NAME = process.env.SMS_PROVIDER_SENDER_NAME;

const numbers: { en: string; ar: string }[] = [
  { en: '0', ar: '٠' },
  { en: '1', ar: '١' },
  { en: '2', ar: '٢' },
  { en: '3', ar: '٣' },
  { en: '4', ar: '٤' },
  { en: '5', ar: '٥' },
  { en: '6', ar: '٦' },
  { en: '7', ar: '٧' },
  { en: '8', ar: '٨' },
  { en: '9', ar: '٩' },
];

export const replaceArabicNumbers = (str: string): string => {
  const english = /^[A-Za-z0-9]*$/;
  if (!english.test(str)) {
    str = str
      .split('')
      .map((char: string) => {
        const number = _.findWhere(numbers, { ar: char });
        if (number) {
          return number.en;
        }
        return char;
      })
      .join('');
  }
  return str;
};

export const checkValidDate = (date: string): string | boolean => {
  let date_separator: string | undefined;
  for (let index = 0; index < date.length; index++) {
    const element = date[index];
    if (isNaN(parseInt(element))) {
      date_separator = element;
      break;
    }
  }

  if (!date_separator) {
    return false;
  }

  const [day, month, year] = date.split(date_separator);

  const dayNumber = parseInt(day);
  const monthNumber = parseInt(month);
  let yearNumber = parseInt(year);

  if (isNaN(dayNumber) || isNaN(monthNumber) || isNaN(yearNumber)) {
    return false;
  }

  if (yearNumber === 0) {
    yearNumber = new Date().getFullYear();
  }

  const daysInMonth = new Date(yearNumber, monthNumber, 0).getDate();

  if (dayNumber < 1 || dayNumber > daysInMonth) {
    return false;
  }

  if (monthNumber < 1 || monthNumber > 12) {
    return false;
  }

  const formattedDay = dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`;
  const formattedMonth =
    monthNumber < 10 ? `0${monthNumber}` : `${monthNumber}`;

  return `${formattedDay}-${formattedMonth}-${yearNumber}`;
};

export const convertTime12to24 = (time12h: string): string => {
  time12h = time12h.toLowerCase().replace(/\s+/g, '');

  const modifier = time12h.includes('pm') ? 'PM' : 'AM';
  const timePart = time12h.replace(modifier.toLowerCase(), '');

  const timeSeparator = timePart.includes(':') ? ':' : '.';
  const [hoursStr, minutesStr] = timePart.split(timeSeparator);

  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:00`;
};

export const validatePassword = (password: string): boolean => {
  if (password.length <= 10) {
    const stripped: string = password.replace(/[a-zA-Z0-9\-@*_]/g, '');
    if (stripped.length === 0) {
      return true;
    }
  }
  return false;
};

export const generatePassword = (): string => {
  return Math.random().toString(36).substring(2, 12);
};

export const generateOTP = (): number => {
  return Math.floor(1000 + Math.random() * 9000);
};

interface SMSProviderResponse {
  status: string;
  messageId: string;
}

export async function sendSMS(to: string, message: string): Promise<void> {
  try {
    const response = await axios.get<SMSProviderResponse>(
      SMS_PROVIDER_BASE_URL,
      {
        params: {
          UserName: SMS_PROVIDER_USERNAME,
          Password: SMS_PROVIDER_PASSWORD,
          MessageType: 'text',
          Recipients: to,
          SenderName: SMS_PROVIDER_SENDER_NAME,
          MessageText: message,
        },
      },
    );
    console.log(`SUCCESS SMS TO ${to} with content ${message}`);
    console.log(`Response:`, response.data);
  } catch (error) {
    console.error(`Failed SMS TO ${to} with content ${message}`);
    if (axios.isAxiosError(error)) {
      console.error('Error message:', error.message);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// export const syncFilesToOtherServers = async (
//   path: string,
//   name: string,
// ): Promise<void> => {
//   let otherServers = process.env.OTHER_SERVER_IPS;
//   const url = process.env.LOCAL_URL + path;

//   console.log(otherServers);

//   if (otherServers) {
//     console.log('in other servers block');
//     otherServers = otherServers.split(',');

//     const promises = otherServers.map((server) => {
//       return axios.post(server, {
//         url: url,
//         name: name,
//       });
//     });

//     try {
//       const results = await Promise.all(promises);
//       results.forEach((result) =>
//         console.log(`SUCCESS Sync File to ${result.config.url}`),
//       );
//     } catch (error) {
//       console.error(`Failed To Sync Files`);
//       if (axios.isAxiosError(error)) {
//         console.error('Error message:', error.message);
//         console.error('Response status:', error.response?.status);
//         console.error('Response data:', error.response?.data);
//       } else {
//         console.error('Unexpected error:', error);
//       }
//     }
//   }
// };

export const parseDate = (str: string): Date => {
  const mdy: string[] = str.split('-');
  console.log(mdy);
  return new Date(Number(mdy[0]), Number(mdy[1]) - 1, Number(mdy[2]));
};

export const dateDiff = (first: Date, second: Date): number => {
  // Take the difference between the dates and divide by milliseconds per day.
  // Round to nearest whole number to deal with DST.
  const diff: number = Math.round(
    (second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24),
  );

  return diff == 0 ? 1 : diff;
};

export const downloadFile = async (
  url: string,
  filename: string,
): Promise<void> => {
  const pathToSave: string = path.resolve(__dirname, 'public', filename);
  const writer: fs.WriteStream = fs.createWriteStream(pathToSave);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise<void>((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};
