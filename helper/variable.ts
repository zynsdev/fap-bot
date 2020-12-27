import * as dotenv from 'dotenv';
dotenv.config();
export const URL_FAP = process.env.URL_FAP || 'http://fap.fpt.edu.vn/'
export const EMAIL = process.env.EMAIL || ''
export const PASS = process.env.PASS || ''
export const CAMPUS_CODE = process.env.CAMPUS_CODE || ''
export const TERM_CODE = process.env.TERM_CODE || ''
export const PORT = process.env.PORTT || 1337
export const VERIFY_TOKEN = process.env.VERIFY_TOKEN || ''