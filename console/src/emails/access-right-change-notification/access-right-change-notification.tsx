import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

interface AccessRightsChangeEmailProps {
  userName: string;
  projectName: string;
  oldRole: string;
  newRole: string;
}

export default function AccessRightsChangeEmail({
  userName = "Иван Петров",
  projectName = "Мой проект",
  oldRole = "редактор",
  newRole = "владелец",
}: AccessRightsChangeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Изменение прав доступа в проекте {projectName} на Titorelli
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
              Изменение прав доступа
            </Heading>
            <Text className="text-zinc-300 text-base mb-4">
              Здравствуйте, {userName}!
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              Ваши права доступа в проекте "{projectName}" на платформе
              Titorelli были изменены.
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              Ваша роль изменилась с "{oldRole}" на "{newRole}".
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              Если вы считаете, что это изменение произошло по ошибке или у вас
              есть вопросы, пожалуйста, свяжитесь с администратором проекта или
              нашей службой поддержки.
            </Text>
            <Hr className="border-zinc-700 my-6" />
            <Text className="text-zinc-400 text-sm">
              Если вам нужна помощь, пожалуйста, обратитесь в нашу службу
              поддержки по адресу{" "}
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
