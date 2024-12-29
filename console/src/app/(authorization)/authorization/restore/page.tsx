import { RestorePasswordForm } from "@/components/authorization/restore-password-form";
import { AuthorizationLayout } from "@/layouts/authorization-layout";
import { restorePassword } from "@/server-actions/authorization/restore-password";

export default function RestorePasswordPage() {
  return (
    <AuthorizationLayout coverImageVariant="restore">
      <RestorePasswordForm action={restorePassword} />
    </AuthorizationLayout>
  )
}
