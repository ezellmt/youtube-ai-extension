import { IconOpenAI } from "@/components/ui/icons";

export type Prompt = {
  value: string;
  label: string;
  content: string;
};

export type Model = {
  value: string;
  label: string;
  content?: string;
  icon?: any;
};

export type Message = {
  role: string;
  content: string;
};

export type language = {
  value: string;
  label: string;
};

export type Transcript = {
  text: string;
  startTime: number;
  endTime: number;
};

export const languages: language[] = [
  { value: "en", label: "English" },
  { value: "es", label: "(Soon)" }
];

export const prompts: Prompt[] = [
  {
    value: "default",
    label: "Age Classification Prompt",
    content: `Analyze the transcript of this YouTube video for age-appropriate content. Use the following format for your response:

1. Video Summary
2. Age Classification: [All ages, 4+, 7+, 10+, 13+, 17+]
3. Classification Rationale: [Explain why the content is classified at this age level]
4. Confidence Level: [Low, Medium, High]
5. Themes: [List of themes or topics covered in the video]
6. Flagged Words: [Mention any problematic or flagged words detected in the transcript]`
  },
  {
    value: "prompt-one",
    label: "Summary Prompt",
    content: "Give me a summary of this video."
  }
];

export const models: Model[] = [
  {
    value: "default",
    label: "GPT-3.5",
    content: "gpt-3.5-turbo",
    icon: <IconOpenAI className="h-4 w-4 opacity-70" />
  },
  {
    value: "GPT-4",
    label: "GPT-4",
    content: "gpt-4-turbo",
    icon: <IconOpenAI className="h-4 w-4 opacity-70" />
  },
  {
    value: "GPT-4o",
    label: "GPT-4o",
    content: "gpt-4o",
    icon: <IconOpenAI className="h-4 w-4 opacity-70" />
  },
  {
    value: "GPT-4o-mini",
    label: "GPT-4o-mini",
    content: "gpt-4o-mini",
    icon: <IconOpenAI className="h-4 w-4 opacity-70" />
  }
];
