import BlogPost1 from "@/blogs/BlogPost1";
import BlogPost2 from "@/blogs/BlogPost2";
import { blogPosts } from "@/data/BlogData";
import NotFound from "@/app/not-found";

const blogComponents = {
  BlogPost1,
  BlogPost2,
};

const Page = ({ params }: { params: { slug: string } }) => {
  const post = blogPosts.find((post) => post.slug === params.slug);

  if (!post) {
    return <NotFound />;
  }

  // Get the component to render based on the post id
  const ComponentToRender = blogComponents[`BlogPost${post.id}` as keyof typeof blogComponents];

  if (!ComponentToRender) {
    return <NotFound />;
  }

  return <ComponentToRender />;
};

export const generateMetadata = async ({ params }: { params: { slug: string } }) => {
    const post = blogPosts.find((post) => post.slug === params.slug);
    if (!post) {
      return {
        title: "Not Found | GitDocs AI",
        description: "Page not found",
      };
    }
    return {
      title: `${post.title} | GitDocs AI`,
      description: post.excerpt,
    };
  };

export default Page;
