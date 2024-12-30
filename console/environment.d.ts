declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL?: string
      PASSWORD_PEPPER?: string
      JWT_SECRET?: string
      SMTP_PASS_RESTORE_PASSWORD?: string
      SITE_ORIGIN?: string
    }
  }
}

declare module 'do-usernames' {
  export default any
}
