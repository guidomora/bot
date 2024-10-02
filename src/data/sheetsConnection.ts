// import { sheets_v4 } from "googleapis";
// import path from "path";

// const { google } = require('googleapis');

// const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

// const auth = new google.auth.GoogleAuth({
//   keyFile: CREDENTIALS_PATH,
//   scopes: ['https://www.googleapis.com/auth/spreadsheets']
// })

// export async function writeToSheet(values: any): Promise<sheets_v4.Schema$UpdateValuesResponse | undefined> {
//   const sheets = google.sheets({ version: 'v4', auth })
//   const spreadsheetId = '1bYiO91voc2Zh0foa9oSFB54n5AUyqjShVBxO-V6eFUg'
//   const range = 'Sheet1!A3:A13'
//   const valueInputOption = 'USER_ENTERED'
//   const resource = { values }

//   try {
//     const res = await sheets.spreadsheets.values.update({
//       spreadsheetId, range, valueInputOption, resource
//     })
//     return res
//   } catch (error) {
//     console.log(error);

//   }
// }

import { google } from 'googleapis';
import { envs } from '../config/envs';


const auth = new google.auth.GoogleAuth({
  credentials:{
    private_key:envs.GOOGLE_PRIVATE_KEY?.replace(/\\n/gm, '\n'),
    client_email:envs.GOOGLE_CLIENT_EMAIL,
  
  },
  projectId:envs.GOOGLE_PROJECT_ID,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

export default auth;
