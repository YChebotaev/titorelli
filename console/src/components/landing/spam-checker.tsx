"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "./container";

export function SpamChecker() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | {
    label: string;
    confidence: number;
    reason: string;
  }>(null);

  const checkSpam = () => {
    // This is a mock function. In a real application, you would call an API here.
    const mockResult = {
      label: Math.random() > 0.5 ? "spam" : "ham",
      confidence: Math.random(),
      reason: ["cas", "duplicate", "classifier"][Math.floor(Math.random() * 3)],
    };
    setResult(mockResult);
  };

  return (
    <section className="py-24 bg-muted">
      <Container className="max-w-2xl">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Try our spam detection
        </h2>
        <Textarea
          placeholder="Paste a spam example here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="mb-4"
          rows={5}
        />
        <Button onClick={checkSpam} className="w-full mb-4">
          Check for Spam
        </Button>
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <p>Label: {result.label}</p>
                <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
                <p>Reason: {result.reason}</p>
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </Container>
    </section>
  );
}
