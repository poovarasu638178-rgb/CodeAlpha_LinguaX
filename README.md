<div align="center">

# 🌍 LinguaX
**Translate Anything Instantly. Without Limits.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

[![Live Demo](https://img.shields.io/badge/Launch-Live_Demo-5A2132?style=for-the-badge&logo=vercel)](http://localhost:3000)

<img src="https://via.placeholder.com/1200x600/5A2132/EFE9E9?text=LinguaX+Translation+Engine" alt="LinguaX Preview" width="100%" />

</div>

---

## 📖 About

**LinguaX** is a premium, high-performance web-based AI translation engine built to break language barriers. Designed with a stunning "Masterpiece Red" glassmorphism aesthetic, LinguaX allows you to translate massive blocks of text (up to 50,000 characters) flawlessly across 100+ global languages. 

Powered by intelligent background text-chunking and an ultra-fast streaming ElevenLabs API integration, LinguaX doesn't just translate your words—it speaks them back to you using a studio-quality AI voice profile.

---

## ✨ Features

✅ **Unlimited Translation Engine:** Massive 50,000 character limit. Paste entire essays or documents without crashing.
✅ **Smart Chunking:** Intelligently splits huge text blocks at sentence boundaries to bypass standard API limitations, reassembling them flawlessly.
✅ **Custom "Jarvis" AI Voice:** Integrated with ElevenLabs' Turbo v2.5 model for ultra-low latency, studio-quality British male voice playback for English translations.
✅ **Local TTS Fallback:** Smart fallback to your device's native Web Speech API for all other 100+ languages to ensure accurate pronunciation globally.
✅ **Searchable Custom Dropdowns:** Beautiful, fully custom-built language selectors with built-in live search filtering.
✅ **Premium Aesthetic UI:** Glassmorphism design, blur backdrops, soft shadows, and micro-animations styled in a bespoke Masterpiece Red (`#5A2132`) and Dirty White (`#EFE9E9`) color palette.
✅ **Instant Language Swapping:** One-click swapping between source and target languages.
✅ **1-Click Copy:** Seamlessly copy your translations to your clipboard with animated toast notifications.
✅ **Auto-Resizing Input:** The text area dynamically grows as you type or paste content.
✅ **Character Tracking:** Live character counter to keep track of your 50k limit.

---

## 🌐 Languages Supported (100+)

LinguaX supports a massive dictionary of global languages. Select from:

Afrikaans, Albanian, Amharic, Arabic, Armenian, Azerbaijani, Basque, Belarusian, Bengali, Bosnian, Bulgarian, Catalan, Cebuano, Chinese (Simplified), Chinese (Traditional), Corsican, Croatian, Czech, Danish, Dutch, English, Esperanto, Estonian, Finnish, French, Frisian, Galician, Georgian, German, Greek, Gujarati, Haitian Creole, Hausa, Hawaiian, Hebrew, Hindi, Hmong, Hungarian, Icelandic, Igbo, Indonesian, Irish, Italian, Japanese, Javanese, Kannada, Kazakh, Khmer, Kinyarwanda, Korean, Kurdish, Kyrgyz, Lao, Latin, Latvian, Lithuanian, Luxembourgish, Macedonian, Malagasy, Malay, Malayalam, Maltese, Maori, Marathi, Mongolian, Myanmar (Burmese), Nepali, Norwegian, Nyanja (Chichewa), Odia (Oriya), Pashto, Persian, Polish, Portuguese, Punjabi, Romanian, Russian, Samoan, Scots Gaelic, Serbian, Sesotho, Shona, Sindhi, Sinhala, Slovak, Slovenian, Somali, Spanish, Sundanese, Swahili, Swedish, Tagalog (Filipino), Tajik, Tamil, Tatar, Telugu, Thai, Turkish, Turkmen, Ukrainian, Urdu, Uyghur, Uzbek, Vietnamese, Welsh, Xhosa, Yiddish, Yoruba, Zulu.

---

## 🛠 Tech Stack

- **Frontend Core:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Custom CSS with CSS Variables, Flexbox, CSS Grid, and Keyframe Animations
- **Translation APIs:** Google Translate API (Unofficial Endpoint), MyMemory API (Fallback)
- **Audio/TTS:** ElevenLabs API (`eleven_turbo_v2_5` model), Web Speech API (`window.speechSynthesis`)
- **Fonts:** 'DM Sans' (Google Fonts)
- **Icons:** Inline SVG Icons

---

## 🚀 How to Run (Local Setup)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/poovarasu638178-rgb/CodeAlpha_LinguaX.git
   ```
2. **Navigate to the directory:**
   ```bash
   cd CodeAlpha_LinguaX
   ```
3. **Start a local server:**
   You can use Node, Python, or Live Server. For example, with Node:
   ```bash
   node server.js
   ```
   *Alternatively, if you have python installed:*
   ```bash
   python3 -m http.server 3000
   ```
4. **Open in Browser:**
   Navigate to `http://localhost:3000` to start translating!

---

## 📂 Project Structure

```text
LinguaX/
│
├── index.html        # The main structural markup and UI
├── style.css         # All styling, animations, and glassmorphism themes
├── script.js         # Core logic: chunking, API calls, custom dropdowns, TTS
├── server.js         # Basic Node.js server for local hosting
└── README.md         # You are here!
```

---

## 🔌 API Documentation

LinguaX relies on a multi-tiered API approach for stability and speed:
1. **Google Translate (Primary):** `https://translate.googleapis.com/translate_a/single`
2. **MyMemory Translation (Fallback):** `https://api.mymemory.translated.net/get`
3. **ElevenLabs TTS (English Audio):** `https://api.elevenlabs.io/v1/text-to-speech/N2lVS1w4EtoT3dr4eOWO/stream` (Powered by the `eleven_turbo_v2_5` model for latency optimization).

---

## 👨‍💻 Author

Built by **Poovarasu S**
- **GitHub:** [@poovarasu638178-rgb](https://github.com/poovarasu638178-rgb)
- **Internship:** CodeAlpha AI Internship 2026
- **Student ID:** CA/DF1/126353

---

## 📄 License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute this software.

---

<div align="center">
  <b>⭐ Star this repo if you found it helpful!</b>
</div>
