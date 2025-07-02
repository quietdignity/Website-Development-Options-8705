import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiPlus, FiEdit3, FiTrash2, FiEye, FiSave, FiX, FiImage, FiTag, FiCalendar, FiClock } = FiIcons;

function BlogAdmin() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    status: 'draft',
    featured: false,
    meta_title: '',
    meta_description: '',
    tags: [],
    category_id: '',
    read_time: 5
  });

  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    try {
      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts_wm2025')
        .select(`
          *,
          blog_post_categories_wm2025(
            blog_categories_wm2025(*)
          )
        `)
        .order('created_at', { ascending: false });

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('blog_categories_wm2025')
        .select('*')
        .order('name');

      if (!postsError && postsData) {
        setPosts(postsData);
      }

      if (!categoriesError && categoriesData) {
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error fetching blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'title') {
      setFormData({
        ...formData,
        title: value,
        slug: generateSlug(value),
        meta_title: value
      });
    } else if (name === 'excerpt') {
      setFormData({
        ...formData,
        excerpt: value,
        meta_description: value
      });
    } else if (name === 'tags') {
      const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
      setFormData({
        ...formData,
        tags: tagsArray
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const postData = {
        ...formData,
        read_time: parseInt(formData.read_time) || 5,
        published_at: formData.status === 'published' ? new Date().toISOString() : null
      };

      let result;
      if (editingPost) {
        // Update existing post
        const { data, error } = await supabase
          .from('blog_posts_wm2025')
          .update(postData)
          .eq('id', editingPost.id)
          .select()
          .single();
        result = { data, error };
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('blog_posts_wm2025')
          .insert([postData])
          .select()
          .single();
        result = { data, error };
      }

      if (result.error) {
        throw result.error;
      }

      // Handle category relationship
      if (formData.category_id && result.data) {
        // Delete existing relationships
        await supabase
          .from('blog_post_categories_wm2025')
          .delete()
          .eq('post_id', result.data.id);

        // Insert new relationship
        await supabase
          .from('blog_post_categories_wm2025')
          .insert([{
            post_id: result.data.id,
            category_id: formData.category_id
          }]);
      }

      // Refresh data
      await fetchBlogData();
      
      // Reset form
      setEditingPost(null);
      setShowNewPost(false);
      resetForm();
      
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      featured_image: post.featured_image || '',
      status: post.status,
      featured: post.featured,
      meta_title: post.meta_title || post.title,
      meta_description: post.meta_description || post.excerpt,
      tags: post.tags || [],
      category_id: post.blog_post_categories_wm2025?.[0]?.category_id || '',
      read_time: post.read_time || 5
    });
  };

  const handleDelete = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts_wm2025')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      await fetchBlogData();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      status: 'draft',
      featured: false,
      meta_title: '',
      meta_description: '',
      tags: [],
      category_id: '',
      read_time: 5
    });
  };

  const handleCancel = () => {
    setEditingPost(null);
    setShowNewPost(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Blog Management</h2>
          <p className="text-gray-600">Manage your blog posts and content</p>
        </div>
        <motion.button
          onClick={() => setShowNewPost(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SafeIcon icon={FiPlus} className="h-5 w-5" />
          New Post
        </motion.button>
      </div>

      {/* New/Edit Post Form */}
      {(showNewPost || editingPost) && (
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {editingPost ? 'Edit Post' : 'New Post'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <SafeIcon icon={FiX} className="h-6 w-6" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="post-url-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Excerpt *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Brief description of the post"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  name="featured_image"
                  value={formData.featured_image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Read Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="read_time"
                    value={formData.read_time}
                    onChange={handleInputChange}
                    min="1"
                    max="60"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags.join(', ')}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                  placeholder="Write your post content in Markdown..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    name="featured"
                    id="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                    Featured Post
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <button
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              onClick={handleSave}
              disabled={saving || !formData.title || !formData.content}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                saving || !formData.title || !formData.content
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
              whileHover={!saving ? { scale: 1.05 } : {}}
              whileTap={!saving ? { scale: 0.95 } : {}}
            >
              <SafeIcon icon={FiSave} className="h-5 w-5" />
              {saving ? 'Saving...' : 'Save Post'}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Posts List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={post.featured_image || '/placeholder-image.jpg'}
                          alt={post.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {post.title}
                          {post.featured && (
                            <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {post.excerpt?.substring(0, 100)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800'
                        : post.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.published_at 
                      ? new Date(post.published_at).toLocaleDateString()
                      : 'Not published'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <SafeIcon icon={FiEye} className="h-4 w-4" />
                        {post.view_count || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <SafeIcon icon={FiClock} className="h-4 w-4" />
                        {post.read_time || 5}m
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <SafeIcon icon={FiEdit3} className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiEdit3} className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No blog posts yet</h3>
          <p className="text-gray-600 mb-6">Create your first blog post to get started.</p>
          <button
            onClick={() => setShowNewPost(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create First Post
          </button>
        </div>
      )}
    </div>
  );
}

export default BlogAdmin;