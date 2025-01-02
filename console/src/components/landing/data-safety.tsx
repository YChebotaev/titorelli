import { Container } from "../site/container";

export function DataSafety() {
  return (
    <section className="py-24 bg-background">
      <Container>
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Безопасность ваших данных</h2>
          <p className="text-xl text-muted-foreground">
            Titorelli гарантирует надежную защиту вашей информации.
          </p>
        </div>
      </Container>
    </section>
  );
}
