import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "./container";

const plans = [
  {
    name: "Бесплатный тариф",
    price: "$0/mo",
    features: [
      "Подходит для начинающих пользователей.",
      "Доступ к базовым функциям управления ботами.",
      "Возможность попробовать платформу перед покупкой.",
    ],
  },
  {
    name: "Тариф Pro",
    price: "$12/mo",
    features: [
      "Расширенные возможности настройки ботов.",
      "Дополнительные функции управления.",
      "Подробные отчёты о работе ботов.",
    ],
  },
  {
    name: "Корпоративный тариф Enterprise",
    price: "$360/mo",
    features: [
      "Максимальная гибкость и контроль.",
      "Индивидуальные параметры работы ботов.",
      "Эксклюзивные функции для крупных компаний.",
    ],
  },
];

export function Pricing() {
  return (
    <section id="select-plan" className="py-24 bg-muted">
      <Container>
        <h2 className="text-3xl font-bold mb-12 text-center">
          Варианты подписки
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription className="text-2xl font-bold">
                  {plan.price}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
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
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Выбрать план</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
