import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";
import type { CaseStudyFrontmatter } from "@/components/CaseStudy";
import { mdxComponents } from "@/components/MDXComponents";

const CASE_STUDIES_DIR = path.join(process.cwd(), "src/data/case-studies");

// ── Helpers ──────────────────────────────────────────────────────────

function readCaseStudy(slug: string): string | null {
  const filePath = path.join(CASE_STUDIES_DIR, `${slug}.mdx`);
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

/**
 * Extract h2/h3 headings from raw MDX source for the sidebar ToC.
 *
 * IDs are generated with the same algorithm rehype-slug uses
 * (lowercase, replace non-alphanumerics with hyphens, strip edges).
 */
function extractHeadings(source: string) {
  const headings: { id: string; text: string; level: number }[] = [];
  const regex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(source))) {
    const level = match[1].length;
    const text = match[2];
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    headings.push({ id, text, level });
  }
  return headings;
}

// ── Static generation ────────────────────────────────────────────────

export function generateStaticParams() {
  try {
    return fs
      .readdirSync(CASE_STUDIES_DIR)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => ({ slug: f.replace(".mdx", "") }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const source = readCaseStudy(slug);
  if (!source) return { title: "Not Found" };

  const { data } = matter(source);
  return {
    title: `${data.title} — Jak`,
    description: data.summary as string,
  };
}

// ── Page ─────────────────────────────────────────────────────────────

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const source = readCaseStudy(slug);
  if (!source) notFound();

  const { content, data } = matter(source);
  const headings = extractHeadings(content);

  return (
    <CaseStudy
      frontmatter={data as CaseStudyFrontmatter}
      headings={headings}
    >
      <MDXRemote
        source={content}
        components={mdxComponents}
        options={{
          mdxOptions: {
            rehypePlugins: [rehypeSlug],
          },
        }}
      />
    </CaseStudy>
  );
}
