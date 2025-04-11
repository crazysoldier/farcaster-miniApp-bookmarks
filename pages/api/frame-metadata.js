export default async function handler(req, res) {
  const baseUrl = 'https://farcaster-mini-app-bookmarks.vercel.app';

  return res.status(200).json({
    "frames": {
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
} 