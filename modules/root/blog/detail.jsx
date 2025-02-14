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

  if (loading) return <Loading />;
  if (!post) return (
    <Container>
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-gray-900">Blog post not found</h1>
        <Link href="/blog" className="mt-4 inline-flex items-center text-secondary">
          <ArrowLeft className="mr-2" />
          Back to Blog
        </Link>
      </div>
    </Container>
  );

  return (
    <div className="bg-gray-50">
      <div className="relative h-[50vh]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
          unoptimized={post.image?.startsWith('https://images.unsplash.com')}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        <Container className="relative h-full">
          <div className="absolute bottom-8 text-white">
            <span className="inline-block bg-secondary px-4 py-1 rounded-full text-sm mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{post.formatted_date}</span>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <Link 
          href="/blog"
          className="inline-flex items-center text-secondary hover:text-primary mb-8"
        >
          <ArrowLeft className="mr-2" />
          Back to Blog
        </Link>

        <article className="prose prose-lg max-w-4xl mx-auto">
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="mt-8 text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </article>
      </Container>
    </div>
  );
};

export default BlogDetailPage;
