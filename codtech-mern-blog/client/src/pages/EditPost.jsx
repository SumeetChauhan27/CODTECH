import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function EditPost() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        // Ensure the logged-in user is the actual author
        if (res.data.author._id !== user.id) {
          navigate('/');
        } else {
          setTitle(res.data.title);
          setBody(res.data.body);
        }
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch post details');
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.put(`http://localhost:5000/api/posts/${id}`, { title, body });
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center mt-32 text-slate-500 font-medium animate-pulse">Loading post details...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-slate-100">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight">Edit Post</h1>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-lg font-medium"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Content</label>
            <textarea 
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all min-h-[300px] resize-y leading-relaxed text-slate-700"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end items-center pt-6 border-t border-slate-100">
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 mr-4 rounded-lg font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg shadow-emerald-500/30 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
