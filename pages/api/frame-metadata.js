export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const baseUrl = 'https://farcaster-mini-app-bookmarks.vercel.app';

  try {
    return res.status(200).json({
      "frame": {
        "version": "vNext",
        "image": `${baseUrl}/api/og`,
        "input": {
          "text": "Search bookmarks by keyword"
        },
        "buttons": [
          {
            "label": "Search",
            "action": "post",
            "target": `${baseUrl}/api/frame`
          }
        ]
      }
    });
  } catch (error) {
    console.error('Error in frame-metadata:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 