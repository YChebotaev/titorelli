import {
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
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailSubscriptionConfirmationProps {
  userFirstName: string;
  unsubscribeLink: string;
}

export default function EmailSubscriptionConfirmation({
  userFirstName = "Уважаемый пользователь",
  unsubscribeLink = "https://titorelli.ru/unsubscribe",
}: EmailSubscriptionConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Подтверждение подписки на рассылку Titorelli</Preview>
      <Tailwind>
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
              Подписка на рассылку подтверждена
            </Heading>
            <Text className="text-zinc-300 text-base mb-4">
              Здравствуйте, {userFirstName}!
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              Спасибо за подписку на рассылку Titorelli. Мы рады подтвердить,
              что вы успешно подписались на наши email-уведомления и
              маркетинговые материалы.
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              Что это значит для вас:
            </Text>
            <ul className="text-zinc-300 text-base mb-4 list-disc list-inside">
              <li>Вы будете получать наши последние новости и обновления</li>
              <li>
                Мы будем информировать вас о специальных предложениях и акциях
              </li>
              <li>
                Вы первыми узнаете о новых функциях и улучшениях нашего сервиса
              </li>
            </ul>
            <Text className="text-zinc-300 text-base mb-4">
              Мы ценим ваше время и обещаем не злоупотреблять вашим доверием. Вы
              всегда можете отписаться от рассылки, если решите, что она вам
              больше не нужна.
            </Text>
            <Section className="text-center my-8">
              <Button
                href="https://titorelli.ru/preferences"
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-8 rounded-full text-lg font-semibold no-underline inline-block transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Управление подпиской
              </Button>
            </Section>
            <Hr className="border-zinc-700 my-6" />
            <Text className="text-zinc-400 text-sm">
              Если вы не подписывались на нашу рассылку или хотите отписаться,
              пожалуйста, перейдите по этой{" "}
              <Link href={unsubscribeLink} className="text-zinc-500 underline">
                ссылке
              </Link>
            </Text>
            <Text className="text-zinc-400 text-sm mt-4">
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
      </Tailwind>
    </Html>
  );
}
