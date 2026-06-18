import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content || content.trim().length < 10) {
      return NextResponse.json({ tags: [] });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'user',
          content: `Extract 3-5 relevant tags from this note. Return ONLY a JSON array of strings, nothing else. Example: ["react", "javascript", "hooks"]\n\nNote:\n${content}`,
        },
      ],
      max_tokens: 100,
    });

    const text = completion.choices[0]?.message?.content || '[]';
    const jsonMatch = text.match(/\[.*\]/s);
    const tags = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return NextResponse.json({ tags });
  } catch {
    return NextResponse.json({ tags: [] });
  }
}