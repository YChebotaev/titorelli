"use client";

import { Suspense, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import AddTokenModal from "./AddTokenModal";
import { FormProvider, useForm } from "react-hook-form";
import { BotCreateRequestDataVm } from "@/types/bot";
import { useBotControls } from "@/hooks/use-bot-controls";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSchema } from "./schema";
import { StyledErrorMessage } from "@/components/form/field-error";
import { BotCodePreview } from "./bot-code-preview";
import { ModelSelector } from "./model-selector";
import { genericModelCode } from "@/constants";
import { FormField } from "@/components/ui/form";
import { TokenSelector, TokenSelectorSkeleton } from "./token-selector";
import { useAddToken } from "@/hooks/use-add-token";

interface AddBotModalProps {
  isOpen: boolean;
  accountId: string;
  onClose: () => void;
}

export type AddBotModalFormValues = Omit<
  BotCreateRequestDataVm,
  "accessTokenId"
> & {
  accessTokenId: BotCreateRequestDataVm["accessTokenId"] | null;
};

export function AddBotModal({ isOpen, accountId, onClose }: AddBotModalProps) {
  const form = useForm<AddBotModalFormValues>({
    defaultValues: {
      name: "",
      description: "",
      bypassTelemetry: false,
      modelCode: genericModelCode,
      tgBotToken: "",
      accessTokenId: null,
    },
    resolver: zodResolver(createSchema, { async: true }),
  });

  const { createMutation } = useBotControls(accountId);
  const { mutateAsync: addTokenAsyncMutation } = useAddToken(String(accountId));

  const [isAddTokenModalOpen, setIsAddTokenModalOpen] = useState(false);

  const handleAddToken = async (name: string, description: string) => {
    const newToken = await addTokenAsyncMutation({ name, description });

    // Если апдейт пройдет позже таймаута, то значение не автовыберется в списке
    // Не особо критично, но нужно будет поправить
    setTimeout(() => {
      form.setValue("accessTokenId", newToken.id);
    }, 600);

    setIsAddTokenModalOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Создать бота</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              createMutation(values as BotCreateRequestDataVm, {
                onSuccess() {
                  onClose();
                },
              }),
            )}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Название</Label>
              <Input id="name" {...form.register("name")} />
              <StyledErrorMessage name="name" />
              <BotCodePreview />
            </div>
            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea id="description" {...form.register("description")} />
              <StyledErrorMessage name="description" />
            </div>
            <div>
              <Label htmlFor="tg-bot-token">Токен бота из BotFather-а</Label>
              <Textarea id="tg-bot-token" {...form.register("tgBotToken")} />
              <StyledErrorMessage name="tgBotToken" />
            </div>
            <ModelSelector />
            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="bypassTelemetry"
                render={({ field }) => (
                  <Checkbox
                    ref={field.ref}
                    id="telemetry"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
              <Label htmlFor="telemetry">Отключить телеметрию</Label>
            </div>
            <Suspense fallback={<TokenSelectorSkeleton />}>
              <TokenSelector
                accountId={accountId}
                onClickAdd={() => setIsAddTokenModalOpen(true)}
              />
            </Suspense>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();

                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Создать</Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
      <AddTokenModal
        isOpen={isAddTokenModalOpen}
        onClose={() => setIsAddTokenModalOpen(false)}
        onAddToken={handleAddToken}
      />
    </Dialog>
  );
}
