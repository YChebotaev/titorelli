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

interface ProjectRemovalNotificationProps {
  memberName: string;
  projectName: string;
  ownerName: string;
  supportLink: string;
}

export default function ProjectRemovalNotification({
  memberName = "Уважаемый участник",
  projectName = "Название проекта",
  ownerName = "Владелец проекта",
  supportLink = "https://titorelli.ru/support",
}: ProjectRemovalNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Уведомление об удалении проекта {projectName} на Titorelli
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
              Уведомление об удалении проекта
            </Heading>
            <Text className="text-zinc-300 text-base mb-4">
              Здравствуйте, {memberName}!
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              Мы сообщаем вам, что проект "{projectName}", участником которого
              вы являлись, был удален владельцем {ownerName}.
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              Что это означает для вас:
            </Text>
            <ul className="text-zinc-300 text-base mb-4 list-disc list-inside">
              <li>Все данные, связанные с проектом, были удалены</li>
              <li>Доступ к проекту больше невозможен</li>
              <li>
                Все совместные ресурсы, связанные с проектом, также удалены
              </li>
            </ul>
            <Text className="text-zinc-300 text-base mb-4">
              Если у вас остались какие-либо важные данные или информация,
              связанные с этим проектом, рекомендуем сохранить их в другом
              месте, если вы еще этого не сделали.
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              Если у вас есть вопросы относительно удаления проекта или вам
              нужна дополнительная информация, пожалуйста, обратитесь в нашу
              службу поддержки.
            </Text>
            <Section className="text-center my-8">
              <Button
                href={supportLink}
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-8 rounded-full text-lg font-semibold no-underline inline-block transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Связаться со службой поддержки
              </Button>
            </Section>
            <Hr className="border-zinc-700 my-6" />
            <Text className="text-zinc-400 text-sm">
              Если у вас возникли дополнительные вопросы, пожалуйста, обратитесь
              в нашу службу поддержки по адресу{" "}
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
