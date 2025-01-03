export const env = {
  SITE_ORIGIN: process.env.SITE_ORIGIN!,
  JWT_SECRET: process.env.JWT_SECRET!,
  SMTP_PASS_RESTORE_PASSWORD: process.env.SMTP_PASS_RESTORE_PASSWORD!,
  SMTP_PASS_NOREPLY: process.env.SMTP_PASS_NOREPLY!,
  PASSWORD_PEPPER: process.env.PASSWORD_PEPPER!,
}

for (const [name, value] of Object.entries(env)) {
  if (value == null) throw new Error(`${name} environment variable must be provided`)
}
