import 'dotenv/config'
import * as env from 'env-var';

export const envs = {
    PORT:env.get('PORT').default(3000).asPortNumber(),
    PUBLIC_PATH: env.get("PUBLIC_PATH").default('public').asString(),
    API: env.get("API").required().asString(),
    CLIENT_ID: env.get("CLIENT_ID").required().asString(),
    GOOGLE_PRIVATE_KEY: env.get("GOOGLE_PRIVATE_KEY").required().asString(),
    GOOGLE_CLIENT_EMAIL: env.get("GOOGLE_CLIENT_EMAIL").required().asString(),
    GOOGLE_PROJECT_ID: env.get("GOOGLE_PROJECT_ID").required().asString(),
    GOOGLE_PRIVATE_KEY_ID: env.get("CLIENT_ID").required().asString(),
    SPREADSHEET_ID:env.get("SPREADSHEET_ID").required().asString(),
    TWILIO_ID:env.get("TWILIO_ID").required().asString(),
    TWILIO_TKN:env.get("TWILIO_TKN").required().asString(),
}