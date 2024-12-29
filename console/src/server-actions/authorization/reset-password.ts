'use server'

import { type ResetFormState } from "@/components/authorization/reset-password-form";
import { UserService } from "@/lib/server/services/user-service";

export const resetPassword = async (prevState: ResetFormState, form: FormData) => {
  const userService = new UserService()

  const token = form.get('token')?.toString()
  const passwordNew = form.get('password_new')?.toString()
  const passwordConfirm = form.get('password_confirm')?.toString()

  const nextState: ResetFormState = {
    success: null,
    errors: {}
  }

  if (!token) {
    nextState.errors._global = 'Не указан ключ для восстановления пароля'

    return nextState
  }

  if (!passwordNew) {
    nextState.errors.password_new = 'Пароль не указан'

    return nextState
  }

  if (!passwordConfirm) {
    nextState.errors.password_confirm = 'Подтверждение пароля не указано'

    return nextState
  }

  if (passwordNew !== passwordConfirm) {
    nextState.errors.password_confirm = 'Подтверждение не совпадает с паролем'

    return nextState
  }

  const success = await userService.tryReset(token, passwordNew)

  if (!success) {
    nextState.errors._global = 'Неизвестная ошибка. Обратитесь в службу поддержки или попробуйте позже'

    return nextState
  }

  return {
    ...nextState,
    success: true
  };
}
