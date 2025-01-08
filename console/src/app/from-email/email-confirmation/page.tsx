import { AnonymousHeader } from "@/components/site/header";
import { FromEmailLayout } from "@/layouts/from-email-layout";

export default function EmailConfirmationPage({
  params,
}: {
  params: { token: string };
}) {
  return (
    <FromEmailLayout
      title="Адрес электронной почты подтвержден"
      description="Спасибо за регистрацию. Теперь вы можете восстановить пароль на этот email."
      headerNode={<AnonymousHeader />}
    />
  );
}
