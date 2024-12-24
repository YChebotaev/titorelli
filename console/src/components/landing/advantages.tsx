import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Container } from './container'

const advantages = [
  {
    title: "Ban by list of known spammers",
    description:
      "Titorelli platform uses CAS (Combot Anti-Spam) and lols.bot continuously updated dataset of known spammers",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Ban by text duplicate",
    description:
      "Platform stores a list of known spam messages and bans if one of them is sent to protected group",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Ban by text classification",
    description:
      "We leverage carefully crafted machine learning model that can accurately determine if message are spam or not",
    image: "/placeholder.svg?height=200&width=300",
  },
];

export function Advantages() {
  return (
    <section className="py-24 bg-muted">
      <Container>
        <div className="grid gap-8 md:grid-cols-3">
          {advantages.map((advantage, index) => (
            <Card key={index}>
              <CardHeader>
                <Image
                  src={advantage.image}
                  alt={advantage.title}
                  width={300}
                  height={200}
                  className="rounded-t-lg"
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
