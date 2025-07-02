import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Header from './Header';
import Footer from './Footer';
import supabase from '../lib/supabase';

const { FiArrowLeft, FiCalendar, FiClock, FiUser, FiTag, FiEye, FiShare2, FiMessageSquare } = FiIcons;

function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      // Fetch the specific post
      const { data: postData, error: postError } = await supabase
        .from('blog_posts_wm2025')
        .select(`
          *,
          blog_post_categories_wm2025!inner(
            blog_categories_wm2025(name, slug, color)
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (postError || !postData) {
        setError('Post not found');
        setLoading(false);
        return;
      }

      setPost(postData);

      // Increment view count
      await supabase
        .from('blog_posts_wm2025')
        .update({ view_count: (postData.view_count || 0) + 1 })
        .eq('id', postData.id);

      // Fetch related posts
      const { data: relatedData } = await supabase
        .from('blog_posts_wm2025')
        .select(`
          *,
          blog_post_categories_wm2025!inner(
            blog_categories_wm2025(name, slug, color)
          )
        `)
        .eq('status', 'published')
        .neq('id', postData.id)
        .limit(3);

      if (relatedData) {
        setRelatedPosts(relatedData);
      }

    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Error loading post');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const scrollToContact = () => {
    navigate('/#contact-form');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPostCategory = (post) => {
    return post.blog_post_categories_wm2025?.[0]?.blog_categories_wm2025;
  };

  const renderContent = (content) => {
    // Simple markdown-like rendering
    return content
      .replace(/\n\n/g, '</p><p>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading article...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
              <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
              <motion.button
                onClick={() => navigate('/#blog')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Blog
              </motion.button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const category = getPostCategory(post);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Article Header */}
      <article className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Back Button */}
            <motion.button
              onClick={() => navigate('/#blog')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: -5 }}
            >
              <SafeIcon icon={FiArrowLeft} className="h-5 w-5" />
              Back to Blog
            </motion.button>

            {/* Category Badge */}
            {category && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name}
                </span>
              </motion.div>
            )}

            {/* Article Title */}
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {post.title}
            </motion.h1>

            {/* Article Meta */}
            <motion.div
              className="flex flex-wrap items-center gap-6 text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <SafeIcon icon={FiUser} className="h-4 w-4" />
                <span>{post.author_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <SafeIcon icon={FiClock} className="h-4 w-4" />
                <span>{post.read_time} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <SafeIcon icon={FiEye} className="h-4 w-4" />
                <span>{(post.view_count || 0).toLocaleString()} views</span>
              </div>
              <motion.button
                onClick={handleShare}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiShare2} className="h-4 w-4" />
                Share
              </motion.button>
            </motion.div>

            {/* Featured Image */}
            {post.featured_image && (
              <motion.div
                className="mb-12 rounded-2xl overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </motion.div>
            )}

            {/* Article Content */}
            <motion.div
              className="prose prose-lg max-w-none mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: `<p>${renderContent(post.content)}</p>`
                }}
              />
            </motion.div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <SafeIcon icon={FiTag} className="h-5 w-5" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA Section */}
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-4">
                Want to discuss this topic for your organization?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Every organization faces unique communication challenges. Let's talk about how these insights apply to your specific situation.
              </p>
              <motion.button
                onClick={scrollToContact}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiMessageSquare} className="h-5 w-5" />
                Start the Conversation
              </motion.button>
            </motion.div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => {
                    const relatedCategory = getPostCategory(relatedPost);
                    return (
                      <motion.article
                        key={relatedPost.id}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                        onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                        whileHover={{ y: -5 }}
                      >
                        <div className="h-40 overflow-hidden">
                          <img
                            src={relatedPost.featured_image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6">
                          {relatedCategory && (
                            <span
                              className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white mb-3"
                              style={{ backgroundColor: relatedCategory.color }}
                            >
                              {relatedCategory.name}
                            </span>
                          )}
                          <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {relatedPost.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <SafeIcon icon={FiClock} className="h-3 w-3" />
                              {relatedPost.read_time} min
                            </div>
                            <div className="flex items-center gap-1">
                              <SafeIcon icon={FiEye} className="h-3 w-3" />
                              {(relatedPost.view_count || 0).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}

export default BlogPost;