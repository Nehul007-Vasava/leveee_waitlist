export type PainKey = "heat" | "loop" | "replay" | "distance" | "other";

export const PAINS: { key: PainKey; label: string }[] = [
  { key: "heat", label: "I say things in the heat of the moment I regret" },
  { key: "loop", label: "We keep having the same fight" },
  { key: "replay", label: "I overthink and replay fights for hours afterward" },
  { key: "distance", label: "We go quiet and distant instead of talking" },
  { key: "other", label: "Something else" },
];

/** One validation line per Step 1 answer, shown first on the thank-you page. */
export const VALIDATION: Record<PainKey | "general", string> = {
  heat: "You picked saying things in the heat of the moment. That isn't a character flaw. It's how people react under pressure, and the pause that helps is only a few seconds long. That's exactly what we're building for.",
  loop: "You picked the same fight, again and again. You're in good company: it's the answer we hear most. And the fact that you can see the loop means you're already halfway out of it.",
  replay: "You picked replaying fights for hours. Often that's the mind trying to finish a conversation that never really ended. We'd like to help you finish it sooner, and more kindly.",
  distance: "You picked going quiet and distant. Silence often isn't a lack of caring. It can be caring, and not knowing what's safe to say. That's the moment Leveee is meant for.",
  other: "Thank you for putting it in your own words. We read every answer, and they shape what we build first.",
  general: "Thank you for joining. Leveee is being built for the moments when things are hardest to say well. We'll be in touch as soon as your place opens.",
};

export const TOGETHER = ["Under 1 year", "1-3 years", "3-7 years", "7+ years"] as const;
export const PARTNER_OPEN = ["Yes", "Maybe", "No", "Haven't asked"] as const;

export const LOOP_QUESTIONS: { q: string; options: string[] }[] = [
  { q: "What usually starts it?", options: ["Plans, time or being late", "Chores, or who does more", "Feeling ignored or unheard", "Money", "Family or friends", "Trust or jealousy"] },
  { q: "When does it usually happen?", options: ["In the morning", "In the evening", "Late at night", "Over text, when we're apart"] },
  { q: "When it heats up, what do you usually do?", options: ["Push to resolve it now", "Go quiet or leave the room", "Get sharp or sarcastic", "Apologise quickly to end it"] },
  { q: "And what does your partner usually do?", options: ["Push to resolve it now", "Go quiet or leave the room", "Get sharp or sarcastic", "Apologise quickly to end it"] },
  { q: "How does it usually end?", options: ["Someone apologises", "We sleep on it", "Humour eases the tension", "It doesn't really end"] },
];

export function loopSnapshot(a: string[]) {
  const [start, when, you, them, end] = a;
  const P = "Push to resolve it now";
  const G = "Go quiet or leave the room";
  const A = "Apologise quickly to end it";
  let name = "Escalation";
  let body = "When one of you becomes sharp, the other tends to match it, and the conversation drifts away from the original topic.";
  if ((you === P && them === G) || (you === G && them === P)) {
    name = "Pursue and withdraw";
    body = "One of you moves towards the conflict to resolve it, while the other steps back to cool down. The more one pursues, the more the other withdraws, and both can end up feeling alone.";
  } else if (you === G && them === G) {
    name = "Mutual withdrawal";
    body = "You both go quiet to keep the peace. It feels calmer in the moment, but the issue often returns because it wasn't resolved.";
  } else if (you === A || them === A) {
    name = "Quick repair";
    body = "The argument ends quickly, but the feeling underneath may not get said, which is often why it comes back.";
  }
  const detail = `It tends to start with ${start.toLowerCase()}, often ${when.toLowerCase()}, and usually ends when: ${end.toLowerCase()}.`;
  return { name, body, detail };
}

export const FOUNDER_CALL_URL = process.env.NEXT_PUBLIC_FOUNDER_CALL_URL || "https://calendly.com/your-link";
export const HELPLINE_URL = process.env.NEXT_PUBLIC_HELPLINE_URL || "https://www.thehotline.org/";
