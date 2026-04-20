from typing import Dict, List


class PromptManagerV2:
    def __init__(self):

        self.MASTER_PROMPT = """
You are a mental health companion for students in India (high school, undergraduate, postgraduate).

You speak like a close, trusted friend who genuinely listens and cares.
You think like a calm, emotionally intelligent mentor.

Your goal is NOT to solve everything.
Your goal is to make the user feel:
- heard
- understood
- slightly lighter
- supported enough to take the next small step

Behavior Rules:
- Always acknowledge emotions before giving suggestions
- Never sound clinical, robotic, or scripted
- Never give diagnoses, medical advice, or labels
- Never invalidate feelings
- Never overwhelm the user with too many suggestions
- Prefer small, practical, relatable steps

Conversation Style:
- Sound like a real student-friendly Indian conversational tone
- Use simple, natural spoken language
- Allow mild code-mixing if user does it
- Keep responses concise (3–6 lines max)

Guidance Strategy:
1. Validate emotion
2. Normalize experience
3. Offer 1 small suggestion OR reflective question
4. End with gentle support

Avoid repetition of phrases like:
- you are not alone
- I understand
- it is okay

Output strictly in JSON:
{
  "actual_response": "...",
  "summarize_context": "..."
}
"""

        self.PROMPTS_V2 = {
            "english": """
Write in natural Indian conversational English.
Tone should feel like a supportive friend or senior.
Avoid overly formal or western therapy-like language.
Keep it simple, real, and emotionally honest.
""",

            "hindi": """
सरल, बोलचाल वाली हिंदी में जवाब दें।
Tone दोस्त जैसा और समझने वाला होना चाहिए।
बहुत ज़्यादा शुद्ध या किताबी हिंदी से बचें।
जरूरत हो तो हल्का Hinglish इस्तेमाल कर सकते हैं।
""",

            "bengali": """
সহজ, কথ্য Bengali ব্যবহার করো।
Tone বন্ধুর মতো হওয়া উচিত।
খুব formal ভাষা ব্যবহার করবে না।
প্রয়োজনে Bengali + English mix করতে পারো।
"""
        }

        self.CRISIS_KEYWORDS = [
            "suicide", "kill myself", "end it all", "want to die",
            "self harm", "hurt myself"
        ]

        self.CRISIS_PHRASES = [
            "nothing matters",
            "i feel empty",
            "no reason to live",
            "can't go on",
            "i give up",
            "i am tired of everything"
        ]

        self.CRISIS_RESPONSE = {
            "english": {
                "actual_response": "Hey… I’m really sorry you’re going through something this heavy right now. It might not feel like it, but you don’t have to handle this alone. You matter more than what this moment is making you feel. If you can, please reach out to someone you trust — a close friend, parent, teacher, or counselor. You can also call Kiran Mental Health Helpline: 1800-599-0019 or AASRA: +91-22-27546669. Even talking to one real person can help a little. I’m here with you, we can take this slowly.",
                "summarize_context": "User may be in emotional crisis and needs immediate human support"
            },
            "hindi": {
                "actual_response": "अभी जो तुम महसूस कर रहे हो वो सच में बहुत भारी लग रहा है… और मुझे खुशी है कि तुमने ये शेयर किया। तुम्हें ये सब अकेले नहीं झेलना है। तुम बहुत मायने रखते हो, भले अभी ऐसा महसूस ना हो। अगर हो सके तो किसी भरोसेमंद इंसान से बात करो — दोस्त, परिवार, teacher या counselor। तुम Kiran Mental Health Helpline: 1800-599-0019 या AASRA: +91-22-27546669 पर भी कॉल कर सकते हो। मैं यहीं हूँ, हम धीरे-धीरे बात कर सकते हैं।",
                "summarize_context": "User emotional crisis में हो सकता है और उसे तुरंत support की जरूरत है"
            },
            "bengali": {
                "actual_response": "তুমি এখন যেটা অনুভব করছো সেটা সত্যিই খুব ভারী… আর এটা শেয়ার করার জন্য ধন্যবাদ। এটা তোমার একা বহন করার কথা না। তুমি খুব গুরুত্বপূর্ণ, যদিও এখন সেটা মনে নাও হতে পারে। যদি পারো, একজন ভরসাযোগ্য মানুষের সাথে কথা বলো — বন্ধু, পরিবারের কেউ, teacher বা counselor। তুমি Kiran Mental Health Helpline: 1800-599-0019 বা AASRA: +91-22-27546669-এও কল করতে পারো। আমি আছি তোমার সাথে, ধীরে ধীরে কথা বলি।",
                "summarize_context": "User গভীর emotional distress-এ থাকতে পারে এবং human support দরকার"
            }
        }

        self.LANGUAGE_MAP = {
            "en": "english",
            "hi": "hindi",
            "bn": "bengali",
            "english": "english",
            "hindi": "hindi",
            "bengali": "bengali"
        }

    def normalize_language(self, language: str) -> str:
        return self.LANGUAGE_MAP.get(language.lower(), "english")

    def detect_crisis(self, text: str) -> bool:
        text = text.lower()

        keyword_hit = any(k in text for k in self.CRISIS_KEYWORDS)
        phrase_hit = any(p in text for p in self.CRISIS_PHRASES)

        soft_signals = [
            "i feel like a burden",
            "no one cares",
            "i am alone",
            "i can't handle this",
            "everything is pointless",
            "i am done",
            "too much pressure",
            "i failed everyone"
        ]

        soft_hit = any(s in text for s in soft_signals)

        return keyword_hit or phrase_hit or soft_hit

    def get_crisis_message(self, language: str = "english"):
        lang = self.normalize_language(language)
        return self.CRISIS_RESPONSE.get(lang, self.CRISIS_RESPONSE["english"])

    def get_prompt(self, language: str) -> str:
        lang = self.normalize_language(language)
        return self.MASTER_PROMPT + "\n" + self.PROMPTS_V2.get(lang, self.PROMPTS_V2["english"])

    def build_prompt(
        self,
        user_input: str,
        conversation_history: List[Dict[str, str]],
        language: str = "english",
        memory_summary: str = ""
    ) -> List[Dict[str, str]]:

        system_prompt = self.get_prompt(language)

        messages = [{"role": "system", "content": system_prompt}]

        if memory_summary:
            messages.append({
                "role": "system",
                "content": f"Conversation context: {memory_summary}"
            })

        messages.extend(conversation_history)
        messages.append({"role": "user", "content": user_input})

        return messages