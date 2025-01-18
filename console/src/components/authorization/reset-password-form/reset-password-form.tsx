"use client";

import React, { useActionState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/form/field-error";
import { resetFormInitialState } from "@/constants";
import { RedirectLink } from "./redirect-link";
import { FieldHelp } from "@/components/form/field-help";

export type RestoreFormProps = React.ComponentPropsWithoutRef<"form"> & {
  token: string;
};

export type ResetFormState = {
  success?: boolean | null;
  errors: {
    _global?: string;
    password_new?: string;
    password_confirm?: string;
  };
};

export function ResetPasswordForm({
  className,
  action,
  token,
  ...props
}: RestoreFormProps) {
  const [{ success, errors }, formAction] = useActionState<ResetFormState>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action as any,
    resetFormInitialState,
  );

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6")}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold">Пароль сброшен</h1>
          <p className="text-balance text-sm text-muted-foreground">
            <RedirectLink />
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <input type="hidden" name="token" value={token} />
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">Сброс пароля</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Установите новый пароль для вашей учетной записи
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password-new">Пароль</Label>
          </div>
          <Input
            id="password-new"
            type="password"
            name="password_new"
            required
          />
          <FieldError errors={errors} field="password_new" />
          <FieldHelp>
            Запомните, запишите или сохрание пароль в надежном месте
          </FieldHelp>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password-confirm">Подтверждение пароля</Label>
          </div>
          <Input
            id="password-confirm"
            type="password"
            name="password_confirm"
            required
          />
          <FieldError errors={errors} field="password_confirm" />
        </div>
        <Button type="submit" className="w-full">
          Установить пароль
        </Button>
        <FieldError errors={{}} field="_global" />
      </div>
    </form>
  );
}
