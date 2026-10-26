import axios from 'axios';

const MAX_CHUNK = 450; // MyMemory limita ~500 caracteres por petición

function splitText(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g) ?? [text];
  const chunks: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if (current && (current + sentence).length > MAX_CHUNK) {
      chunks.push(current.trim());
      current = '';
    }
    current += sentence;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function translateChunk(text: string): Promise<string> {
  const { data } = await axios.get('https://api.mymemory.translated.net/get', {
    params: { q: text, langpair: 'en|es' },
    timeout: 15000,
  });
  const translated: string | undefined = data?.responseData?.translatedText;
  if (data?.responseStatus !== 200 || !translated) {
    throw new Error('Translation failed');
  }
  return translated;
}

/** Traduce inglés → español. Lanza error si falla (el llamador usa el original como respaldo). */
export async function translateToSpanish(text: string): Promise<string> {
  const parts = await Promise.all(splitText(text).map(translateChunk));
  return parts.join(' ');
}
