const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendChatMessage(
  query: string,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (err: string) => void
) {
  try {
    const response = await fetch(`${BACKEND_URL}/agent/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      onError(data.detail || 'Something went wrong. Please try again.');
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError('No response stream available.');
      return;
    }

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            onDone();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.chunk) onChunk(parsed.chunk);
            if (parsed.error) onError(parsed.error);
          } catch {
            // non-JSON line, skip
          }
        }
      }
    }
    onDone();
  } catch {
    onError("Couldn't connect to the AI. Make sure the backend is running.");
  }
}

export async function fetchContent(nodePath: string): Promise<string> {
  const response = await fetch(`${BACKEND_URL}/content/${nodePath}`);
  if (!response.ok) return '';
  const data = await response.json();
  return data.content || '';
}
