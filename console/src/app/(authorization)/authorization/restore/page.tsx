import { RestorePasswordForm } from "@/components/authorization/restore-password-form";
import { AuthorizationLayout } from "@/layouts/authorization-layout";
import { restorePassword } from "@/server-actions/authorization/restore-password";

export default function RestorePasswordPage() {
  return (
    <AuthorizationLayout coverImageVariant="restore">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <RestorePasswordForm action={restorePassword as any} />
    </AuthorizationLayout>
  )
}
