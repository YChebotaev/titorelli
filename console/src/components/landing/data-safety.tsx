import { Container } from "./container";

export function DataSafety() {
  return (
    <section className="py-24 bg-background">
      <Container>
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Безопасность данных</h2>
          <p className="text-xl text-muted-foreground">
            Мы понимаем, насколько важна для вас безопасность ваших данных,
            поэтому мы используем самые современные технологии шифрования и
            аутентификации. Ваши данные хранятся на наших серверах в
            зашифрованном виде, и доступ к ним имеют только авторизованные
            пользователи.
          </p>
        </div>
      </Container>
    </section>
  );
}
