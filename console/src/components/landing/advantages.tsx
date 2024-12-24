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
    title: "Ban by list of known spammers",
    description:
      "Titorelli platform uses CAS (Combot Anti-Spam) and lols.bot continuously updated dataset of known spammers",
    image: "/images/landing/advantages/adv-1.jpeg",
  },
  {
    title: "Ban by text duplicate",
    description:
      "Platform stores a list of known spam messages and bans if one of them is sent to protected group",
    image: "/images/landing/advantages/adv-2.jpeg",
  },
  {
    title: "Ban by text classification",
    description:
      "We leverage carefully crafted machine learning model that can accurately determine if message are spam or not",
    image: "/images/landing/advantages/adv-3.jpeg",
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
