import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts');
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch posts');
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="flex justify-center mt-32 text-slate-500 font-medium text-xl animate-pulse">Loading posts...</div>;
  if (error) return <div className="text-center mt-20 text-red-500 font-medium text-xl">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-10 tracking-tight border-b border-slate-200 pb-4">Latest Articles</h1>
      
      {posts.length === 0 ? (
        <div className="text-center text-slate-500 text-lg mt-20 p-12 bg-white rounded-2xl shadow-sm border border-slate-100">
          <p>No posts yet.</p>
          <p className="font-semibold text-emerald-600 mt-2">Log in to be the first to write one!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map(post => (
            <article key={post._id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <h2 className="text-3xl font-bold text-slate-800 mb-4 group-hover:text-emerald-600 transition-colors">{post.title}</h2>
              <div className="flex items-center text-sm text-slate-500 mb-6">
                <span className="font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{post.author?.name || 'Unknown Author'}</span>
                <span className="mx-3">•</span>
                <span className="font-medium text-slate-400">{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">{post.body}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
