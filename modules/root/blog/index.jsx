'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Container from '@/components/shared/Container';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        category: selectedCategory === 'All' ? '' : selectedCategory
      };
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

  return (
    <div className="bg-gray-50 py-16">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-primary mb-4">
            MovMonkey Blog
            <div className="h-1 w-20 bg-secondary mx-auto rounded-3xl mt-3"></div>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest tips, trends, and insights about moving services.
          </p>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <Loading />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.uid} className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
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
                <div className="p-6">
                  <h2 className="text-xl font-bold text-primary mb-3 line-clamp-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{post.formatted_date}</span>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-secondary hover:text-primary"
                  >
                    Read More
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-3">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                currentPage === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-secondary hover:bg-secondary/10 border border-secondary'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-10 h-10 rounded-full ${
                  currentPage === idx + 1
                    ? 'bg-secondary text-white'
                    : 'text-gray-600 hover:bg-secondary/10'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                currentPage === totalPages 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-secondary hover:bg-secondary/10 border border-secondary'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default BlogPage;
