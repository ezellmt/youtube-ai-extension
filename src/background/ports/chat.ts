import { createLlm } from "@/utils/llm";
import type { ChatCompletionMessageParam } from "openai/resources";
import type { PlasmoMessaging } from "../../../node_modules/@plasmohq/messaging/dist/index";

// Updated system message for classification task
const SYSTEM = `
You are an AI assistant tasked with analyzing a YouTube video's transcript to classify its content for age-appropriateness. Use the following format:

1. Video Summary
2. Age Classification: [All ages, 4+, 7+, 10+, 13+, 17+]
3. Classification Rationale: [Explain why the content is classified at this age level, with specific references to flagged words or themes]
4. Confidence Level: [Low, Medium, High]
5. Themes: [List of key themes in the video]
6. Flagged Words: [List any flagged or problematic words with frequencies]
`;

async function createChatCompletion(
  model: string,
  messages: ChatCompletionMessageParam[],
  context: any
) {
  const llm = createLlm(context.openAIKey);
  console.log("Creating Chat Completion");

  const parsed = context.transcript.events
    .filter((x: { segs: any }) => x.segs)
    .map((x: { segs: any[] }) => x.segs.map((y: { utf8: any }) => y.utf8).join(" "))
    .join(" ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ");

  const SYSTEM_WITH_CONTEXT = SYSTEM.replace("{title}", context.metadata.title).replace(
    "{transcript}",
    parsed
  );
  messages.unshift({ role: "system", content: SYSTEM_WITH_CONTEXT });

  console.log("Messages sent to OpenAI");
  console.log(messages);

  return llm.beta.chat.completions.stream({
    messages: messages,
    model: model || "gpt-4o-mini",
    stream: true
  });
}

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  let cumulativeDelta = "";

  const model = req.body.model;
  const messages = req.body.messages;
  const context = req.body.context;

  console.log("Model");
  console.log(model);
  console.log("Messages");
  console.log(messages);
  console.log("Context");
  console.log(context);

  try {
    const completion = await createChatCompletion(model, messages, context);

    completion.on("content", (delta, snapshot) => {
      cumulativeDelta += delta;
      res.send({ message: cumulativeDelta, error: null, isEnd: false });
    });

    completion.on("end", () => {
      res.send({ message: "END", error: null, isEnd: true });
    });
  } catch (error) {
    res.send({ error: "something went wrong" });
  }
};

export default handler;
