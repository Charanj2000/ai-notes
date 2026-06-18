import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  console.log('=== Chat API Hit ===');
  try {
    const body = await request.json();
    console.log('Question:', body.question);
    console.log('Notes count:', body.notes?.length);

    if (!body.question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const notesContext = body.notes
      .map((note: { title: string; content: string }) =>
        `Title: ${note.title}\nContent: ${note.content}`
      )
      .join('\n\n---\n\n');

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `You are a helpful AI assistant. Answer questions based on the user's notes. If the answer is not in the notes, say so clearly. Be concise and helpful.\n\nUser's notes:\n${notesContext}`,
        },
        {
          role: 'user',
          content: body.question,
        },
      ],
      max_tokens: 500,
    });

    const answer = completion.choices[0]?.message?.content || 'Sorry, I could not find an answer.';
    console.log('Answer generated successfully');
    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Chat error:', (error as Error).message);
    return NextResponse.json({ error: 'Failed to get answer' }, { status: 500 });
  }
}