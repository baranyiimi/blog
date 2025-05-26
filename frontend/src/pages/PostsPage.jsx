import { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PostsPage() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPost, setEditingPost] = useState({ title: '', content: '' });
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('/posts');
      setPosts(data);
    } catch (err) {
      console.error('Hiba a posztok lekérésekor:', err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/posts', newPost);
      setNewPost({ title: '', content: '' });
      fetchPosts();
    } catch (err) {
      console.error('Hiba a poszt létrehozásakor:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`/posts/${postId}`);
      fetchPosts();
    } catch (err) {
      console.error('Hiba a poszt törlésekor:', err);
    }
  };

  const handleEditPost = (post) => {
    setEditingPostId(post.id);
    setEditingPost({ title: post.title, content: post.content });
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/posts/${editingPostId}`, editingPost);
      setEditingPostId(null);
      setEditingPost({ title: '', content: '' });
      fetchPosts();
    } catch (err) {
      console.error('Hiba a poszt frissítésekor:', err);
    }
  };

  const handleAddComment = async (postId) => {
    const comment = commentInputs[postId];
    if (!comment) return;
    try {
      await axios.post(`/posts/${postId}/comments`, { comment });
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      fetchPosts();
    } catch (err) {
      console.error('Hiba a komment hozzáadásakor:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/comments/${commentId}`);
      fetchPosts();
    } catch (err) {
      console.error('Hiba a komment törlésekor:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Bejegyzések</h1>

      {token && (
        <form
          onSubmit={handleCreatePost}
          className="mb-8 bg-white rounded shadow p-4 space-y-4"
        >
          <h2 className="text-xl font-semibold">Új poszt</h2>
          <input
            type="text"
            placeholder="Cím"
            className="w-full border px-3 py-2 rounded"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Tartalom"
            className="w-full border px-3 py-2 rounded"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Létrehozás
          </button>
        </form>
      )}

      {posts.map((post) => (
        <div
          key={post.id}
          className="mb-6 bg-white rounded shadow p-4 space-y-2"
        >
          {editingPostId === post.id ? (
            <form onSubmit={handleUpdatePost} className="space-y-2">
              <input
                type="text"
                value={editingPost.title}
                className="w-full border px-3 py-2 rounded"
                onChange={(e) =>
                  setEditingPost({ ...editingPost, title: e.target.value })
                }
                required
              />
              <textarea
                value={editingPost.content}
                className="w-full border px-3 py-2 rounded"
                onChange={(e) =>
                  setEditingPost({ ...editingPost, content: e.target.value })
                }
                required
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Mentés
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  onClick={() => setEditingPostId(null)}
                >
                  Mégse
                </button>
              </div>
            </form>
          ) : (
            <>
              <h3 className="text-xl font-bold">{post.title}</h3>
              <p>{post.content}</p>
              <p className="text-sm text-gray-500">
                Írta: {post.user.name}
              </p>
              {user && user.id === post.user_id && (
                <button
                  onClick={() => handleEditPost(post)}
                  className="text-blue-600 hover:underline mr-4"
                >
                  Szerkesztés
                </button>
              )}
              {user && (user.id === post.user_id || user.role === 'admin') && (
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="text-red-600 hover:underline"
                >
                  Törlés
                </button>
              )}
            </>
          )}

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Kommentek</h4>
            {post.comments.map((comment) => (
              <div
                key={comment.id}
                className="border-t pt-2 mt-2 text-sm flex justify-between items-center"
              >
                <div>
                  <p>{comment.comment}</p>
                  <p className="text-gray-500">– {comment.user.name}</p>
                </div>
                {user &&
                  (user.id === comment.user_id ||
                    user.id === post.user_id ||
                    user.role === 'admin') && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Törlés
                    </button>
                  )}
              </div>
            ))}

            <div className="mt-2 flex space-x-2">
              <input
                type="text"
                placeholder="Új komment"
                className="flex-grow border rounded px-3 py-1"
                value={commentInputs[post.id] || ''}
                onChange={(e) =>
                  setCommentInputs((prev) => ({
                    ...prev,
                    [post.id]: e.target.value,
                  }))
                }
              />
              <button
                onClick={() => handleAddComment(post.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Küldés
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
