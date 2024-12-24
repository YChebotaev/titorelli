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
    name: "Free",
    price: "$0/mo",
    features: [
      "One group",
      "500 group members",
      "Shared bot instance",
      "Train model with group data",
    ],
  },
  {
    name: "Pro",
    price: "$12/mo",
    features: [
      "1-10 groups",
      "100-5000 group members",
      "On-premise bot instance",
      "Train model with group data",
    ],
  },
  {
    name: "Enterprise",
    price: "$360/mo",
    features: [
      "Unlimited groups",
      "Unlimited group members",
      "On-premise bot instance",
      "No training",
    ],
  },
];

export function Pricing() {
  return (
    <section id="select-plan" className="py-24 bg-muted">
      <Container>
        <h2 className="text-3xl font-bold mb-12 text-center">Select a Plan</h2>
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
                <Button className="w-full">Choose Plan</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
