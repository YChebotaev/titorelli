"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createAccount } from "@/server-actions/my-profile/create-account";
import { X } from "lucide-react";
import {
  SelectTrigger,
  SelectValue,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { objectToFormData } from "@/lib/form-data";

const memberSchema = z.object({
  identity: z.string().min(1, "Идентификатор участника обязателен"),
  role: z.enum(["viewer", "editor"]),
});

const formSchema = z.object({
  accountName: z
    .string()
    .min(1, "Название аккаунта обязательно")
    .max(255, "Название аккаунта должно быть не более 255 символов"),
  members: z.array(memberSchema),
});

export type AddAccountFormValues = z.infer<typeof formSchema>;

export function AddAccountModal() {
  const [open, setOpen] = useState(false);
  const form = useForm<AddAccountFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountName: "",
      members: [],
    },
  });

  const submitHandler = async (values: AddAccountFormValues) => {
    const formData = objectToFormData(values);

    const result = await createAccount(formData);

    console.log("result =", result);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Добавить аккаунт</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Добавить новый аккаунт</DialogTitle>
          <DialogDescription>
            Создайте новый аккаунт и пригласите участников.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            // action={formAction}
            onSubmit={form.handleSubmit(submitHandler)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название аккаунта</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите название аккаунта" {...field} />
                  </FormControl>
                  <FormDescription>
                    Название должно быть уникальным среди всех аккаунтов на
                    платформе.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Label>Приглашенные участники</Label>
              <div>
                {form.watch("members").map((_, index) => (
                  <div key={index} className="flex space-x-2 mt-2">
                    <Input
                      {...form.register(`members.${index}.identity`)}
                      placeholder="Емейл, ник или номер телефона участника"
                      className="flex-grow"
                    />
                    <Select>
                      <SelectTrigger className="w-1/5">
                        <SelectValue placeholder="Роль" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="viewer">Просмотр</SelectItem>
                          <SelectItem value="editor">Редактирование</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const members = form.getValues("members");
                        members.splice(index, 1);
                        form.setValue("members", members);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const members = form.getValues("members");
                  members.push({ identity: "", role: "viewer" });
                  form.setValue("members", members);
                }}
                className="mt-2"
              >
                Добавить участника
              </Button>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Отмена
              </Button>
              <Button type="submit">Добавить аккаунт</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
