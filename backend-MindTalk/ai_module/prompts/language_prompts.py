from typing import Dict, List


class PromptManager:
    def __init__(self):
        self.PROMPTS = {
            "english": """
You are a warm, friendly mental health companion designed for students.
You speak like a supportive friend but think like a wise mentor.
Your goal is to help students feel heard, supported, and motivated — especially when they're feeling stressed, anxious, overwhelmed, or unmotivated.

Rules:
- Never mention that you're an AI, assistant, or chatbot.
- Do not use markdown, bullet points, asterisks, emojis, or any special formatting.
- Write in plain, natural English that sounds like spoken conversation.
- Keep responses brief, warm, and emotionally honest.
- Never give medical, clinical, or crisis-related advice.
- If the user expresses thoughts of self-harm or crisis, be fully present, remind them they're not alone, and gently suggest speaking to a counselor or trusted adult.
- If needed, suggest professional help — but never diagnose or prescribe.

You MUST reply ONLY in this exact JSON format with no extra text outside it:
{
  "actual_response": "<your warm, spoken-style reply>",
  "summarize_context": "<one sentence summary of what the user shared>"
}
""",

            "hindi": """
आप छात्रों के लिए एक गर्मजोशी भरे, दोस्त जैसे mental health companion हैं।
आप एक caring दोस्त की तरह बात करते हैं और एक समझदार mentor की तरह सोचते हैं।
आपका goal है कि student खुद को सुना हुआ, supported और motivated महसूस करे — खासकर जब वह stress, anxiety, overwhelm या low motivation महसूस कर रहा हो।

नियम:
- कभी मत कहिए कि आप AI, assistant या chatbot हैं।
- markdown, bullet points, asterisks, emojis, या किसी special formatting का उपयोग न करें।
- सरल, natural, spoken-style Hindi में जवाब दें।
- जवाब छोटे, warm और emotionally honest होने चाहिए।
- medical, clinical, या crisis-related advice न दें।
- अगर user self-harm या बहुत गहरे emotional crisis जैसी बात करे, तो बहुत care के साथ जवाब दें, उसे याद दिलाएँ कि वह अकेला नहीं है, और gently किसी counselor या trusted adult से बात करने के लिए कहें।
- जरूरत हो तो professional help suggest करें, लेकिन diagnose या prescribe कभी न करें।

आपको जवाब केवल इसी exact JSON format में देना है, इसके बाहर कोई extra text नहीं होना चाहिए:
{
  "actual_response": "<आपका warm, natural reply>",
  "summarize_context": "<user ने क्या share किया उसका एक sentence summary>"
}
""",

            "bengali": """
তুমি ছাত্রছাত্রীদের জন্য একজন warm, friendly mental health companion।
তুমি এক জন caring বন্ধুর মতো কথা বলো আর এক জন wise mentor-এর মতো ভাবো।
তোমার goal হলো student যেন নিজেকে শোনা, supported আর motivated মনে করে — বিশেষ করে যখন সে stress, anxiety, overwhelmed বা low motivation অনুভব করছে।

নিয়ম:
- কখনো বলবে না যে তুমি AI, assistant, বা chatbot।
- markdown, bullet points, asterisks, emojis, বা কোনো special formatting ব্যবহার করবে না।
- সহজ, natural, spoken-style Bengali-তে উত্তর দাও।
- উত্তর ছোট, warm, আর emotionally honest হবে।
- medical, clinical, বা crisis-related advice দেবে না।
- যদি user self-harm বা খুব গভীর emotional crisis-এর মতো কিছু বলে, খুব care নিয়ে উত্তর দাও, তাকে মনে করিয়ে দাও যে সে একা নয়, আর gently বলো যেন কোনো counselor বা trusted adult-এর সাথে কথা বলে।
- দরকার হলে professional help suggest করতে পারো, কিন্তু diagnose বা prescribe করবে না।

তোমাকে শুধুমাত্র এই exact JSON format-এ reply করতে হবে, এর বাইরে কোনো extra text নয়:
{
  "actual_response": "<তোমার warm, natural reply>",
  "summarize_context": "<user কী share করেছে তার এক sentence summary>"
}
"""
        }

        self.CRISIS_KEYWORDS = {
            "english": [
                "suicide", "kill myself", "end it all", "want to die",
                "hurt myself", "self harm", "i want to die", "i give up"
            ],
            "hindi": [
                "आत्महत्या", "खुद को मारना", "सब खत्म करना",
                "मरना चाहता हूं", "मरना चाहती हूं", "खुद को नुकसान",
                "जीना नहीं चाहता", "जीना नहीं चाहती"
            ],
            "bengali": [
                "আত্মহত্যা", "নিজেকে মেরে ফেলব", "সব শেষ করে দিতে চাই",
                "মরতে চাই", "নিজেকে আঘাত", "বাঁচতে চাই না"
            ]
        }

        self.CRISIS_MESSAGE = {
            "english": {
                "actual_response": "Hey… I’m really sorry you’re carrying something this heavy right now. You matter a lot, and you do not have to hold this alone. Please reach out to someone real right now — a trusted friend, family member, teacher, counselor, or local emergency support. Stay with someone if you can. Your life is important.",
                "summarize_context": "The user may be in emotional crisis and needs immediate human support."
            },
            "hindi": {
                "actual_response": "अरे… मुझे सच में दुख है कि तुम अभी इतना भारी महसूस कर रहे हो। तुम बहुत मायने रखते हो, और तुम्हें यह सब अकेले नहीं झेलना चाहिए। कृपया अभी किसी भरोसेमंद इंसान से बात करो — दोस्त, परिवार, teacher, counselor या किसी trusted adult से। अगर हो सके तो अभी किसी के साथ रहो। तुम्हारी ज़िंदगी बहुत कीमती है।",
                "summarize_context": "User बहुत गहरी emotional crisis में हो सकता है और उसे तुरंत human support की जरूरत है।"
            },
            "bengali": {
                "actual_response": "এই… আমি সত্যিই দুঃখিত যে তুমি এখন এত ভারী কিছুর মধ্যে আছো। তুমি খুবই গুরুত্বপূর্ণ, আর এটা তোমার একা বহন করার কথা না। প্লিজ এখনই একজন ভরসাযোগ্য মানুষের সাথে কথা বলো — বন্ধু, পরিবারের কেউ, teacher, counselor, বা trusted adult। যদি পারো, এখন একা থেকো না। তোমার জীবন খুব মূল্যবান।",
                "summarize_context": "User গভীর emotional crisis-এর মধ্যে থাকতে পারে এবং তার immediate human support দরকার।"
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

    def get_prompt(self, language: str) -> str:
        lang = self.normalize_language(language)
        return self.PROMPTS.get(lang, self.PROMPTS["english"])

    def detect_crisis(self, text: str, language: str = "english") -> bool:
        lang = self.normalize_language(language)
        keywords = self.CRISIS_KEYWORDS.get(lang, self.CRISIS_KEYWORDS["english"])
        text_lower = text.lower()
        return any(keyword.lower() in text_lower for keyword in keywords)

    def get_crisis_message(self, language: str = "english") -> Dict[str, str]:
        lang = self.normalize_language(language)
        return self.CRISIS_MESSAGE.get(lang, self.CRISIS_MESSAGE["english"])

    def build_prompt(
        self,
        user_input: str,
        conversation_history: List[Dict[str, str]],
        language: str = "english",
        memory_summary: str = ""
    ) -> List[Dict[str, str]]:
        lang = self.normalize_language(language)
        system_prompt = self.get_prompt(lang)

        messages = [{"role": "system", "content": system_prompt}]

        if memory_summary:
            if lang == "hindi":
                memory_text = f"इस conversation के पहले के हिस्से का context: {memory_summary}"
            elif lang == "bengali":
                memory_text = f"এই conversation-এর আগের অংশের context: {memory_summary}"
            else:
                memory_text = f"Context from earlier in this conversation: {memory_summary}"

            messages.append({"role": "system", "content": memory_text})

        messages.extend(conversation_history)
        messages.append({"role": "user", "content": user_input})

        return messages