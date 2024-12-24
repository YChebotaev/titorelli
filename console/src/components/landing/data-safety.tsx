import { Container } from "./container";

export function DataSafety() {
  return (
    <section className="py-24 bg-background">
      <Container>
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Your data is safe with us</h2>
          <p className="text-xl text-muted-foreground">
            Titorelli platform doesnt store any message content
          </p>
        </div>
      </Container>
    </section>
  );
}