import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(override=True)

def init_llm():
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        genai.configure(api_key=api_key)
    else:
        print("WARNING: GEMINI_API_KEY not found in environment")

def chat_with_llm(message: str, language: str = "Hinglish"):
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        system_prompt = f"You are a helpful, friendly financial assistant for Indian rural users. Always respond in simple {language} with concrete examples. When explaining financial terms (like interest rate, p.a., tenure, maturity), do not use technical jargon. Provide a short, direct answer to the user's query:\nUser query: "
        
        response = model.generate_content(system_prompt + message)
        return response.text
    except Exception as e:
        print(f"Error calling LLM: {e}")
        # Smart Fallback Logic if API fails with multi-language static strings
        msg = message.lower()
        lang = language.lower()
        
        # Determine intent
        intent = "default"
        if "interest" in msg or "rate" in msg or "kitna percent" in msg or "dar" in msg or "waddi" in msg:
            intent = "interest"
        elif "risk" in msg or "safe" in msg or "surakshit" in msg or "paisa" in msg or "doob" in msg:
            intent = "safety"
        elif "tax" in msg or "tds" in msg:
            intent = "tax"
        elif "duration" in msg or "time" in msg or "tenure" in msg or "kitne din" in msg:
            intent = "duration"
        elif "break" in msg or "withdraw" in msg or "premature" in msg or "nikal" in msg:
            intent = "break"

        # Pre-translated fallbacks
        fallbacks = {
            "english": {
                "interest": "Right now, typical FD interest rates are between 6% to 7.5% per year, depending on the bank and duration. Senior citizens usually get an extra 0.5%!",
                "safety": "Fixed Deposits are considered one of the safest investments! Up to ₹5 Lakhs is insured by DICGC (RBI), so your money is extremely secure.",
                "tax": "If your interest from FD exceeds ₹40,000 in a year (₹50,000 for senior citizens), the bank may deduct a 10% TDS. You can submit Form 15G or 15H to avoid this if your total income isn't taxable.",
                "duration": "You can book an FD for a duration as short as 7 days, up to 10 years! Usually, 1 to 5 years gives the best interest rates.",
                "break": "Yes, you can break an FD before maturity if you need money urgently! However, banks usually charge a 0.5% to 1% penalty on the interest rate for premature withdrawal.",
                "default": "A Fixed Deposit (FD) is a safe way to grow your savings by locking a lump sum amount for a fixed time at a guaranteed interest rate. What else would you like to know?"
            },
            "hindi": {
                "interest": "वर्तमान में, बैंक और अवधि के आधार पर FD की ब्याज दरें 6% से 7.5% प्रति वर्ष के बीच हैं। वरिष्ठ नागरिकों को आमतौर पर अतिरिक्त 0.5% मिलता है!",
                "safety": "फिक्स्ड डिपॉजिट को सबसे सुरक्षित निवेशों में से एक माना जाता है! ₹5 लाख तक का बीमा DICGC (RBI) द्वारा किया जाता है, इसलिए आपका पैसा पूरी तरह से सुरक्षित है।",
                "tax": "यदि FD से आपका ब्याज एक वर्ष में ₹40,000 (वरिष्ठ नागरिकों के लिए ₹50,000) से अधिक है, तो बैंक 10% TDS काट सकता है। यदि आपकी कुल आय कर योग्य नहीं है तो आप इससे बचने के लिए फॉर्म 15G या 15H जमा कर सकते हैं।",
                "duration": "आप 7 दिन से लेकर 10 साल तक की अवधि के लिए FD बुक कर सकते हैं! आमतौर पर, 1 से 5 साल की अवधि पर सबसे अच्छी ब्याज दरें मिलती हैं।",
                "break": "हां! यदि आपको पैसे की तत्काल आवश्यकता है तो आप परिपक्वता से पहले FD तोड़ सकते हैं। हालांकि, बैंक आमतौर पर समय से पहले निकासी के लिए 0.5% से 1% जुर्माना लेते हैं।",
                "default": "फिक्स्ड डिपॉजिट (FD) एक निश्चित समय के लिए गारंटीकृत ब्याज दर पर एकमुश्त राशि जमा करके अपनी बचत बढ़ाने का एक सुरक्षित तरीका है। आप और क्या जानना चाहेंगे?"
            },
            "hinglish": {
                "interest": "Abhi ke time me, bank aur duration ke hisaab se FD interest rates 6% se 7.5% per year ke aaspas hain. Senior citizens ko usually 0.5% extra milta hai!",
                "safety": "Fixed Deposits ko sabse safe investments maana jata hai! DICGC (RBI) ke through ₹5 Lakh tak ka insurance hota hai, toh aapka paisa bilkul safe hai.",
                "tax": "Agar ek saal mein FD interest ₹40,000 se zyada ho (senior citizens ke liye ₹50,000), toh bank 10% TDS kaat sakta hai. Agar aapki total income taxable nahi hai, toh aap Form 15G ya 15H submit karke isse bacha sakte hain.",
                "duration": "Aap 7 din se lekar 10 saal tak ke liye FD book kar sakte hain! Jaadatar 1 se 5 saal ke duration par sabse achha interest milta hai.",
                "break": "Haan! Aapko urgency ho toh aam taur par mature hone se pehle aap FD tod sakte hain. Lekin bank is par 0.5% se 1% tak ki penalty lagaate hain.",
                "default": "Fixed Deposit (FD) aapki savings ko ek guaranteed interest rate par ek fixed time ke liye secure karne ka sabse behtareen tareeka hai. Aur kuch jaanna chahte hain aap?"
            },
            "marathi": {
                "interest": "सध्या, बँक आणि कालावधीनुसार FD चे व्याजदर साधारणतः 6% ते 7.5% प्रति वर्ष आहेत. ज्येष्ठ नागरिकांना सामान्यतः 0.5% अतिरिक्त व्याज मिळते!",
                "safety": "फिक्स्ड डिपॉझिट (FD) हा सर्वात सुरक्षित गुंतवणुकीचा पर्याय मानला जातो! ₹5 लाखांपर्यंतची रक्कम DICGC (RBI) द्वारे विम्याच्या संरक्षणात असते.",
                "tax": "जर तुमचे FD मधील व्याज वर्षाला ₹40,000 पेक्षा जास्त असेल (ज्येष्ठ नागरिकांसाठी ₹50,000), तर बँक 10% TDS कापू शकते. तुम्हाला लागू नसेल तर तुम्ही फॉर्म 15G किंवा 15H भरू शकता.",
                "duration": "तुम्ही कमीत कमी 7 दिवस आणि जास्तीत जास्त 10 वर्षांसाठी FD बुक करू शकता. सामान्यत: 1 ते 5 वर्षे कालावधीसाठी सर्वोत्तम व्याजदर मिळतो.",
                "break": "होय! तुम्हाला पैशांची तातडीची गरज असल्यास तुम्ही मुदतीपूर्वी FD मोडू शकता. तथापि, बँका यावर साधारणपणे 0.5% ते 1% दंड आकारतात.",
                "default": "फिक्स्ड डिपॉझिट (FD) हा ठराविक वेळेसाठी हमी व्याज दराने पैसे गुंतवून तुमची बचत वाढवण्याचा एक सुरक्षित मार्ग आहे. तुम्हाला आणखी काय जाणून घ्यायला आवडेल?"
            },
            "tamil": {
                "interest": "தற்போது, வங்கி மற்றும் காலத்தைப் பொறுத்து, FD வட்டி விகிதங்கள் ஆண்டுக்கு 6% முதல் 7.5% வரை உள்ளன. மூத்த குடிமக்களுக்கு வழக்கமாக 0.5% கூடுதல் வட்டி கிடைக்கும்!",
                "safety": "Fixed Deposit (FD) மிகவும் பாதுகாப்பான முதலீடுகளில் ஒன்றாக கருதப்படுகிறது! ₹5 லட்சம் வரை DICGC (RBI) மூலம் காப்பீடு செய்யப்படுகிறது.",
                "tax": "ஓரண்டில் உங்களின் FD வட்டி ₹40,000 ஐ தாண்டினால் (மூத்த குடிமக்களுக்கு ₹50,000), வங்கி 10% TDS பிடிக்கும். உங்கள் வருமானம் வரிக்குட்பட்டதாக இல்லாவிட்டால் 15G அல்லது 15H படிவத்தை சமர்ப்பிக்கலாம்.",
                "duration": "நீங்கள் 7 நாட்கள் முதல் 10 ஆண்டுகள் வரை ஒரு FD ஐ முன்பதிவு செய்யலாம்! பொதுவாக, 1 முதல் 5 ஆண்டுகள் சிறந்த வட்டி விகிதங்களை வழங்குகின்றன.",
                "break": "ஆம்! உங்களுக்கு அவசரமாக பணம் தேவைப்பட்டால் முதிர்வுக்கு முன்பே உங்கள் எஃப்டியை முறித்துக்கொள்ளலாம். ஆனால் அதற்கு 0.5% முதல் 1% வரை அபராதம் விதிக்கப்படும்.",
                "default": "Fixed Deposit என்பது ஒரு உறுதியான வட்டி விகிதத்தில் பணத்தை சேமிப்பதற்கான பாதுகாப்பான வழியாகும். நீங்கள் வேறு என்ன தெரிந்து கொள்ள விரும்புகிறீர்கள்?"
            }
        }
        
        selected_lang_dict = fallbacks.get(lang, fallbacks["english"])
        return selected_lang_dict.get(intent, selected_lang_dict["default"])

def translate_to_language(text: str, target_lang: str):
    if target_lang.lower() in ["hinglish", "english"] or not target_lang:
        return text
        
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f"Translate the following text accurately into {target_lang}. Ensure it sounds natural to a native speaker and maintain any formatting or numbers exactly as they are. \n\nText to translate:\n{text}"
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Translation Error: {e}")
        return text
