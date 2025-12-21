import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { inngest } from "./client";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGroq } from "@ai-sdk/groq";
const google = createGoogleGenerativeAI();
const openAI = createOpenAI();
const anthropic = createAnthropic();
const groq = createGroq();

export const executeAi = inngest.createFunction(
  {
    id: "execute-ai",
    retries: 2,
    onFailure: async ({ event, error }) => {
      console.error("Job failed permanently:", error);
    },
  },
  { event: "execute/ai" },
  async ({ event, step }) => {
    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash-lite"),
        system: "You are a helpful assistant",
        prompt: "What is 2 + 2",
      }
    );
    const { steps: openAiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        model: openAI("gpt-4o-mini"),
        system: "You are a helpful assistant",
        prompt: "What is 2 + 2",
      }
    );
    const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: anthropic("claude-haiku-4-5"),
        system: "You are a helpful assistant",
        prompt: "What is 2 + 2",
      }
    );
    const { steps: ollamaSteps } = await step.ai.wrap(
      "ollama-generate-text",
      generateText,
      {
        model: groq("llama-3.1-8b-instant"),
        system: "You are a helpful assistant",
        prompt: "What is 2 + 2",
      }
    );
    const { steps: kimiSteps } = await step.ai.wrap(
      "kimi-generate-text",
      generateText,
      {
        model: groq("moonshotai/kimi-k2-instruct"),
        system: "You are a helpful assistant",
        prompt: "What is 2 + 2",
      }
    );

    return { geminiSteps, openAiSteps, anthropicSteps, ollamaSteps, kimiSteps };
  }
);
