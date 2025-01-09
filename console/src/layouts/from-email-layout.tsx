"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Container } from "@/components/site/container";
import Link from "next/link";

interface EmailConfirmationLandingProps {
  title?: string;
  description?: string;
  confirmText?: string | null;
  confirmButtonText?: string;
  confirmButtonHref?: string;
  cancelButtonText?: string;
  alertTitle?: string;
  alertDescription?: string;
  successTitle?: string;
  successMessage?: string;
  headerNode: ReactNode;
  // onConfirm: (token: string) => Promise<void>;
  // params: { token: string };
}

export function FromEmailLayout({
  title,
  description,
  confirmText = "Пожалуйста, подтвердите ваше действие, нажав на кнопку ниже.",
  confirmButtonText,
  confirmButtonHref,
  cancelButtonText,
  alertTitle,
  alertDescription,
  successTitle,
  successMessage,
  headerNode,
  // onConfirm,
  // params,
}: EmailConfirmationLandingProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleConfirmation = async () => {
    setIsConfirming(true);
    try {
      // await onConfirm(params.token);
      setIsConfirmed(true);
    } catch (err) {
      console.error(err);

      setError("Произошла ошибка. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsConfirming(false);
    }
  };

  if (error) {
    return (
      <>
        {headerNode}
        <div className="relative min-h-screen bg-gray-50">
          <div className="relative z-10">
            <Container className="pt-20">
              <Card className="w-full max-w-md mx-auto mt-8">
                <CardHeader>
                  <CardTitle>Ошибка</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{error}</p>
                </CardContent>
                <CardFooter>
                  <Link href="/">
                    <Button>Вернуться на главную</Button>
                  </Link>
                </CardFooter>
              </Card>
            </Container>
          </div>
        </div>
      </>
    );
  }

  if (isConfirmed) {
    return (
      <>
        {headerNode}
        <div className="relative min-h-screen bg-gray-50">
          <div className="relative z-10">
            <Container className="pt-20">
              <Card className="w-full max-w-md mx-auto mt-8">
                <CardHeader>
                  <CardTitle>{successTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{successMessage}</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => router.push("/")}>
                    Вернуться на главную
                  </Button>
                </CardFooter>
              </Card>
            </Container>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {headerNode}
      <div className="relative min-h-screen bg-gray-50">
        <div className="relative z-10">
          <Container className="py-20 flex flex-col items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
              <CardHeader>
                {title && <CardTitle>{title}</CardTitle>}
                {description && (
                  <CardDescription>{description}</CardDescription>
                )}
              </CardHeader>
              {confirmButtonText && confirmText && (
                <CardContent>
                  <p>{confirmText}</p>
                </CardContent>
              )}
              {(confirmButtonText || cancelButtonText) && (
                <CardFooter className="flex justify-end space-x-2">
                  {confirmButtonHref && (
                    <Link href={confirmButtonHref}>
                      <Button variant="default">{confirmButtonText}</Button>
                    </Link>
                  )}
                  {confirmButtonText && !confirmButtonHref && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="default">{confirmButtonText}</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          {alertTitle && (
                            <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
                          )}
                          {alertDescription && (
                            <AlertDialogDescription>
                              {alertDescription}
                            </AlertDialogDescription>
                          )}
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleConfirmation}
                            disabled={isConfirming}
                          >
                            {isConfirming ? "Обработка..." : "Подтвердить"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {cancelButtonText && (
                    <Link href="/">
                      <Button variant="outline">{cancelButtonText}</Button>
                    </Link>
                  )}
                </CardFooter>
              )}
            </Card>
          </Container>
        </div>
      </div>
    </>
  );
}
