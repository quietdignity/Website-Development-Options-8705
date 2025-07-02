import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiMessageSquare, FiCheck, FiX, FiEye, FiTrash2, FiAlertOctagon, FiClock, FiUser, FiMail, FiGlobe } = FiIcons;

function CommentAdmin() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedComment, setSelectedComment] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_comments_wm2025')
        .select(`
          *,
          blog_posts_wm2025!inner(title, slug)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCommentStatus = async (commentId, newStatus) => {
    try {
      const { error } = await supabase
        .from('blog_comments_wm2025')
        .update({ status: newStatus })
        .eq('id', commentId);

      if (error) throw error;

      // Update local state
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, status: newStatus }
          : comment
      ));

      // If approving a comment, send notification to commenter
      if (newStatus === 'approved') {
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
          try {
            await fetch(`https://sdfnpskccbvilzpcpzzo.supabase.co/functions/v1/send-comment-notification`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkZm5wc2tjY2J2aWx6cGNwenpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNzUyNjEsImV4cCI6MjA2Njc1MTI2MX0.dkIxMqlYhxNNWbYhiDjelZnLzpdl0OIU84T51hHCXis`
              },
              body: JSON.stringify({
                type: 'approval',
                comment,
                postTitle: comment.blog_posts_wm2025?.title
              })
            });
          } catch (emailError) {
            console.warn('Failed to send approval notification:', emailError);
          }
        }
      }
    } catch (error) {
      console.error('Error updating comment status:', error);
    }
  };

  const deleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const { error } = await supabase
        .from('blog_comments_wm2025')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const filteredComments = comments.filter(comment => {
    if (filter === 'all') return true;
    return comment.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'spam': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return FiCheck;
      case 'pending': return FiClock;
      case 'spam': return FiAlertOctagon;
      case 'rejected': return FiX;
      default: return FiMessageSquare;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Comment Moderation</h2>
          <p className="text-gray-600">Manage and moderate blog comments</p>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'spam', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filter === status 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status} ({comments.filter(c => status === 'all' || c.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <SafeIcon icon={FiMessageSquare} className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No comments found</h3>
            <p className="text-gray-600">
              {filter === 'all' ? 'No comments have been submitted yet.' : `No ${filter} comments.`}
            </p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <motion.div
              key={comment.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* Comment Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiUser} className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{comment.author_name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <SafeIcon icon={FiMail} className="h-3 w-3" />
                          {comment.author_email}
                        </span>
                        {comment.author_website && (
                          <span className="flex items-center gap-1">
                            <SafeIcon icon={FiGlobe} className="h-3 w-3" />
                            <a 
                              href={comment.author_website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Website
                            </a>
                          </span>
                        )}
                        <span>{formatDate(comment.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Reference */}
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Post:</strong> {comment.blog_posts_wm2025?.title}
                      {comment.parent_id && (
                        <span className="ml-2 text-blue-600">(Reply to comment)</span>
                      )}
                    </p>
                  </div>

                  {/* Comment Content */}
                  <div className="prose prose-sm max-w-none mb-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="ml-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(comment.status)}`}>
                    <SafeIcon icon={getStatusIcon(comment.status)} className="h-3 w-3" />
                    {comment.status}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                {comment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateCommentStatus(comment.id, 'approved')}
                      className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <SafeIcon icon={FiCheck} className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => updateCommentStatus(comment.id, 'spam')}
                      className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <SafeIcon icon={FiAlertOctagon} className="h-4 w-4" />
                      Mark as Spam
                    </button>
                    <button
                      onClick={() => updateCommentStatus(comment.id, 'rejected')}
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <SafeIcon icon={FiX} className="h-4 w-4" />
                      Reject
                    </button>
                  </>
                )}

                {comment.status === 'approved' && (
                  <button
                    onClick={() => updateCommentStatus(comment.id, 'pending')}
                    className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <SafeIcon icon={FiClock} className="h-4 w-4" />
                    Move to Pending
                  </button>
                )}

                {comment.status === 'spam' && (
                  <button
                    onClick={() => updateCommentStatus(comment.id, 'pending')}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <SafeIcon icon={FiCheck} className="h-4 w-4" />
                    Not Spam
                  </button>
                )}

                <button
                  onClick={() => setSelectedComment(comment)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <SafeIcon icon={FiEye} className="h-4 w-4" />
                  View Details
                </button>

                <button
                  onClick={() => deleteComment(comment.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Comment Detail Modal */}
      {selectedComment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Comment Details</h3>
              <button
                onClick={() => setSelectedComment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={FiX} className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-lg text-gray-900">{selectedComment.author_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-lg text-gray-900">{selectedComment.author_email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <p className="text-lg text-gray-900">{selectedComment.author_website || 'None'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedComment.status)}`}>
                    <SafeIcon icon={getStatusIcon(selectedComment.status)} className="h-4 w-4" />
                    {selectedComment.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="text-lg text-gray-900">{formatDate(selectedComment.created_at)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Post</label>
                  <p className="text-lg text-gray-900">{selectedComment.blog_posts_wm2025?.title}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedComment.content}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default CommentAdmin;