import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiMessageSquare, FiUser, FiMail, FiGlobe, FiSend, FiReply, FiClock, FiCheck, FiAlertCircle, FiThumbsUp } = FiIcons;

function CommentSection({ postId, postTitle }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    author_website: '',
    content: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    try {
      // Fetch top-level comments with their replies
      const { data: topLevelComments, error } = await supabase
        .from('blog_comments_wm2025')
        .select('*')
        .eq('post_id', postId)
        .eq('status', 'approved')
        .is('parent_id', null)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch replies for each top-level comment
      const commentsWithReplies = await Promise.all(
        topLevelComments.map(async (comment) => {
          const { data: replies, error: repliesError } = await supabase
            .from('blog_comments_wm2025')
            .select('*')
            .eq('parent_id', comment.id)
            .eq('status', 'approved')
            .order('created_at', { ascending: true });

          if (repliesError) {
            console.warn('Error fetching replies:', repliesError);
            return { ...comment, replies: [] };
          }

          return { ...comment, replies: replies || [] };
        })
      );

      setComments(commentsWithReplies);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);

    try {
      // Validate form
      if (!formData.author_name.trim() || !formData.author_email.trim() || !formData.content.trim()) {
        throw new Error('Please fill in all required fields');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.author_email)) {
        throw new Error('Please enter a valid email address');
      }

      const commentData = {
        post_id: postId,
        parent_id: replyingTo,
        author_name: formData.author_name.trim(),
        author_email: formData.author_email.trim(),
        author_website: formData.author_website.trim() || null,
        content: formData.content.trim(),
        status: 'pending' // Comments start as pending for moderation
      };

      const { error } = await supabase
        .from('blog_comments_wm2025')
        .insert([commentData]);

      if (error) throw error;

      // Send notification email to admin
      try {
        await fetch(`https://sdfnpskccbvilzpcpzzo.supabase.co/functions/v1/send-comment-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkZm5wc2tjY2J2aWx6cGNwenpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNzUyNjEsImV4cCI6MjA2Njc1MTI2MX0.dkIxMqlYhxNNWbYhiDjelZnLzpdl0OIU84T51hHCXis`
          },
          body: JSON.stringify({
            ...commentData,
            postTitle,
            isReply: !!replyingTo
          })
        });
      } catch (emailError) {
        console.warn('Failed to send notification email:', emailError);
      }

      // Reset form
      setFormData({
        author_name: '',
        author_email: '',
        author_website: '',
        content: ''
      });
      setReplyingTo(null);
      
      setSubmitStatus({
        type: 'success',
        message: 'Thank you! Your comment has been submitted and is awaiting moderation.'
      });

      // Refresh comments after a short delay
      setTimeout(() => {
        fetchComments();
      }, 1000);

    } catch (error) {
      console.error('Error submitting comment:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to submit comment. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    // Scroll to comment form
    setTimeout(() => {
      document.getElementById('comment-form').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const CommentItem = ({ comment, isReply = false }) => (
    <motion.div
      className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${isReply ? 'ml-8 mt-4' : 'mb-6'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <SafeIcon icon={FiUser} className="h-5 w-5" />
        </div>

        <div className="flex-1">
          {/* Comment Header */}
          <div className="flex items-center gap-3 mb-3">
            <h4 className="font-semibold text-gray-900">{comment.author_name}</h4>
            {comment.author_website && (
              <a 
                href={comment.author_website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                <SafeIcon icon={FiGlobe} className="h-4 w-4" />
              </a>
            )}
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <SafeIcon icon={FiClock} className="h-3 w-3" />
              {formatDate(comment.created_at)}
            </div>
            {comment.author_email === 'james@workplacemapping.com' && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                Author
              </span>
            )}
          </div>

          {/* Comment Content */}
          <div className="prose prose-sm max-w-none mb-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-4">
            {!isReply && (
              <motion.button
                onClick={() => handleReply(comment.id)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiReply} className="h-4 w-4" />
                Reply
              </motion.button>
            )}
            
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
              <SafeIcon icon={FiThumbsUp} className="h-4 w-4" />
              Helpful
            </button>
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-6">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        {/* Comments Header */}
        <div className="flex items-center gap-3 mb-8">
          <SafeIcon icon={FiMessageSquare} className="h-6 w-6 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-900">
            Discussion ({comments.length})
          </h3>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {submitStatus && (
            <motion.div
              className={`mb-6 p-4 rounded-lg ${
                submitStatus.type === 'success' 
                  ? 'bg-green-100 border border-green-300 text-green-800' 
                  : 'bg-red-100 border border-red-300 text-red-800'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center gap-3">
                <SafeIcon 
                  icon={submitStatus.type === 'success' ? FiCheck : FiAlertCircle} 
                  className="h-5 w-5" 
                />
                {submitStatus.message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comment Form */}
        <motion.div
          id="comment-form"
          className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="text-xl font-bold text-gray-900 mb-6">
            {replyingTo ? 'Reply to Comment' : 'Join the Discussion'}
          </h4>
          
          {replyingTo && (
            <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
              <p className="text-sm text-blue-800">
                Replying to a comment. 
                <button 
                  onClick={() => setReplyingTo(null)}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Cancel reply
                </button>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name *
                </label>
                <div className="relative">
                  <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email * <span className="text-xs text-gray-500">(Not published)</span>
                </label>
                <div className="relative">
                  <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.author_email}
                    onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Website <span className="text-xs text-gray-500">(Optional)</span>
              </label>
              <div className="relative">
                <SafeIcon icon={FiGlobe} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  value={formData.author_website}
                  onChange={(e) => setFormData({ ...formData, author_website: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Comment *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Share your thoughts..."
              />
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Comments are moderated and will appear after approval.
              </p>
              
              <motion.button
                type="submit"
                disabled={submitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  submitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
                whileHover={!submitting ? { scale: 1.05 } : {}}
                whileTap={!submitting ? { scale: 0.95 } : {}}
              >
                <SafeIcon icon={FiSend} className="h-5 w-5" />
                {submitting ? 'Submitting...' : 'Post Comment'}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Comments List */}
        <div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <SafeIcon icon={FiMessageSquare} className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No comments yet</h4>
              <p className="text-gray-600">Be the first to start the discussion!</p>
            </div>
          ) : (
            <div>
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>

        {/* Comment Guidelines */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">Comment Guidelines</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be respectful and constructive in your comments</li>
            <li>• Share your experience and insights related to workplace communication</li>
            <li>• Comments are moderated to ensure quality discussion</li>
            <li>• Spam, promotional content, and inappropriate language will be removed</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default CommentSection;