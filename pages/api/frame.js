import { getBookmarks } from '@farcaster/core';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { untrustedData } = req.body;
    const { searchTerm, authorFilter } = untrustedData;
    
    try {
      // Get bookmarks for the user
      const bookmarks = await getBookmarks(untrustedData.fid);
      
      // Filter bookmarks
      const filteredBookmarks = bookmarks.filter(bookmark => {
        const matchesSearch = !searchTerm || 
          bookmark.text.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAuthor = !authorFilter || 
          bookmark.author.username.toLowerCase().includes(authorFilter.toLowerCase());
        
        return matchesSearch && matchesAuthor;
      });

      // Return the first 5 matching bookmarks
      const results = filteredBookmarks.slice(0, 5);
      
      return res.status(200).json({
        frames: {
          version: "vNext",
          image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?results=${encodeURIComponent(JSON.stringify(results))}`,
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