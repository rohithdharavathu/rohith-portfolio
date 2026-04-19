const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Debug: log the resolved backend URL once at module load (visible in browser console)
if (typeof window !== 'undefined') {
  console.log('[api] BACKEND_URL =', BACKEND_URL);
}

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
  const endpoint = `${BACKEND_URL}/agent/chat`;
  console.log('[api] POST', endpoint);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const msg = data.detail || `HTTP ${response.status} from ${endpoint}`;
      console.error('[api] Non-OK response:', response.status, data);
      onError(msg);
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
            if (parsed.error) {
              console.error('[api] Stream error from backend:', parsed.error);
              onError(parsed.error);
            }
          } catch {
            // non-JSON SSE line, skip
          }
        }
      }
    }
    onDone();
  } catch (error: unknown) {
    const msg = error instanceof Error
      ? `Network error: ${error.message}`
      : `Unknown error connecting to ${endpoint}`;
    console.error('[api] Fetch failed:', error);
    onError(msg);
  }
}

export async function fetchContent(nodePath: string): Promise<string> {
  const response = await fetch(`${BACKEND_URL}/content/${nodePath}`);
  if (!response.ok) return '';
  const data = await response.json();
  return data.content || '';
}
