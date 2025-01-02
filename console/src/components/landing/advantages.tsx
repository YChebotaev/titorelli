import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Container } from "../site/container";

const advantages = [
  {
    title: "Удобное управление.",
    description: "Интуитивно понятный интерфейс для всех пользователей.",
    // image: "/images/landing/advantages/adv-1.jpeg",
    image: "/images/landing/advantages/yandexart-fbvm6ina8s37dh7tg98j.jpeg",
  },
  {
    title: "Эффективная защита.",
    description: "Мощные алгоритмы для надежной защиты от спама.",
    // image: "/images/landing/advantages/adv-2.jpeg",
    image: "/images/landing/advantages/yandexart-fbvagphelp85jhk26uh6.jpeg",
  },
  {
    title: "Гибкий выбор.",
    description: "Разнообразные тарифные планы для любых нужд.",
    // image: "/images/landing/advantages/adv-3.jpeg",
    image: "/images/landing/advantages/yandexart-fbvit7vj0ubaqva8lgms.jpeg",
  },
];

export function Advantages() {
  return (
    <section className="py-24 bg-muted">
      <Container>
        <div className="grid gap-8 md:grid-cols-3">
          {advantages.map((advantage, index) => (
            <Card key={index}>
              <CardHeader className="p-0 pb-6 h-[400px]">
                <Image
                  src={advantage.image}
                  alt={advantage.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="mb-2">{advantage.title}</CardTitle>
                <CardDescription>{advantage.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
