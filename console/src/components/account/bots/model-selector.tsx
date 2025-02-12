import { StyledErrorMessage } from "@/components/form/field-error";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { memo } from "react";
import { useFormContext } from "react-hook-form";
import { AddBotModalFormValues } from "./AddBotModal";
import { FormField } from "@/components/ui/form";
import { genericModelCode } from "@/constants";

export const ModelSelector = memo(() => {
  const form = useFormContext<AddBotModalFormValues>();

  return (
    <div>
      <Label htmlFor="model">Модель</Label>
      <FormField
        control={form.control}
        name="modelCode"
        render={({ field }) => (
          <Select
            name={field.name}
            value={field.value}
            defaultValue={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выбрать модель" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={genericModelCode}>Generic</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
      <StyledErrorMessage name="modelId" />
    </div>
  );
});

ModelSelector.displayName = "memo(ModelSelector)";
