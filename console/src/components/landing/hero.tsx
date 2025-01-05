import { TitorelliLogo } from "../site/titorelli-logo";
import { Container } from "../site/container";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
      <Container>
        <div className="text-center">
          <TitorelliLogo className="w-32 h-32 mx-auto mb-8" />
          <h1 className="text-4xl font-bold mb-4">
            Платформа для антиспам-ботов в телеграмме
          </h1>
          <p className="text-xl text-muted-foreground">
            API, cloud bot, on-premise bot
          </p>
        </div>
      </Container>
    </section>
  );
}
