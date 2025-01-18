"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

const tryToMakeZodError = (error: Error & { digest?: string }) => {
  try {
    const json = JSON.parse(error.message);
    const r = new ZodError(json);

    Reflect.set(r, "digest", error.digest);

    return r as ZodError & { digest?: string };
  } catch (e) {
    console.trace("suppress error:", e);

    return null;
  }
};

export default function Error({
  error: propsError,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const error = tryToMakeZodError(propsError) ?? propsError;
  const message =
    error instanceof ZodError ? fromZodError(error).message : error.message;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow flex items-center justify-center p-0 sm:p-4">
        <Card className="w-full max-w-2xl sm:rounded-lg sm:shadow-md border-0 sm:border">
          <CardHeader className="sm:pt-6 pt-4">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-primary">
              Упс! Что-то пошло не так
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-4 sm:px-6">
            <p className="text-center text-muted-foreground">
              Не волнуйтесь! Мы уже работаем над решением этой проблемы. Наша
              команда экспертов прилагает все усилия, чтобы все быстро
              заработало. Спасибо за ваше терпение и понимание!
            </p>
            <div className="flex flex-col items-center space-y-4">
              <QRCodeSVG
                value={`https://error-tracking.titorelli.ru/error/${error.digest}`}
                size={128}
                level="M"
                includeMargin={true}
              />
              <p className="text-sm text-center text-muted-foreground">
                Код ошибки: {error.digest}
              </p>
              <p className="text-sm text-center text-muted-foreground">
                Текст ошибки: {message}
              </p>
              <p className="text-sm text-center text-muted-foreground max-w-md">
                Если эта операция важна для вас прямо сейчас, пожалуйста,
                сделайте скриншот QR-кода. Отправьте его нашей службе поддержки,
                и мы постараемся ускорить решение вашего вопроса.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 px-4 sm:px-6 pb-6">
            <Button onClick={() => reset()}>Попробовать снова</Button>
            <Button variant="outline" asChild>
              <Link href="/">Вернуться на главную</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground px-4">
        <p>
          Нужна помощь? Наша служба поддержки всегда готова помочь вам по адресу
          support@titorelli.ru или на странице titorelli.ru/support
        </p>
      </footer>
    </div>
  );
}
