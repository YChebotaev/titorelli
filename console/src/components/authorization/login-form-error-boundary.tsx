"use client";

import { type FC, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LoginForm } from "../login-form";
import { login } from "@/server-actions/authorization/login";

const FallbackComponent: FC<{ error: any }> = ({ error }) => {
  const errors: Record<string, string> = {};

  if (error.message === "Email not provided") {
    errors.email = error.message;
  }

  if (error.message === "Password not provided") {
    errors.password = error.message;
  }

  if (error.message === "Such user not found") {
    errors._global = error.message;
  }

  if (error.messsage === "Such user not found") {
    errors._global = error.message;
  }

  if (error.message === "Cannot login with given credentials") {
    errors._global = error.message;
  }

  return <LoginForm errors={errors} action={login} />;
};

export const LoginFormErrorBoundary: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      {children}
    </ErrorBoundary>
  );
};
