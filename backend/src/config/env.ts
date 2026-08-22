import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5001', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dayflow_admin:dayflow_secure_pass_2026@localhost:5432/dayflow_hrms?schema=public',
  JWT_SECRET: process.env.JWT_SECRET || 'dayflow_super_secret_jwt_key_2026_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
  COMPANY_CODE: process.env.COMPANY_CODE || 'OI',
  AI_API_KEY: process.env.AI_API_KEY || '',
};
