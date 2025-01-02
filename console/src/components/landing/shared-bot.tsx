import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Container } from "../site/container";

export function SharedBot() {
  return (
    <section className="py-24 bg-background">
      <Container>
        <h2 className="text-3xl font-bold mb-12 text-center">
          Официальный бот
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Image
              src="/images/landing/shared-bot/cover.jpeg"
              alt="Titorelli Bot"
              width={400}
              height={400}
              className="rounded-lg"
            />
          </div>
          <div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Автоматическая фильтрация спама.
              </li>
              <li className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Пользовательский интерфейс для управления.
              </li>
              <li className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Обновления в реальном времени.
              </li>
            </ul>
            <Button size="lg">Получить бота</Button>
          </div>
        </div>
        {/* <div className="mt-12 text-center">
          <p className="mb-4">Or you can use bot docker image on-premise</p>
          <Button variant="outline">Install with Docker</Button>
        </div> */}
      </Container>
    </section>
  );
}
