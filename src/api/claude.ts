import { Message } from '../types';

const API_KEY = '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';
const API_URL = 'https://api.anthropic.com/v1/messages';

const SYSTEM_PROMPT = `You are an expert full-stack web developer and UI/UX designer. Your speciality is creating stunning, modern, and fully functional single-page websites using HTML, CSS (with Tailwind CDN), and vanilla JavaScript.

When the user asks you to create or modify a website:
1. ALWAYS return a complete, standalone HTML file that works independently.
2. Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
3. Use modern design principles: gradients, glassmorphism, smooth animations, hover effects.
4. Make it mobile-responsive.
5. Use Google Fonts via CDN if needed.
6. Include Font Awesome via CDN for icons if needed: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
7. Make the code clean, semantic, and well-structured.
8. Add subtle animations and transitions for a premium feel.

RESPONSE FORMAT (CRITICAL):
- Start your response with a brief explanation (1-2 sentences) of what you built.
- Then output the complete HTML between these exact markers:
  \`\`\`html
  <!DOCTYPE html>
  ...your complete HTML...
  </html>
  \`\`\`
- After the code block, optionally add tips or suggestions.

Always aim for professional, modern, visually impressive results that would impress clients and stakeholders.`;

export async function sendMessage(
  messages: Message[],
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (error: string) => void
): Promise<void> {
  const apiMessages = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-calls': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 8096,
        system: SYSTEM_PROMPT,
        messages: apiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const data = trimmed.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
              onChunk(parsed.delta.text);
            }
          } catch {
            // ignore parse errors
          }
        }
      }
    }

    onDone();
  } catch (err: unknown) {
    if (err instanceof Error) {
      onError(err.message);
    } else {
      onError('An unexpected error occurred');
    }
  }
}

export function extractCode(content: string): string {
  const htmlMatch = content.match(/```html\s*([\s\S]*?)```/);
  if (htmlMatch) {
    return htmlMatch[1].trim();
  }
  return '';
}
