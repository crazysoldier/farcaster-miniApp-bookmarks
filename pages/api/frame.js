export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Redirect GET requests to the metadata endpoint
  if (req.method === 'GET') {
    return res.redirect(307, '/api/frame-metadata');
  }

  const baseUrl = 'https://farcaster-mini-app-bookmarks.vercel.app';

  if (req.method === 'POST') {
    try {
      const { untrustedData } = req.body;
      
      // Check if user is authenticated
      if (!untrustedData?.fid) {
        return res.status(200).json({
          frames: {
            version: "vNext",
            image: `${baseUrl}/api/og?error=auth`,
            buttons: [
              {
                label: "Sign in with Farcaster",
                action: "link",
                target: "https://warpcast.com/~/sign-in"
              }
            ]
          }
        });
      }

      const searchTerm = untrustedData.messageBytes ? 
        Buffer.from(untrustedData.messageBytes, 'base64').toString() : '';
      
      // For now, return a mock response since we can't access bookmarks directly
      const mockBookmarks = [
        {
          hash: '1',
          text: 'This is a sample bookmark about ' + (searchTerm || 'Farcaster'),
          author: {
            username: 'sample_user',
            pfp: 'https://warpcast.com/~/channel/avatar.png'
          }
        }
      ];
      
      return res.status(200).json({
        frames: {
          version: "vNext",
          image: `${baseUrl}/api/og?results=${encodeURIComponent(JSON.stringify(mockBookmarks))}`,
          buttons: [
            {
              label: "Search Again",
              action: "post",
              target: `${baseUrl}/api/frame`
            }
          ]
        }
      });
    } catch (error) {
      console.error('Error processing frame:', error);
      return res.status(500).json({
        frames: {
          version: "vNext",
          image: `${baseUrl}/api/og?error=true`,
          buttons: [
            {
              label: "Try Again",
              action: "post",
              target: `${baseUrl}/api/frame`
            }
          ]
        }
      });
    }
  }
} 