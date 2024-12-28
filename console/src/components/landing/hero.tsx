import { TitorelliLogo } from "./layout";
import { Container } from "./container";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
      <Container>
        <div className="text-center">
          <TitorelliLogo className="w-32 h-32 mx-auto mb-8" />
          <h1 className="text-4xl font-bold mb-4">
            Платформа для управления антиспамовыми ботами в Telegram.
          </h1>
          <p className="text-xl text-muted-foreground">
            Эффективное решение для автоматизации и контроля работы ваших ботов
          </p>
        </div>
      </Container>
    </section>
  );
}
