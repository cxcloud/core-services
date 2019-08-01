import * as aws from 'aws-sdk';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import { Options } from 'nodemailer/lib/mailer';
import * as config from 'config';

interface Props {
  emailAddress: string;
  senderEmail: string;
  subject: string;
  text?: string;
  templateFile?: string;
  templateParams?: object;
}

const transporter = nodemailer.createTransport({
  SES: new aws.SES({
    apiVersion: config.get<string>('ses.apiVersion'),
    region: config.get<string>('ses.region')
  })
});

const getMailOptions = async ({
  emailAddress,
  senderEmail,
  subject,
  text,
  templateFile,
  templateParams = {}
}: Props): Promise<Options> => {
  return new Promise(async (resolve: any, reject: any) => {
    const params = {
      from: senderEmail,
      to: emailAddress,
      subject
    };

    if (templateFile) {
      return ejs.renderFile(templateFile, templateParams).then((html: any) => {
        resolve({
          ...params,
          html
        });
      });
    }

    if (text) {
      return resolve({
        ...params,
        text
      });
    }

    reject(new Error('Missing text or templateFile'));
  });
};

export const sendEmail = (props: Props) =>
  getMailOptions(props).then(mailOptions => transporter.sendMail(mailOptions));
