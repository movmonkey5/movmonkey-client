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
      <div className="relative h-[50vh] w-full">
        <Image
          src={getImageUrl(post.image)}
          alt={post.title}
          fill
          className="object-cover"
          priority
          unoptimized={post.image?.startsWith('https://images.unsplash.com')}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        <Container className="relative h-full">
          <div className="absolute bottom-8 left-0 right-0 text-white">
            <span className="inline-block bg-secondary px-4 py-1 rounded-full text-sm mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-4xl">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-200">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{post.formatted_date}</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Content Section */}
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <Link 
            href="/blog"
            className="inline-flex items-center text-secondary hover:text-primary mb-8"
          >
            <ArrowLeft className="mr-2" />
            Back to Blog
          </Link>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-secondary pl-6 italic">
              {post.excerpt}
            </p>
            <div className="mt-8 text-gray-700 leading-relaxed space-y-6">
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
