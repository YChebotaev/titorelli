import { type SignupFormState } from '@/components/authorization/signup-form'
import { type SigninFormState } from '@/components/authorization/signin-form'
import { type RestoreFormState } from '@/components/authorization/restore-form'
import { type AddConcactFormState } from '@/components/my-profile/contacts-list/add-contact-form'

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
