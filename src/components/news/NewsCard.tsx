// src/components/news/NewsCard.tsx
import Link from "next/link";
import type { PostListItem } from "@/lib/queries/posts";
import { timeAgo, formatNumber, getCategoryBadge } from "@/lib/utils";
import { SmartImage } from "@/components/ui/SmartImage";

type Props = {
  post: PostListItem;
  variant?: "default" | "horizontal";
};

export function NewsCard({ post, variant = "default" }: Props) {
  if (variant === "horizontal") {
    return (
      <Link href={`/berita/${post.slug}`} className="news-card-h">
        {/* Thumbnail — tampilkan gambar jika ada */}
        <div className="news-card-h-thumb">
          {post.featuredImage ? (
            <SmartImage
              src={post.featuredImage}
              alt={post.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          )}
        </div>

        <div className="news-card-h-body">
          <span
            className={`badge ${getCategoryBadge(post.category?.slug)}`}
            style={{ marginBottom: "6px", display: "inline-flex" }}
          >
            {post.category?.name ?? "Berita"}
          </span>
          <div className="news-card-h-title">{post.title}</div>
          <div className="news-card-h-meta">
            <span>{timeAgo(post.publishedAt)}</span>
            <span className="news-meta-sep" />
            <span>{formatNumber(post.viewCount)} dibaca</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/berita/${post.slug}`} className="news-card">
      {/* Gambar */}
      <div className="news-card-img">
        {post.featuredImage ? (
          <SmartImage
            src={post.featuredImage}
            alt={post.title}
            className="news-card-img-actual"
          />
        ) : (
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{ color: "var(--color-ink-5)" }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )}
        <span className="news-card-cat-float">
          {post.category?.name ?? "Berita"}
        </span>
      </div>
      {/* Body */}
      <div className="news-card-body">
        <span className={`badge ${getCategoryBadge(post.category?.slug)}`}>
          {post.category?.name ?? "Berita"}
        </span>
        <h3 className="news-card-title">{post.title}</h3>
        {post.excerpt && <p className="news-card-excerpt">{post.excerpt}</p>}
        <div className="news-card-meta">
          <span className="news-meta-time">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {timeAgo(post.publishedAt)}
          </span>
          <span className="news-meta-sep" />
          <span className="news-meta-time">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {formatNumber(post.viewCount)}
          </span>
        </div>
      </div>
    </Link>
  );
}
