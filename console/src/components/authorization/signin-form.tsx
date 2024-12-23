import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/form/field-error";
import Link from "next/link";

export type SigninFormProps = React.ComponentPropsWithoutRef<"form"> & {
  errors?: Record<"email" | "password", string>;
};

export function SigninForm({ className, ...props }: SigninFormProps) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">Авторизация</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Введите данные для авторизации
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email, телефон или ник</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="oleg@example.com"
            required
          />
          <FieldError errors={{}} field="email" />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Пароль</Label>
            <Link
              href="/authorization/restore"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Восстановление пароля
            </Link>
          </div>
          <Input id="password" type="password" name="password" required />
          <FieldError errors={{}} field="password" />
        </div>
        <Button type="submit" className="w-full">
          Войти
        </Button>
        <FieldError errors={{}} field="_global" />
      </div>
      <div className="text-center text-sm">
        Нет аккаунта?{" "}
        <Link
          href="/authorization/signup"
          className="underline underline-offset-4"
        >
          Зарегистрироваться
        </Link>
      </div>
    </form>
  );
}
