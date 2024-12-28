import { Container } from "./container";

export function DataSafety() {
  return (
    <section className="py-24 bg-background">
      <Container>
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Your Data, Our Priority</h2>
          <p className="text-xl text-muted-foreground">
            We prioritize your security, employing state-of-the-art encryption
            and strict protocols to ensure your data remains confidential and
            protected at all times.
          </p>
        </div>
      </Container>
    </section>
  );
}
