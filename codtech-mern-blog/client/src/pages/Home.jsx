import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Trash2, Edit } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      // Remove the deleted post from the screen instantly
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      alert('Failed to delete post');
    }
  };

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
            <article key={post._id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative">
              
              {/* Only show Edit/Delete buttons if the logged-in user is the author of THIS post */}
              {user && post.author?._id === user.id && (
                <div className="absolute top-6 right-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/edit/${post._id}`} className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit Post">
                    <Edit size={18} />
                  </Link>
                  <button onClick={() => handleDelete(post._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Post">
                    <Trash2 size={18} />
                  </button>
                </div>
              )}

              <h2 className="text-3xl font-bold text-slate-800 mb-4 pr-20 group-hover:text-emerald-600 transition-colors">{post.title}</h2>
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
