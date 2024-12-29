import {
  Tailwind,
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface SubscriptionConfirmationProps {
  userFirstName: string;
  planName: string;
  nextBillingDate: string;
  managementLink: string;
}

export default function SubscriptionConfirmation({
  userFirstName = "Уважаемый пользователь",
  planName = "Базовый",
  nextBillingDate = "01.01.2024",
  managementLink = "https://titorelli.ru/account/subscription",
}: SubscriptionConfirmationProps) {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Подтверждение подписки на Titorelli</Preview>
        <Body className="bg-zinc-900 font-sans">
          <Container className="mx-auto px-6 py-8 w-full max-w-xl">
            <Img
              src={`https://titorelli.ru/logo.png`}
              width="170"
              height="50"
              alt="Логотип Titorelli"
              className="mx-auto mb-6"
            />
            <Heading className="text-zinc-100 text-2xl font-bold text-center mb-4">
              Подписка подтверждена
            </Heading>
            <Text className="text-zinc-300 text-base mb-4">
              Здравствуйте, {userFirstName}!
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              Спасибо за подписку на Titorelli. Мы рады подтвердить, что ваша
              подписка на план "{planName}" успешно активирована.
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              Детали вашей подписки:
            </Text>
            <ul className="text-zinc-300 text-base mb-4 list-disc list-inside">
              <li>План: {planName}</li>
              <li>Следующая дата оплаты: {nextBillingDate}</li>
            </ul>
            <Text className="text-zinc-300 text-base mb-4">
              Вы можете управлять своей подпиской, включая изменение плана или
              отмену, в любое время через ваш личный кабинет.
            </Text>
            <Section className="text-center my-8">
              <Button
                href={managementLink}
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-8 rounded-full text-lg font-semibold no-underline inline-block transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Управление подпиской
              </Button>
            </Section>
            <Text className="text-zinc-300 text-base mb-4">
              Если у вас возникнут вопросы о вашей подписке или вам понадобится
              помощь, наша команда поддержки всегда готова помочь.
            </Text>
            <Hr className="border-zinc-700 my-6" />
            <Text className="text-zinc-400 text-sm">
              Если у вас есть вопросы, пожалуйста, не стесняйтесь обращаться к
              нам по адресу{" "}
              <Link
                href="mailto:support@titorelli.ru"
                className="text-zinc-500 underline"
              >
                support@titorelli.ru
              </Link>
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
