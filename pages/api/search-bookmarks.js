import { getBookmarks } from '@farcaster/core';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { searchTerm, authorFilter, fid } = req.body;

    // Get all bookmarks for the user
    const bookmarks = await getBookmarks(fid);

    // Filter bookmarks based on search criteria
    const filteredBookmarks = bookmarks.filter(bookmark => {
      const matchesSearch = !searchTerm || 
        bookmark.text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAuthor = !authorFilter || 
        bookmark.author.username.toLowerCase().includes(authorFilter.toLowerCase());
      
      return matchesSearch && matchesAuthor;
    });

    return res.status(200).json({ bookmarks: filteredBookmarks });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
} 