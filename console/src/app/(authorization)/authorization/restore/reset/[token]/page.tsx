import { redirect } from "next/navigation";
import { AuthorizationLayout } from "@/layouts/authorization-layout";
import { resetPassword } from "@/server-actions/authorization/reset-password";
import { ResetPasswordForm } from "@/components/authorization/reset-password-form";
import { getEmailService } from "@/lib/server/services/instances";

export default async function ResetPasswordEmailLandingPage(props: {
  params: Promise<{
    token: string;
  }>;
}) {
  const emailService = getEmailService()

  const token = (await props.params).token;

  const success =
    await emailService.validateRestorePasswordTokenFromEmail(token);

  if (!success) redirect("/authorization/restore/reset/fail");

  return (
    <AuthorizationLayout coverImageVariant="restore">
      <ResetPasswordForm token={token} action={resetPassword} />
    </AuthorizationLayout>
  );
}
