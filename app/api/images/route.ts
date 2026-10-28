// Next.js App Router Route Handler for AI Image Generation
// POST /api/images

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      prompt,
      aspectRatio = '1:1',
      style = 'Realistic',
      negativePrompt = '',
      seed: customSeed,
    } = body;

    // 1. Validate prompt
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return new Response(JSON.stringify({ error: 'Please enter a valid image prompt description.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cleanPrompt = prompt.trim();
    const seed = customSeed || Math.floor(Math.random() * 10000000);

    // Compute dimensions
    let width = 768;
    let height = 768;
    if (aspectRatio === '16:9') {
      width = 1024;
      height = 576;
    } else if (aspectRatio === '3:4') {
      width = 768;
      height = 1024;
    } else if (aspectRatio === '4:3') {
      width = 1024;
      height = 768;
    } else if (aspectRatio === '9:16') {
      width = 576;
      height = 1024;
    }

    // Style prompt enhancer
    let styleSuffix = '';
    switch (style) {
      case 'Realistic':
      case 'Photorealistic':
        styleSuffix = ', photorealistic, 8k, natural lighting, high dynamic range, crisp fine details';
        break;
      case 'Anime':
      case 'Anime Aesthetic':
        styleSuffix = ', anime illustration style, shoujo aesthetic, clean lines, vibrant anime color palette, highly detailed';
        break;
      case '3D':
      case '3D Render':
        styleSuffix = ', 3D digital character render, Pixar / Octane render style, smooth lighting, subsurface scattering, ambient occlusion';
        break;
      case 'Illustration':
        styleSuffix = ', delicate editorial illustration, artistic hand-drawn texture, pastel tones';
        break;
      case 'Cinematic':
        styleSuffix = ', cinematic film still, 35mm photography, dramatic atmospheric lighting, shallow depth of field, anamorphic';
        break;
      case 'Product Photography':
        styleSuffix = ', commercial product photography, studio lightbox, soft reflections, clean luxury aesthetic';
        break;
      case 'Botanical Watercolor':
        styleSuffix = ', botanical watercolor painting, delicate pastel pigments, soft watercolor washes on cold-press paper';
        break;
      case 'Editorial Studio':
        styleSuffix = ', high-end editorial studio portrait, minimalist aesthetic, diffused daylight';
        break;
      default:
        if (style) styleSuffix = `, ${style} style`;
    }

    const enhancedPrompt = `${cleanPrompt}${styleSuffix}${negativePrompt ? `, avoid: ${negativePrompt}` : ''}`;
    const hfToken = req.headers.get('x-hf-token') || process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
    const pollenKey = req.headers.get('x-pollen-key') || process.env.POLLEN_API_KEY;

    // 1. Try Hugging Face if HF_TOKEN is configured
    if (hfToken) {
      try {
        const hfRes = await fetch('https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${hfToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: enhancedPrompt }),
        });

        if (hfRes.ok) {
          const arrayBuf = await hfRes.arrayBuffer();
          if (arrayBuf.byteLength > 1000) {
            const base64 = Buffer.from(arrayBuf).toString('base64');
            const contentType = hfRes.headers.get('content-type') || 'image/jpeg';
            return new Response(
              JSON.stringify({
                imageUrl: `data:${contentType};base64,${base64}`,
                prompt: cleanPrompt,
                aspectRatio,
                style,
                provider: 'Hugging Face (FLUX.1-schnell)',
                seed,
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
          }
        }
      } catch (hfErr) {
        console.warn('Hugging Face inference error:', hfErr);
      }
    }

    // 2. Real AI generation via FLUX engine
    let lastErrorMsg = '';
    let lastStatus = 500;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const pollUrl = new URL(`https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}`);
        pollUrl.searchParams.set('width', String(width));
        pollUrl.searchParams.set('height', String(height));
        pollUrl.searchParams.set('seed', String(seed + attempt * 29));
        pollUrl.searchParams.set('nologo', 'true');
        pollUrl.searchParams.set('model', 'flux');
        if (pollenKey) {
          pollUrl.searchParams.set('pollenKey', String(pollenKey));
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 35000);

        const imgRes = await fetch(pollUrl.toString(), {
          signal: controller.signal,
          headers: {
            'User-Agent': 'RanuuAI/2.0',
            'Accept': 'image/*',
          },
        });
        clearTimeout(timeout);

        if (imgRes.ok) {
          const contentType = imgRes.headers.get('content-type') || '';
          const arrayBuffer = await imgRes.arrayBuffer();

          if (arrayBuffer.byteLength > 1000) {
            const uint8 = new Uint8Array(arrayBuffer);
            const isJpeg = uint8[0] === 0xff && uint8[1] === 0xd8;
            const isPng = uint8[0] === 0x89 && uint8[1] === 0x50 && uint8[2] === 0x4e && uint8[3] === 0x47;
            const isWebp = uint8[0] === 0x52 && uint8[1] === 0x49 && uint8[2] === 0x46 && uint8[3] === 0x46;

            if (isJpeg || isPng || isWebp || contentType.includes('image')) {
              const mime = isJpeg ? 'image/jpeg' : isPng ? 'image/png' : isWebp ? 'image/webp' : 'image/jpeg';
              const base64 = Buffer.from(arrayBuffer).toString('base64');
              const dataUrl = `data:${mime};base64,${base64}`;

              return new Response(
                JSON.stringify({
                  imageUrl: dataUrl,
                  prompt: cleanPrompt,
                  aspectRatio,
                  style,
                  provider: 'FLUX.1 Schnell Engine',
                  seed,
                }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
              );
            }
          }
        }

        lastStatus = imgRes.status;
        const retryHeader = imgRes.headers.get('retry-after');
        const waitSec = retryHeader ? Math.min(25, parseInt(retryHeader, 10)) : 15;

        const errText = await imgRes.text();
        try {
          const parsed = JSON.parse(errText);
          lastErrorMsg = parsed?.error?.message || parsed?.message || errText;
        } catch {
          lastErrorMsg = errText.slice(0, 200);
        }

        if (attempt < 3 && lastStatus === 402) {
          await new Promise((r) => setTimeout(r, waitSec * 1000));
        } else if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 4000));
        }
      } catch (err: any) {
        lastErrorMsg = err?.message || 'Network timeout connecting to AI image provider.';
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    }

    return new Response(
      JSON.stringify({
        error: lastErrorMsg.includes('Free limit')
          ? 'The free image generation service rate limit was reached (1 image per 45s). Please wait a few seconds and click Retry, or configure a Hugging Face / Pollen key.'
          : `AI image generation failed: ${lastErrorMsg || 'Service temporarily unavailable'}. Please retry in a few moments.`,
        provider: 'FLUX.1 AI Engine',
        retryAfter: 15,
      }),
      { status: lastStatus === 402 || lastStatus === 429 ? 429 : 503, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (outerErr: any) {
    return new Response(
      JSON.stringify({ error: outerErr?.message || 'Server error generating image.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
