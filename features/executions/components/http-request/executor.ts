import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};
import Handlebars from "handlebars";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);

  return safeString;
});

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request node requires an endpoint");
  }
  if (!data.variableName) {
    throw new NonRetriableError("Variable name not configured");
  }
  if (!data.method) {
    throw new NonRetriableError("method is not configured");
  }

  const result = await step.run("http-request", async () => {
    const method = data.method;
    const endpoint = Handlebars.compile(data.endpoint)(context);
    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      const resolved = Handlebars.compile(data.body || {})(context);
      const parsed = JSON.parse(resolved);
      options.body = parsed;
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const responsePayload = {
      status: response.status,
      statusText: response.statusText,
      data: responseData,
    };

    return {
      ...context,
      [data.variableName]: responsePayload,
    };
  });

  return result;
};
