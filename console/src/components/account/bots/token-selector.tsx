import { StyledErrorMessage } from "@/components/form/field-error";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { memo } from "react";
import { useFormContext } from "react-hook-form";
import { AddBotModalFormValues } from "./AddBotModal";
import { useGetTokens } from "@/hooks/use-get-tokens";
import { FormField } from "@/components/ui/form";

export const TokenSelector = memo(
  ({ accountId, onClickAdd }: { accountId: string; onClickAdd(): void }) => {
    const form = useFormContext<AddBotModalFormValues>();
    const { data: tokens } = useGetTokens(accountId, {});

    return (
      <div>
        <Label htmlFor="accessToken">Токен доступа</Label>
        <div className="flex space-x-2">
          <FormField
            control={form.control}
            name="accessTokenId"
            render={({ field }) => (
              <Select
                name={field.name}
                value={field.value ?? undefined}
                defaultValue={field.value ?? undefined}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="flex-grow">
                  <SelectValue placeholder="Выбрать токен доступа" />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map(({ id, name }) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <Button type="button" onClick={onClickAdd}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Или добавить
          </Button>
        </div>
        <StyledErrorMessage name="accessTokenId" />
      </div>
    );
  },
);

TokenSelector.displayName = "memo(TokenSelector)";

export const TokenSelectorSkeleton = memo(() => {
  return (
    <div>
      <Label htmlFor="accessToken">Токен доступа</Label>
      <div className="flex space-x-2">
        <Select disabled>
          <SelectTrigger className="flex-grow">
            <SelectValue placeholder="Загружается..." />
          </SelectTrigger>
        </Select>
        <Button disabled type="button">
          <PlusCircle className="w-4 h-4 mr-2" />
          Или добавить
        </Button>
      </div>
    </div>
  );
});

TokenSelectorSkeleton.displayName = "memo(TokenSelectorSkeleton)";
