import { createOpenAI } from "@ai-sdk/openai";
import { APICallError, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this:'What's a hobby you've recently started?|| If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment. give me new messages not the same that i have given you in this example.";

    const result = await streamText({
      model: groq("llama3-8b-8192"),
      maxTokens: 200,
      prompt,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    if (error instanceof APICallError) {
      const { name, statusCode, responseHeaders, message } = error;
      return Response.json(
        {
          success: false,
          name,
          message,
          responseHeaders,
        },
        {
          status: statusCode,
        }
      );
    } else {
      console.error(
        "Error while generating the suggestions of messages",
        error
      );
      return Response.json(
        {
          success: false,
          message: "Something went wrong while getting suggestions",
        },
        { status: 500 }
      );
    }
  }
}
