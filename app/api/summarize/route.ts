import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  console.log('=== Summarize API Hit ===');
  try {
    const { content } = await request.json();

    if (!content || content.trim().length < 10) {
      return NextResponse.json({ error: 'Content too short' }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'user',
          content: `Summarize the following note in 2-3 concise sentences. Be direct and informative:\n\n${content}\n\nSummary:`,
        },
      ],
      max_tokens: 200,
    });

    const summary = completion.choices[0]?.message?.content || '';
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Summarize error:', error);
    return NextResponse.json({ error: 'Failed to summarize' }, { status: 500 });
  }
}