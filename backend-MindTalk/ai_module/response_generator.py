import json
from openai import OpenAI
from ai_module.config import GROQ_API_KEY, AI_MODEL, TEMPERATURE, MAX_TOKENS, BASE_URL
from ai_module.prompts.language_prompts import PromptManager

prompt_manager = PromptManager()


def generate_response(
    user_input: str,
    conversation_history: list,
    language: str = "english",
    memory_summary: str = ""
) -> dict:
    """
    Calls Groq API (llama-3.1-8b-instant) and returns:
      { "actual_response": str, "summarize_context": str }
    Raises an exception on API failure.
    """
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set. Please add it to your .env file.")

    # Crisis detection — short-circuit before hitting the API
    if prompt_manager.detect_crisis(user_input, language):
        return prompt_manager.get_crisis_message(language)

    client = OpenAI(
        api_key=GROQ_API_KEY,
        base_url=BASE_URL,
    )

    messages = prompt_manager.build_prompt(
        user_input=user_input,
        conversation_history=conversation_history,
        language=language,
        memory_summary=memory_summary,
    )

    completion = client.chat.completions.create(
        model=AI_MODEL,
        messages=messages,
        temperature=TEMPERATURE,
        max_tokens=MAX_TOKENS,
    )

    raw = completion.choices[0].message.content.strip()

    # Strip markdown code fences if model wraps response
    if "```" in raw:
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    try:
        parsed = json.loads(raw)
        return {
            "actual_response": parsed.get("actual_response", "").strip(),
            "summarize_context": parsed.get("summarize_context", "").strip(),
        }
    except json.JSONDecodeError:
        return {
            "actual_response": raw,
            "summarize_context": "",
        }
