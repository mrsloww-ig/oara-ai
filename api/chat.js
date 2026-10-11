export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Reads the key you saved in Vercel Environment Variables
  const apiKey = process.env.AI_GATEWAY_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'AI_GATEWAY_API_KEY is missing on Vercel.' });
  }

  try {
    const { messages } = req.body;

    const response = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are OARA AI, a retro 1990s CAD workstation assistant. Keep responses brief, helpful, and kaomoji-rich like (◕‿◕)⚡ and (⌐■_■)."
          },
          ...messages
        ]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
