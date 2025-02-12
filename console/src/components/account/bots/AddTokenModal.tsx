"use client";

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
import { FormProvider, useForm } from "react-hook-form";
import { StyledErrorMessage } from "@/components/form/field-error";

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToken: (name: string, description: string) => void;
}

export default function AddTokenModal({
  isOpen,
  onClose,
  onAddToken,
}: AddTokenModalProps) {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить токен доступа</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              onAddToken(values.name, values.description),
            )}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                {...form.register("name", {
                  required: "Обязательное поле",
                })}
              />
              <StyledErrorMessage name="name" />
            </div>
            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea id="description" {...form.register("description")} />
              <StyledErrorMessage name="description" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();

                  onClose();
                }}
              >
                Отмена
              </Button>
              <Button type="submit">Добавить</Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
