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

interface ProjectRemovalConfirmationProps {
  ownerName?: string;
  accountName: string;
  confirmationLink: string;
  cancellationLink: string;
}

export default function AccountRemovalConfirmation({
  ownerName = "Уважаемый пользователь",
  accountName,
  confirmationLink,
  cancellationLink,
}: ProjectRemovalConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Подтверждение удаления проекта {accountName} на Titorelli
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
              Подтверждение удаления проекта
            </Heading>
            <Text className="text-zinc-300 text-base mb-4">
              Здравствуйте, {ownerName}!
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              Мы получили запрос на удаление проекта "{accountName}" из вашего
              аккаунта на платформе Titorelli. Для обеспечения безопасности и
              предотвращения случайного удаления, мы просим вас подтвердить это
              действие.
            </Text>
            <Text className="text-zinc-300 text-base mb-4 font-semibold">
              Внимание: Это действие необратимо. После удаления проекта все
              связанные с ним данные будут потеряны.
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              Если вы уверены, что хотите удалить проект, нажмите кнопку ниже:
            </Text>
            <Section className="text-center my-8">
              <Button
                href={confirmationLink}
                className="bg-red-500 hover:bg-red-600 text-white py-4 px-8 rounded-full text-lg font-semibold no-underline inline-block transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Подтвердить удаление проекта
              </Button>
            </Section>
            <Text className="text-zinc-300 text-base mb-4">
              Если вы передумали или это действие было запрошено по ошибке, вы
              можете отменить удаление, перейдя по этой{" "}
              <Link
                href={cancellationLink}
                className="text-emerald-500 underline"
              >
                ссылке
              </Link>
              .
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              Если вы не запрашивали удаление проекта, пожалуйста, немедленно
              свяжитесь с нашей службой поддержки.
            </Text>
            <Hr className="border-zinc-700 my-6" />
            <Text className="text-zinc-400 text-sm">
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
