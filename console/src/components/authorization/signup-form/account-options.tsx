import { useState, type ChangeEvent, type FC } from "react";
import { InfoIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/form/field-error";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import type { AccountValueTypes } from "@/types/authoriaztion";

export const AccountOptions: FC<{
  defaultValue: AccountValueTypes;
  errors: Record<string, string>;
}> = ({ defaultValue, errors }) => {
  const [accountValue, setAccountValue] =
    useState<AccountValueTypes>(defaultValue);

  return (
    <>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password-confirm">Создать аккаунт?</Label>
        </div>
        <RadioGroup
          name="account"
          defaultValue={accountValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setAccountValue(e.target.value as AccountValueTypes)
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default_name" id="r1" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label className="flex gap-1" htmlFor="r1">
                    Создать аккаунт по-умолчанию <InfoIcon size={15} />
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  Выберите этот вариант, если вы — единственный пользователь
                  <br />
                  системы и вам нужно поскорее начать работу.
                  <br />
                  Впоследствии имя можно будет изменить
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="set_name" id="r2" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label className="flex gap-1" htmlFor="r2">
                    Выбрать название аккаунта <InfoIcon size={15} />
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  Выберите этот вариант, если вы планируете
                  <br /> приглашать участников в проект
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no_account" id="r3" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label className="flex gap-1" htmlFor="r3">
                    Аккаунт не нужен <InfoIcon size={15} />
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  Выберите этот вариант, если планируете
                  <br />
                  что вас пригласят в уже существующий аккаунт
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </RadioGroup>
        <FieldError errors={errors} field="account" />
      </div>
      {accountValue === "set_name" && (
        <div className="grid gap-2">
          <Label htmlFor="account_name">Название аккаунта</Label>
          <Input
            id="account_name"
            type="text"
            name="account_name"
            placeholder=""
            maxLength={255}
            required
          />
          <FieldError errors={errors} field="account_name" />
        </div>
      )}
    </>
  );
};
