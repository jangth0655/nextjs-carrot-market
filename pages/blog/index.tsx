import Layout from "@components/layout";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";
import Link from "next/link";

interface Post {
  title: string;
  date: string;
  category: string;
  slug: string;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
  return (
    <Layout title="Blog" seoTitle="Blog">
      <h1 className="font-semibold text-lg">Latest Posts</h1>
      {posts.map((post, i) => (
        <div className="mb-10 p-4 text-center" key={i}>
          <Link href={`/blog/${post.slug}`}>
            <a>
              <span className="text-lg text-red-400">{post.title}</span>
              <div>
                <span>
                  {post.date} / {post.category}
                </span>
              </div>
            </a>
          </Link>
        </div>
      ))}
    </Layout>
  );
};

export default Blog;

export async function getStaticProps() {
  const blogPosts = readdirSync("./posts").map((file) => {
    const content = readFileSync(`./posts/${file}`, "utf-8");
    const [slug, _] = file.split(".");
    return { ...matter(content).data, slug };
  });

  return {
    props: {
      posts: blogPosts,
    },
  };
}

//getStaticProps => 원하는 데이터를 빌드하면서 정적으로 나타낼 수 있다.
// 페이지가 빌드되기전에 데이터를 넣고 싶을 때
