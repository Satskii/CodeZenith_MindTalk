import json
import re
from openai import OpenAI
from ai_module.config import GROQ_API_KEY, AI_MODEL, TEMPERATURE, MAX_TOKENS, BASE_URL
from ai_module.prompts.language_prompts import PromptManagerV2

prompt_manager = PromptManagerV2()


def extract_response_and_summary(raw_text: str) -> tuple:
    """
    Extract actual_response and summarize_context from raw text.
    Handles both JSON and mixed formats where the model might include field names.
    """
    # Try JSON parsing first
    try:
        parsed = json.loads(raw_text)
        actual = parsed.get("actual_response", "").strip()
        summary = parsed.get("summarize_context", "").strip()
        if actual:
            return actual, summary
    except json.JSONDecodeError:
        pass
    
    # Handle mixed format: "text actual_response: "..." summarize_context: "...""
    # Extract actual_response field
    actual_match = re.search(r'actual_response\s*:\s*["\']?([^"\']*?)["\']?\s*(?:summarize_context|$)', raw_text, re.IGNORECASE | re.DOTALL)
    actual_response = actual_match.group(1).strip() if actual_match else ""
    
    # Extract summarize_context field  
    summary_match = re.search(r'summarize_context\s*:\s*["\']?(.+?)(?:["\']?\s*$)', raw_text, re.IGNORECASE | re.DOTALL)
    summary = summary_match.group(1).strip() if summary_match else ""
    
    # If we found field names, return extracted values
    if actual_response or summary:
        return actual_response, summary
    
    # If no field names found, use the entire raw text as response
    return raw_text.strip(), ""


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
    if prompt_manager.detect_crisis(user_input):
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
        parts = raw.split("```")
        raw = parts[1] if len(parts) > 1 else raw
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    actual, summary = extract_response_and_summary(raw)
    
    return {"actual_response": actual, "summarize_context": summary}
