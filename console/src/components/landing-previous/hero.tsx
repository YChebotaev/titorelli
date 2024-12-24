import { TitorelliLogo } from './layout'

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="text-center">
        <TitorelliLogo className="w-32 h-32 mx-auto mb-8" />
        <h1 className="text-4xl font-bold mb-4">Welcome to Titorelli</h1>
        <p className="text-xl text-muted-foreground">
          Manage classification models for Telegram bots
        </p>
      </div>
    </section>
  );
}
