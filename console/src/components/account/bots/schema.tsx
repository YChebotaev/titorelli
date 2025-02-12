import { z } from "zod";

export const createSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Обязательное поле" })
    .max(253, { message: "Слишком длинно" }),
  description: z
    .string()
    .trim()
    .max(254, { message: "Слишком длинно" })
    .optional(),
  bypassTelemetry: z.boolean(),
  modelCode: z.string(),
  accessTokenId: z.string({ message: "Выберите токен" }),
  tgBotToken: z.string({ message: "Обязательное поле" }).refine(
    async (token) => {
      try {
        const resp = await fetch(
          `https://api.telegram.org/bot${token}/getMe`,
        );
        const { ok } = (await resp.json()) as { ok: boolean };

        return ok;
      } catch (_e) {
        console.warn(_e)

        return true;
      }
    },
    { message: "Невалидный токен бота в телеграмме" },
  ),
});
