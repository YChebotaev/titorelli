"use client";

import { useEffect, useRef, useState, type FC } from "react";
import Link from "next/link";

export const RedirectLink: FC = () => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [secondsLeft, setSecondsLeft] = useState(4);

  useEffect(() => {
    const update = () => {
      setSecondsLeft((s) => s - 1);
    };

    const int = setInterval(update, 1000);

    return () => {
      clearInterval(int);
    };
  }, []);

  useEffect(() => {
    if (secondsLeft <= 1) {
      ref.current?.click();
    }
  }, [secondsLeft]);

  return (
    <Link ref={ref} href="/authorization/signin">
      Вы будете перенаправлены на страницу логина через {secondsLeft} секунд
    </Link>
  );
};
