import { memo } from "react";
import { useFormContext } from "react-hook-form";
import slugify from "@sindresorhus/slugify";
import type { AddBotModalFormValues } from "./AddBotModal";

export const BotCodePreview = memo(() => {
  const form = useFormContext<AddBotModalFormValues>();

  return (
    <>
      {form.watch("name").trim().length > 0 && (
        <div className="text-gray-500 text-xs mt-1">
          Код: {slugify(form.watch("name"))}
        </div>
      )}
    </>
  );
});

BotCodePreview.displayName = "memo(BotCodePreview)";
