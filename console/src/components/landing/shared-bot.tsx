import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Container } from "./container";

export function SharedBot() {
  return (
    <section className="py-24 bg-background">
      <Container>
        <h2 className="text-3xl font-bold mb-12 text-center">
          Or just connect to official bot
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Image
              src="/placeholder.svg?height=400&width=400"
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
                Receives latest updates of the platform
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
                Supports all the features of the platform
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
                Performs back-learning of platform to enhance quality of whole
                service
              </li>
            </ul>
            <Button size="lg">Get Started</Button>
          </div>
        </div>
        <div className="mt-12 text-center">
          <p className="mb-4">Or you can use bot docker image on-premise</p>
          <Button variant="outline">Install with Docker</Button>
        </div>
      </Container>
    </section>
  );
}
