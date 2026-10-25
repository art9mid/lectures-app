import type { NextRequest } from 'next/server';

const KEY = process.env.AZURE_SPEECH_KEY;
const REGION = process.env.AZURE_SPEECH_REGION ?? 'westeurope';
const VOICES: Record<string, string> = { alina: 'ro-RO-AlinaNeural', emil: 'ro-RO-EmilNeural' };

const escapeXml = (s: string) =>
  s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);

// GET /api/tts?text=Eu%20sunt&voice=alina → MP3. Same URL = same audio, so the CDN caches it forever.
export async function GET(req: NextRequest) {
  if (!KEY) return new Response('AZURE_SPEECH_KEY not set', { status: 501 });
  const text = req.nextUrl.searchParams.get('text')?.trim() ?? '';
  if (!text || text.length > 400) return new Response('text required (max 400 chars)', { status: 400 });
  const voice = VOICES[req.nextUrl.searchParams.get('voice') ?? 'alina'] ?? VOICES.alina;

  const res = await fetch(`https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': KEY,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
    },
    body: `<speak version="1.0" xml:lang="ro-RO"><voice name="${voice}"><prosody rate="-10%">${escapeXml(text)}</prosody></voice></speak>`,
  });
  if (!res.ok) return new Response(`Azure TTS ${res.status}`, { status: 502 });

  return new Response(res.body, {
    headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable' },
  });
}
