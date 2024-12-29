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

interface EmailRemovalNotificationProps {
  userName: string;
  removedEmail: string;
  cancellationLink: string;
  expirationDate: string;
}

export default function EmailRemovalNotification({
  userName = "Уважаемый пользователь",
  removedEmail = "user@example.com",
  cancellationLink = "https://titorelli.ru/cancel-email-removal?token=abc123",
  expirationDate = "15 июля 2023",
}: EmailRemovalNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Уведомление об удалении email адреса из вашего аккаунта Titorelli
      </Preview>
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
              Уведомление об удалении email адреса
            </Heading>
            <Text className="text-zinc-300 text-base mb-4">
              Здравствуйте, {userName}!
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              Мы хотим сообщить вам, что email адрес{" "}
              <span className="font-semibold">{removedEmail}</span> был удален
              из вашего аккаунта на платформе Titorelli.
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              Если это действие было выполнено по ошибке или вы хотите отменить
              удаление, у вас есть возможность восстановить этот email адрес в
              течение двух недель до{" "}
              <span className="font-semibold">{expirationDate}</span>.
            </Text>
            <Section className="text-center my-8">
              <Button
                href={cancellationLink}
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-8 rounded-full text-lg font-semibold no-underline inline-block transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Отменить удаление email
              </Button>
            </Section>
            <Text className="text-zinc-300 text-base mb-4">
              Если вы не отмените удаление до указанной даты, этот email адрес
              будет окончательно удален из вашего аккаунта, и вы больше не
              сможете использовать его для входа или получения уведомлений от
              Titorelli.
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              Если вы не запрашивали удаление этого email адреса, пожалуйста,
              немедленно свяжитесь с нашей службой поддержки, так как это может
              указывать на несанкционированный доступ к вашему аккаунту.
            </Text>
            <Section className="text-center">
              <Link
                href="https://titorelli.ru/support"
                className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-full text-base font-semibold no-underline inline-block transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Связаться со службой поддержки
              </Link>
            </Section>
            <Hr className="border-zinc-700 my-6" />
            <Text className="text-zinc-400 text-sm mb-4">
              Если у вас возникли вопросы или вам нужна помощь, пожалуйста,
              обратитесь в нашу службу поддержки по адресу{" "}
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
