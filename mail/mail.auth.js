import dotenv from 'dotenv';
import SibApiV3Sdk from 'sib-api-v3-sdk';

dotenv.config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = process.env.API_KEY;

export const sender = {
  name: "ayss",
  email: process.env.SENDER_MAIL
}
export const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

