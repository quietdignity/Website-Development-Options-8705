import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiCalendar, FiClock, FiTag, FiUser, FiArrowRight, FiSearch, FiFilter, FiEye, FiHeart } = FiIcons;

function Blog() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredPost, setFeaturedPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    try {
      // Fetch published posts
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts_wm2025')
        .select(`
          *,
          blog_post_categories_wm2025!inner(
            blog_categories_wm2025(name, slug, color)
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('blog_categories_wm2025')
        .select('*')
        .order('name');

      if (!postsError && postsData) {
        setPosts(postsData);
        setFeaturedPost(postsData.find(post => post.featured) || postsData[0]);
      }

      if (!categoriesError && categoriesData) {
        setCategories(categoriesData);
      }
    } catch (error) {
      console.log('Blog fetch error:', error);
      // Fallback to demo data
      setPosts(mockPosts);
      setCategories(mockCategories);
      setFeaturedPost(mockPosts[0]);
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const mockCategories = [
    { id: '1', name: 'Communication Strategy', slug: 'communication-strategy', color: '#2563eb' },
    { id: '2', name: 'Frontline Workers', slug: 'frontline-workers', color: '#059669' },
    { id: '3', name: 'Case Studies', slug: 'case-studies', color: '#7c3aed' },
    { id: '4', name: 'Industry Insights', slug: 'industry-insights', color: '#dc2626' }
  ];

  const mockPosts = [
    {
      id: '1',
      title: 'Why Factory Floor Workers Miss Critical Safety Updates',
      slug: 'factory-floor-workers-miss-safety-updates',
      excerpt: 'A deep dive into how safety communications fail to reach frontline manufacturing workers and what you can do about it.',
      featured_image: 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751386112924-IMG_4231.jpg',
      author_name: 'James A. Brown',
      tags: ['safety', 'manufacturing', 'frontline workers'],
      read_time: 8,
      view_count: 1250,
      published_at: '2025-01-25T10:00:00Z',
      featured: true,
      blog_post_categories_wm2025: [{ blog_categories_wm2025: mockCategories[1] }]
    },
    {
      id: '2',
      title: 'The Hidden Communication Networks in Your Organization',
      slug: 'hidden-communication-networks-organization',
      excerpt: 'Every organization has unofficial communication channels. Here\'s how to identify and leverage them for better information flow.',
      featured_image: 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751386118747-blob',
      author_name: 'James A. Brown',
      tags: ['informal networks', 'organizational communication'],
      read_time: 12,
      view_count: 890,
      published_at: '2025-01-22T14:30:00Z',
      featured: false,
      blog_post_categories_wm2025: [{ blog_categories_wm2025: mockCategories[0] }]
    },
    {
      id: '3',
      title: 'Crisis Communication for Distributed Teams: Lessons from the Pandemic',
      slug: 'crisis-communication-distributed-teams-pandemic',
      excerpt: 'How the pandemic taught us new ways to communicate with distributed workforces during critical situations.',
      featured_image: 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751386140488-IMG_5606.jpg',
      author_name: 'James A. Brown',
      tags: ['crisis communication', 'distributed teams', 'pandemic lessons'],
      read_time: 15,
      view_count: 2100,
      published_at: '2025-01-20T09:15:00Z',
      featured: false,
      blog_post_categories_wm2025: [{ blog_categories_wm2025: mockCategories[2] }]
    }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || 
      post.blog_post_categories_wm2025?.some(pc => 
        pc.blog_categories_wm2025.slug === selectedCategory
      );
    
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

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

  const handlePostClick = (post) => {
    navigate(`/blog/${post.slug}`);
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-gray-50" ref={ref}>
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-8"
          >
            Communication Insights & Strategies
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto"
          >
            Expert insights on workplace communication, distributed teams, and building systems that reach everyone who needs them.
          </motion.p>

          {/* Featured Post */}
          {featuredPost && (
            <motion.div
              variants={itemVariants}
              className="mb-16"
            >
              <div 
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={() => handlePostClick(featuredPost)}
              >
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src={featuredPost.featured_image}
                      alt={featuredPost.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                      {getPostCategory(featuredPost) && (
                        <span
                          className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                          style={{ backgroundColor: getPostCategory(featuredPost).color }}
                        >
                          {getPostCategory(featuredPost).name}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {featuredPost.title}
                    </h3>
                    
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <SafeIcon icon={FiUser} className="h-4 w-4" />
                          {featuredPost.author_name}
                        </div>
                        <div className="flex items-center gap-1">
                          <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                          {formatDate(featuredPost.published_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <SafeIcon icon={FiClock} className="h-4 w-4" />
                          {featuredPost.read_time} min read
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <SafeIcon icon={FiEye} className="h-4 w-4" />
                        {featuredPost.view_count?.toLocaleString()} views
                      </div>
                    </div>
                    
                    <motion.button
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 w-fit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Read Full Article
                      <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Search and Filters */}
          <motion.div
            variants={itemVariants}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-blue-50'
                  }`}
                >
                  All Articles
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category.slug
                        ? 'text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                    style={{
                      backgroundColor: selectedCategory === category.slug ? category.color : undefined
                    }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.filter(post => post.id !== featuredPost?.id).map((post) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => handlePostClick(post)}
                whileHover={{ y: -5 }}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  {getPostCategory(post) && (
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white mb-3"
                      style={{ backgroundColor: getPostCategory(post).color }}
                    >
                      {getPostCategory(post).name}
                    </span>
                  )}
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                        {formatDate(post.published_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <SafeIcon icon={FiClock} className="h-4 w-4" />
                        {post.read_time} min
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <SafeIcon icon={FiEye} className="h-4 w-4" />
                      {post.view_count?.toLocaleString()}
                    </div>
                  </div>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <motion.div
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center gap-2"
                    whileHover={{ x: 5 }}
                  >
                    Read More
                    <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
                  </motion.div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-12"
            >
              <SafeIcon icon={FiSearch} className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? `No articles match "${searchTerm}".` : 'No articles in this category.'}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Show All Articles
              </button>
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div
            variants={itemVariants}
            className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Improve Your Communication?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              These insights are just the beginning. Get a custom communication diagnostic for your organization and discover where your critical messages are getting lost.
            </p>
            <motion.button
              onClick={scrollToContact}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Your 20-Day Diagnostic
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Blog;