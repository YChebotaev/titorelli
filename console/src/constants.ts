import { type SignupFormState } from '@/components/authorization/signup-form'
import { type SigninFormState } from '@/components/authorization/signin-form'
import { type RestoreFormState } from '@/components/authorization/restore-password-form'
import { type AddConcactFormState } from '@/components/my-profile/contacts-list/add-contact-form'
import { type ResetFormState } from '@/components/authorization/reset-password-form'

export const sessionTokenCookieName = 'SID'

export const signupFormInitialState: SignupFormState = {
  defaultValues: {
    username: "",
    email: "",
    phone: "",
    account: 'default_name',
    account_name: '',
    accept_terms: false,
    accept_pdp: false,
    accept_subscription: false,
  },
  errors: {},
}

export const signinFormInitialState: SigninFormState = {
  defaultValues: {
    identity: ""
  },
  errors: {},
}

export const restoreFormInitialState: RestoreFormState = {
  defaultValues: {
    identity: ""
  },
  errors: {},
}

export const addContactFormInitialState: AddConcactFormState = {
  success: null,
  defaultValues: {
    type: "",
    value: "",
  },
  errors: {},
};

export const resetFormInitialState: ResetFormState = {
  success: null,
  errors: {}
}
