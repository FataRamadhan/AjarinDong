import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize the SDK client on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

interface ChatMessage {
  sender: 'user' | 'mentor';
  text: string;
}

export async function POST(req: NextRequest) {
  try {
    const { mentor, messages } = await req.json();

    if (!mentor) {
      return NextResponse.json({ error: "Data mentor wajib disertakan." }, { status: 400 });
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Sesi percakapan tidak valid." }, { status: 400 });
    }

    // Build helper system instructions defining the mentor's role
    const systemInstruction = `
      Anda adalah ${mentor.name}, sorang mentor belajar berpengalaman di platform AjarinDong.
      Spesialisasi keahlian Anda: ${mentor.expertise.join(", ")}.
      Pengalaman mengajar: ${mentor.experience} tahun.
      Biografi Anda: ${mentor.bio || "Mentor berdedikasi tinggi."}

      Gaya Komunikasi & Aturan:
      1. Berbicaralah menggunakan bahasa Indonesia yang santun, kasual/semi-formal, ramah, dan sangat mendukung (pembawaan hangat khas guru privat idaman).
      2. Jangan langsung memberikan jawaban akhir secara instan untuk pertanyaan latihan. Sebaliknya, bantu murid memahami konsep dasarnya selangkah demi selangkah, mengajukan pertanyaan penuntun (guiding questions), atau memberikan tips praktis.
      3. Jaga agar setiap pesan respon Anda ringkas, jelas, terbagi dalam paragraf pendek, dan cocok untuk dibaca dalam balon obrolan langsung (live chat). Gunakan format markdown dasar jika diperlukan (seperti tebal atau bullet points) agar visualnya enak dibaca.
      4. Tunjukkan antusiasme tinggi untuk membantu murid berkembang dan pantau kemajuan mereka dalam diskusi.
    `;

    // Map conversation logs into content format
    const formattedHistory = messages.slice(-10).map((msg: ChatMessage) => {
      const role = msg.sender === 'user' ? 'user' : 'model';
      return `${role === 'user' ? 'Murid' : mentor.name}: ${msg.text}`;
    }).join("\n");

    const prompt = `
      Berikut riwayat obrolan sejauh ini:
      ${formattedHistory}

      Sekarang, berikan respon balasan Anda sebagai ${mentor.name} untuk pesan terakhir murid tersebut dengan hangat, cerdas, dan membimbing.
    `;

    // Make the API call securely inside the server environment
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.95,
      }
    });

    const reply = response.text || "Halo! Ada yang bisa saya bantu untuk materi belajar Anda hari ini?";

    return NextResponse.json({ text: reply });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    return NextResponse.json(
      { error: "Terjadi gangguan saat menghubungi mentor AI Anda. Coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}
