import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const results = searchParams.get('results');
    const error = searchParams.get('error');

    if (error) {
      return new ImageResponse(
        (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: '#f5f5f5',
              padding: '40px',
            }}
          >
            <h1 style={{ color: '#ef4444', marginBottom: '20px' }}>
              Error Searching Bookmarks
            </h1>
            <p style={{ color: '#666' }}>Please try again</p>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    if (!results) {
      return new ImageResponse(
        (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: '#f5f5f5',
              padding: '40px',
            }}
          >
            <h1 style={{ color: '#333', marginBottom: '20px' }}>
              Farcaster Bookmark Search
            </h1>
            <p style={{ color: '#666' }}>Enter a keyword to search your bookmarks</p>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    const bookmarks = JSON.parse(results);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#f5f5f5',
            padding: '40px',
          }}
        >
          <h1 style={{ color: '#333', marginBottom: '20px', textAlign: 'center' }}>
            Search Results
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {bookmarks.map((bookmark, index) => (
              <div
                key={bookmark.hash}
                style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <img
                    src={bookmark.author.pfp}
                    alt={bookmark.author.username}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                    }}
                  />
                  <span style={{ color: '#333', fontWeight: 'bold' }}>
                    {bookmark.author.username}
                  </span>
                </div>
                <p style={{ color: '#666', margin: '0' }}>{bookmark.text}</p>
              </div>
            ))}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
} 