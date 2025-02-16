'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Container from '@/components/shared/Container';
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ApiKit from '@/common/ApiKit';
import Loading from '@/components/shared/Loading';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  console.log('posts', posts);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        category: selectedCategory === 'All' ? '' : selectedCategory
      };
      
      console.log('Fetching with params:', params); // Debug log
      const response = await ApiKit.public.blog.getPosts(params);
      
      if (response?.data?.results) {
        setPosts(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 6));
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ApiKit.public.blog.getPosts({ page_size: 100 });
        if (response?.data?.results) {
          const uniqueCategories = ['All', ...new Set(response.data.results.map(post => post.category))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const getImageUrl = (imageUrl) => {
    // Handle null, undefined or empty image URLs
    if (!imageUrl) {
      return '/placeholder-image.jpg'; // Add a default placeholder image in your public folder
    }
    // If it's already an absolute URL (starts with http or https), return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // Otherwise, append the backend URL
    return `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`;
  };

  return (
    <div className="bg-gray-50 py-16">
      <Container>
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-primary mb-4">
            MovMonkey Blog
            <div className='h-1 w-20 bg-secondary mx-auto rounded-3xl mt-3'></div>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest tips, trends, and insights about moving, cleaning, and delivery services.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-secondary text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-secondary/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading and Content Section */}
        {loading ? (
          <Loading />
        ) : (
          <>
            {posts.length === 0 ? (
              <div className="text-center text-gray-600 py-12">
                No blog posts found.
              </div>
            ) : (
              <>
                {/* Blog Posts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post) => (
                    <div 
                      key={post.uid}
                      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      {/* Image Container */}
                      <div className="relative h-48 w-full">
                        <Image
                          src={getImageUrl(post.image)}
                          alt={post.title || 'Blog post image'}
                          fill
                          className="object-cover"
                          unoptimized={post.image?.startsWith('https://images.unsplash.com')}
                        />
                        <div className="absolute top-4 right-4">
                          <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Content Container */}
                      <div className="p-6">
                        <h2 className="text-xl font-bold text-primary mb-3 line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Meta Information */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <User size={16} />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{post.formatted_date}</span>
                          </div>
                        </div>

                        {/* Read More Link */}
                        <Link 
                          href={`/blog/${encodeURIComponent(post.slug)}`}
                          className="inline-flex items-center text-secondary hover:text-primary transition-colors duration-200"
                        >
                          Read More 
                          <ArrowRight size={16} className="ml-2" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-3">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                        currentPage === 1 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-secondary hover:bg-secondary/10 border border-secondary'
                      }`}
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, idx) => (
                      <button
                        key={idx + 1}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                          currentPage === idx + 1
                            ? 'bg-secondary text-white scale-110 shadow-lg'
                            : 'text-gray-600 hover:bg-secondary/10 border border-gray-200'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                        currentPage === totalPages 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-secondary hover:bg-secondary/10 border border-secondary'
                      }`}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default BlogPage;
