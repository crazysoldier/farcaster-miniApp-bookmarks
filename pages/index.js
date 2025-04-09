import { useState } from 'react';
import { useSignIn } from '@farcaster/auth-kit';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { signIn, isAuthenticated, user } = useSignIn();

  const handleSearch = async () => {
    if (!isAuthenticated) {
      alert('Please sign in first');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual Farcaster API call to fetch bookmarks
      // This is a placeholder for the actual implementation
      const response = await fetch('/api/search-bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerm,
          authorFilter,
          fid: user.fid,
        }),
      });
      
      const data = await response.json();
      setBookmarks(data.bookmarks);
    } catch (error) {
      console.error('Error searching bookmarks:', error);
      alert('Error searching bookmarks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Farcaster Bookmark Search
        </h1>

        {!isAuthenticated ? (
          <button onClick={signIn} className={styles.button}>
            Sign in with Farcaster
          </button>
        ) : (
          <div className={styles.searchContainer}>
            <div className={styles.searchInputs}>
              <input
                type="text"
                placeholder="Search by keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Filter by author..."
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
                className={styles.input}
              />
              <button 
                onClick={handleSearch}
                disabled={loading}
                className={styles.button}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            <div className={styles.results}>
              {bookmarks.map((bookmark) => (
                <div key={bookmark.hash} className={styles.bookmarkCard}>
                  <div className={styles.author}>
                    <img src={bookmark.author.pfp} alt={bookmark.author.username} className={styles.avatar} />
                    <span>{bookmark.author.username}</span>
                  </div>
                  <p className={styles.content}>{bookmark.text}</p>
                  <div className={styles.metadata}>
                    <span>{new Date(bookmark.timestamp).toLocaleDateString()}</span>
                    <a href={`https://warpcast.com/${bookmark.author.username}/${bookmark.hash}`} target="_blank" rel="noopener noreferrer">
                      View on Warpcast
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 