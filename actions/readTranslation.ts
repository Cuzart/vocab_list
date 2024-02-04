'use server';

type Params = {
  text: string;
  lang: string;
};

// elevenlabs API
// problem not possible to pass language and AI is not able to detect language correctly in some cases
export async function readTranslation({ text, lang }: Params) {
  const authKey = process.env.ELEVEN_LABS_API_KEY!;
  const voiceId = 'lQYkWgXhKrrMHZfGe78F';

  const body = JSON.stringify({
    text: text,
    model_id: 'eleven_multilingual_v2',
  });

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'xi-api-key': authKey },
    body: body,
  };

  fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, options).then(
    (response) => {
      if (response.ok) {
        return response.blob();
      } else {
        throw new Error('Error: ' + response.statusText);
      }
    }
  );
}
