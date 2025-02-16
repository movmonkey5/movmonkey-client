'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Container from '@/components/shared/Container';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import ApiKit from '@/common/ApiKit';
import Loading from '@/components/shared/Loading';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        if (!slug) return;
        const response = await ApiKit.public.blog.getPost(slug);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  if (loading) return <Loading />;
  if (!post) return <NotFound />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection post={post} />

      {/* Content Section */}
      <Container className="py-12">
        <Navigation post={post} />
        <Content post={post} />
        <RelatedTopics post={post} />
      </Container>
    </div>
  );
};

// Sub-components (HeroSection, Navigation, Content, RelatedTopics, NotFound)
// ...implementation of sub-components...

export default BlogDetailPage;
