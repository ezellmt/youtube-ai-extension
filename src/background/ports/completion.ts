import { createLlm } from "@/utils/llm";
import type { PlasmoMessaging } from "../../../node_modules/@plasmohq/messaging/dist/index";

async function createCompletion(model: string, prompt: string, context: Record<string, any>) {
  const llm = createLlm(context.openAIKey);

  console.log("Creating Completion");

  const parsed = context.transcript.events
    .filter((x: { segs: any }) => x.segs)
    .map((x: { segs: any[] }) => x.segs.map((y: { utf8: any }) => y.utf8).join(" "))
    .join(" ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ");

  const USER = `${prompt}\n\nVideo Title: ${context.metadata.title}\nVideo Transcript: ${parsed}\n\nAnalyze this transcript for age-appropriate content. Provide a summary, age classification, rationale, confidence level, themes, and flagged words.`;

  console.log("User Prompt");
  console.log(USER);

  return llm.beta.chat.completions.stream({
    messages: [{ role: "user", content: USER }],
    model: model || "gpt-4o-mini",
    stream: true
  });
}

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  let cumulativeDelta = "";

  const prompt = req.body.prompt;
  const model = req.body.model;
  const context = req.body.context;

  console.log("Prompt");
  console.log(prompt);
  console.log("Model");
  console.log(model);
  console.log("Context");
  console.log(context);

  try {
    const completion = await createCompletion(model, prompt, context);

    completion.on("content", (delta, snapshot) => {
      cumulativeDelta += delta;
      res.send({ message: cumulativeDelta, error: "", isEnd: false });
    });

    completion.on("end", () => {
      res.send({ message: "END", error: "", isEnd: true });
    });
  } catch (error) {
    res.send({ error: "something went wrong" });
  }
};

export default handler;
