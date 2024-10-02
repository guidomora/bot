

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
