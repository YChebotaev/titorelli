"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/form/field-error";
import { FieldHelp } from "@/components/form/field-help";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/form/phone-input";
import { signupFormInitialState } from "@/constants";

export type SignupFormProps = React.ComponentPropsWithoutRef<"form">;

export type SignupFormState = {
  defaultValues: {
    username: string;
    email: string;
    phone: string;
    accept_terms: boolean;
    accept_pdp: boolean;
    accept_subscription: boolean;
  };
  errors: {
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
    password_confirm?: string;
    accept_terms?: string;
    accept_pdp?: string;
    accept_subscription?: string;
  };
};

export function SignupForm({ className, action, ...props }: SignupFormProps) {
  const [{ defaultValues, errors }, formAction] =
    useActionState<SignupFormState>(action, signupFormInitialState);

  console.log("defaultValues =", defaultValues);
  console.log("errors =", errors);

  return (
    <form
      // method="POST"
      action={formAction}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">Регистрация</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Заполните информацию, чтобы зарегистрироваться
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="username">Ник</Label>
          <FieldError errors={errors} field="username" />
          <Input
            id="username"
            type="text"
            name="username"
            defaultValue={defaultValues.username}
            placeholder=""
            /*required*/
          />
          <FieldHelp>Через ник можно будет войти</FieldHelp>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            defaultValue={defaultValues.email}
            placeholder="oleg@example.com"
            /*required*/
          />
          <FieldError errors={errors} field="email" />
          <FieldHelp>
            На email можно будет восстановить пароль, а так же будут приходить
            уведомления
          </FieldHelp>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Номер телефона</Label>
          <PhoneInput
            id="phone"
            type="tel"
            name="phone"
            defaultValue={defaultValues.phone}
            placeholder="+7 123 456 78 90"
            /*required*/
          />
          <FieldError errors={errors} field="phone" />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Пароль</Label>
          </div>
          <Input id="password" type="password" name="password" /*required*/ />
          <FieldError errors={{}} field="password" />
          <FieldHelp>Пароль нужно вводить при входе</FieldHelp>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password-confirm">Подтверждение пароля</Label>
          </div>
          <Input
            id="password-confirm"
            type="password"
            name="password_confirm"
            /*required*/
          />
          <FieldError errors={errors} field="password" />
        </div>
        <div className="grid gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Checkbox
                defaultChecked={defaultValues.accept_terms}
                name="accept_terms"
                id="accept-terms"
                /*required*/
              ></Checkbox>
              <label
                htmlFor="accept-terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Принимаю условия обслуживания
              </label>
            </div>
            <div className="ml-6">
              <FieldError errors={errors} field="accept_terms" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Checkbox
                defaultChecked={defaultValues.accept_pdp}
                name="accept_pdp"
                id="accept-pdp"
                /*required*/
              ></Checkbox>
              <label
                htmlFor="accept-pd["
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Cогласие на обработку персональных данных
              </label>
            </div>
            <div className="ml-6">
              <FieldError errors={errors} field="accept_pdp" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Checkbox
                defaultChecked={defaultValues.accept_subscription}
                name="accept_subscription"
                id="accept-subscription"
                /*required*/
              ></Checkbox>
              <label
                htmlFor="accept-subscription"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Подписка на рассылку на указанный email
              </label>
            </div>
            <div className="ml-6">
              <FieldError errors={errors} field="accept_subscription" />
            </div>
          </div>
        </div>
        <Button type="submit" className="w-full">
          Зарегистрироваться
        </Button>
        <FieldError errors={{}} field="_global" />
      </div>
      <div className="text-center text-sm">
        Уже есть аккаунт?{" "}
        <Link
          href="/authorization/signin"
          className="underline underline-offset-4"
        >
          Войти
        </Link>
      </div>
    </form>
  );
}
