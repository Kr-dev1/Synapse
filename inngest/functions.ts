import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { inngest } from "./client";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
const google = createGoogleGenerativeAI();
const openAI = createOpenAI();
const anthropic = createAnthropic();

export const executeAi = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant",
        prompt: "What is 2 + 2",
      }
    );
    const { steps: openAiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        model: openAI("gpt-5-nano"),
        system: "You are a helpful assistant",
        prompt: "What is 2 + 2",
      }
    );
    const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: anthropic("claude-sonnet-4-5"),
        system: "You are a helpful assistant",
        prompt: "What is 2 + 2",
      }
    );

    return { geminiSteps, openAiSteps, anthropicSteps };
  }
);
