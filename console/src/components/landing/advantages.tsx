import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Container } from "./container";

const advantages = [
  {
    title: "Удобство и простота использования.",
    description:
      "Наша платформа позволяет легко управлять вашими ботами, настраивать их работу и получать отчёты о результатах. Вы сможете сосредоточиться на развитии своего бизнеса, а мы возьмём на себя заботу о ваших ботах.",
    // image: "/images/landing/advantages/adv-1.jpeg",
    image: "/images/landing/advantages/yandexart-fbvm6ina8s37dh7tg98j.jpeg",
  },
  {
    title: "Надёжная защита от спама.",
    description:
      "Наши алгоритмы автоматически распознают и блокируют спам-сообщения, что позволяет вам сохранить репутацию и доверие своих подписчиков.",
    // image: "/images/landing/advantages/adv-2.jpeg",
    image: "/images/landing/advantages/yandexart-fbvagphelp85jhk26uh6.jpeg",
  },
  {
    title: "Безопасность данных.",
    description:
      "Мы гарантируем сохранность ваших данных и не передаём их третьим лицам. Ваша информация остаётся конфиденциальной.",
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
