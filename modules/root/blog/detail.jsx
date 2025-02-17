'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Container from '@/components/shared/Container';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ApiKit from '@/common/ApiKit';
import Loading from '@/components/shared/Loading';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    const fetchPost = async () => {
      try {
        const response = await ApiKit.public.blog.getPost(slug);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder-image.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`;
  };

  if (loading) return <Loading />;
  if (!post) return (
    <Container>
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-gray-900">Blog post not found</h1>
        <Link href="/blog" className="mt-4 inline-flex items-center text-secondary hover:text-primary">
          <ArrowLeft className="mr-2" />
          Back to Blog
        </Link>
      </div>
    </Container>
  );

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[50vh] w-full">
        <Image
          src={getImageUrl(post.image)}
          alt={post.title}
          fill
          className="object-cover"
          priority
          unoptimized={post.image?.startsWith('https://images.unsplash.com')}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
        <Container className="relative h-full">
          <div className="absolute bottom-6 md:bottom-8 w-full max-w-4xl mx-auto left-0 right-0 px-4 md:px-0">
            <div className="flex flex-col space-y-3 md:space-y-4">
              <span className="inline-block bg-secondary px-3 py-1 md:px-4 md:py-1 rounded-full text-xs md:text-sm text-white w-fit">
                {post.category}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-200 text-sm md:text-base">
                <Calendar size={16} className="md:w-[18px] md:h-[18px]" />
                <span>{post.formatted_date}</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Content Section */}
      <Container className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-0">
          {/* Back Navigation */}
          <Link 
            href="/blog"
            className="inline-flex items-center text-secondary hover:text-primary mb-6 md:mb-8 text-sm md:text-base"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Blog
          </Link>

          {/* Article Content */}
          <article className="prose prose-base md:prose-lg max-w-none">
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed border-l-4 border-secondary pl-4 md:pl-6 italic">
              {post.excerpt}
            </p>
            <div className="mt-6 md:mt-8 text-gray-700 leading-relaxed space-y-4 md:space-y-6">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
      </Container>
    </div>
  );
};

export default BlogDetailPage;