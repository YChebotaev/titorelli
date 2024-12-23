import { type SignupFormState } from '@/components/authorization/signup-form'

export const sessionTokenCookieName = 'SID'

export const signupFormInitialState: SignupFormState = {
  defaultValues: {
    username: "",
    email: "",
    phone: "",
    accept_terms: false,
    accept_pdp: false,
    accept_subscription: false,
  },
  errors: {},
}
