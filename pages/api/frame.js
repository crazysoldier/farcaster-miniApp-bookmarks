export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Ensure we have the base URL
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    console.error('NEXT_PUBLIC_BASE_URL is not set');
    return res.status(500).json({
      frames: {
        version: "vNext",
        image: "https://placehold.co/1200x630/ef4444/ffffff?text=Configuration+Error",
        buttons: [
          {
            label: "Try Again",
            action: "post",
            target: `${req.headers.host}/api/frame`
          }
        ]
      }
    });
  }

  if (req.method === 'POST') {
    try {
      const { untrustedData } = req.body;
      
      // Check if user is authenticated
      if (!untrustedData?.fid) {
        return res.status(200).json({
          frames: {
            version: "vNext",
            image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?error=auth`,
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
          image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?results=${encodeURIComponent(JSON.stringify(mockBookmarks))}`,
          buttons: [
            {
              label: "Search Again",
              action: "post",
              target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`
            }
          ]
        }
      });
    } catch (error) {
      console.error('Error processing frame:', error);
      return res.status(500).json({
        frames: {
          version: "vNext",
          image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?error=true`,
          buttons: [
            {
              label: "Try Again",
              action: "post",
              target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`
            }
          ]
        }
      });
    }
  }

  // GET request - return the initial frame
  return res.status(200).json({
    frames: {
      version: "vNext",
      image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og`,
      input: {
        text: "Search bookmarks by keyword"
      },
      buttons: [
        {
          label: "Search",
          action: "post",
          target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`
        }
      ]
    }
  });
} 