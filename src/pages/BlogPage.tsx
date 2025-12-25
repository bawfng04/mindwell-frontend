import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { BLOG_POSTS } from "../services/blog";
import type { BlogCategoryDto, BlogPostListItemDto } from "../types/api";
import { api } from "../services/api";
import Seo from "../components/Seo";

function isAbortError(e: unknown) {
  return (
    (typeof e === "object" &&
      e !== null &&
      "name" in e &&
      (e as any).name === "AbortError") ||
    false
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm6.2-1.3L21 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 3v3m10-3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Zm0-14v5l3 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// function formatDateVi(dateIso: string) {
//   const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateIso);
//   if (!m) return dateIso;
//   const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
//   return new Intl.DateTimeFormat("vi-VN", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   }).format(d);
// }

function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-4 py-2 text-[12px] font-extrabold ring-1 transition-colors",
        active
          ? "bg-(--trust-blue) text-white ring-(--trust-blue)"
          : "bg-white text-(--corporate-blue) ring-(--innovation-sky)/45 hover:bg-black/5",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// function PostCard({ post }: { post: BlogPost }) {
//   return (
//     <article className="overflow-hidden rounded-3xl bg-white shadow-[0_10px_30px_rgba(27,73,101,0.12)] ring-1 ring-(--innovation-sky)/30">
//       <Link to={`/blog/${post.id}`} className="block">
//         <div className="relative aspect-video bg-(--calm-background)">
//           <img
//             src={post.imageUrl}
//             alt={post.title}
//             className="h-full w-full object-cover"
//             loading="lazy"
//           />
//           <div className="absolute left-4 top-4">
//             <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-extrabold text-(--corporate-blue) ring-1 ring-black/5">
//               {post.category}
//             </span>
//           </div>
//         </div>
//       </Link>

//       <div className="p-5">
//         <div className="flex items-center gap-4 text-[11px] font-semibold text-black/45">
//           <span className="inline-flex items-center gap-2">
//             <span className="text-(--trust-blue)/80">
//               <CalendarIcon />
//             </span>
//             {formatDateVi(post.dateIso)}
//           </span>
//           <span className="inline-flex items-center gap-2">
//             <span className="text-(--trust-blue)/80">
//               <ClockIcon />
//             </span>
//             {post.readMinutes} phút đọc
//           </span>
//         </div>

//         <h3 className="mt-3 line-clamp-2 text-[16px] font-extrabold text-(--corporate-blue)">
//           {post.title}
//         </h3>

//         <p className="mt-2 line-clamp-3 text-[12px] font-semibold leading-6 text-black/50">
//           {post.excerpt}
//         </p>

//         <div className="mt-4 flex flex-wrap gap-2">
//           {post.tags.map((t) => (
//             <span
//               key={t}
//               className="rounded-full bg-(--calm-background) px-3 py-1 text-[11px] font-semibold text-(--trust-blue) ring-1 ring-black/5"
//             >
//               {t}
//             </span>
//           ))}
//         </div>

//         <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
//           <div className="flex items-center gap-3">
//             <div className="h-9 w-9 overflow-hidden rounded-full bg-(--calm-background) ring-1 ring-black/5">
//               {post.author.avatarUrl ? (
//                 <img
//                   src={post.author.avatarUrl}
//                   alt={post.author.name}
//                   className="h-full w-full object-cover"
//                   loading="lazy"
//                 />
//               ) : null}
//             </div>
//             <div className="leading-tight">
//               <div className="text-[12px] font-extrabold text-(--corporate-blue)">
//                 {post.author.name}
//               </div>
//               <div className="text-[10px] font-semibold text-black/45">
//                 {post.author.role}
//               </div>
//             </div>
//           </div>

//           <Link
//             to={`/blog/${post.id}`}
//             className="inline-flex items-center justify-center rounded-full bg-(--calm-background) px-3 py-2 text-[12px] font-extrabold text-(--corporate-blue) ring-1 ring-black/5 hover:bg-black/5"
//             aria-label="Xem chi tiết"
//           >
//             →
//           </Link>
//         </div>
//       </div>
//     </article>
//   );
// }

function PostCard({ post }: { post: BlogPostListItemDto }) {
  const categoryLabel = post.categories?.[0]?.name ?? "Blog";

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        canonicalPath={`/blog/${post.postId}`}
        ogType="article"
      />
      <article className="overflow-hidden rounded-3xl bg-white shadow-[0_10px_30px_rgba(27,73,101,0.12)] ring-1 ring-(--innovation-sky)/30">
        <Link to={`/blog/${post.postId}`} className="block">
          <div className="relative aspect-video bg-(--calm-background)">
            {post.coverImageUrl ? (
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : null}

            <div className="absolute left-4 top-4">
              <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-extrabold text-(--corporate-blue) ring-1 ring-black/5">
                {categoryLabel}
              </span>
            </div>
          </div>
        </Link>

        <div className="p-5">
          <div className="flex items-center gap-4 text-[11px] font-semibold text-black/45">
            <span className="inline-flex items-center gap-2">
              <span className="text-(--trust-blue)/80">
                <CalendarIcon />
              </span>
              {new Date(post.publishedAt).toLocaleDateString("vi-VN")}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="text-(--trust-blue)/80">
                <ClockIcon />
              </span>
              {post.readingMinutes} phút đọc
            </span>
          </div>

          <h3 className="mt-3 line-clamp-2 text-[16px] font-extrabold text-(--corporate-blue)">
            {post.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-[12px] font-semibold leading-6 text-black/50">
            {post.excerpt}
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
            <div className="leading-tight">
              <div className="text-[12px] font-extrabold text-(--corporate-blue)">
                {post.author?.fullName ?? "—"}
              </div>
              <div className="text-[10px] font-semibold text-black/45">
                {post.author?.title ?? ""}
              </div>
            </div>

            <Link
              to={`/blog/${post.postId}`}
              className="inline-flex items-center justify-center rounded-full bg-(--calm-background) px-3 py-2 text-[12px] font-extrabold text-(--corporate-blue) ring-1 ring-black/5 hover:bg-black/5"
              aria-label="Xem chi tiết"
            >
              →
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

// export default function BlogPage() {
//   const [q, setQ] = useState("");
//   const [category, setCategory] = useState<BlogCategory>("Tất cả");

//   const categories = useMemo(() => {
//     const set = new Set(BLOG_POSTS.map((p) => p.category));
//     return ["Tất cả", ...Array.from(set)] as BlogCategory[];
//   }, []);

//   const filtered = useMemo(() => {
//     const needle = q.trim().toLowerCase();
//     return BLOG_POSTS.filter((p) => {
//       const matchQ =
//         !needle ||
//         `${p.title} ${p.excerpt} ${p.tags.join(" ")} ${p.author.name}`
//           .toLowerCase()
//           .includes(needle);
//       const matchC = category === "Tất cả" || p.category === category;
//       return matchQ && matchC;
//     });
//   }, [q, category]);

export default function BlogPage() {
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const [categories, setCategories] = useState<BlogCategoryDto[]>([]);
  const [items, setItems] = useState<BlogPostListItemDto[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // categories
  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        const res = await api.blog.listCategories({ signal: ac.signal });
        if (ac.signal.aborted) return;
        setCategories(res ?? []);
      } catch (e) {
        if (ac.signal.aborted || isAbortError(e)) return;
      }
    })();

    return () => ac.abort();
  }, []);

  // reset page when filter/search changes
  useEffect(() => {
    setPage(0);
  }, [q, categoryId]);

  // posts
  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      setErr(null);
      setLoading(true);
      try {
        const res = await api.blog.listPosts(
          {
            q: q.trim() || undefined,
            categoryId: categoryId ?? undefined,
            page,
            size: 9,
            sort: ["publishedAt,desc"],
          },
          { signal: ac.signal }
        );

        if (ac.signal.aborted) return;

        setItems(res.items ?? []);
        setTotalPages(res.totalPages ?? 1);
      } catch (e) {
        if (ac.signal.aborted || isAbortError(e)) return;
        setErr("Không tải được danh sách bài viết.");
        setItems([]);
        setTotalPages(1);
      } finally {
        if (ac.signal.aborted) return;
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [q, categoryId, page]);

  const chips = useMemo(
    () => [
      { categoryId: null as number | null, name: "Tất cả" },
      ...categories,
    ],
    [categories]
  );

  return (
    <section>
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-(--trust-blue) shadow-[0_20px_60px_rgba(27,73,101,0.25)] ring-1 ring-white/15">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.12),transparent_55%)]" />
        <div className="relative px-6 py-10 text-center md:px-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Blog Sức Khỏe Tinh Thần
          </h1>
          <p className="mt-2 text-[12px] font-semibold text-white/80">
            Kiến thức, kỹ thuật và lời khuyên từ các chuyên gia
          </p>

          <div className="mx-auto mt-5 max-w-xl">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--trust-blue)/60">
                <SearchIcon />
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="h-11 w-full rounded-2xl bg-white px-12 text-[13px] font-semibold text-(--corporate-blue) outline-none ring-1 ring-white/40 placeholder:text-black/35"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chips */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {chips.map((c) => (
          <Chip
            key={c.categoryId ?? "all"}
            active={(c.categoryId ?? null) === categoryId}
            onClick={() => setCategoryId(c.categoryId ?? null)}
          >
            {c.name}
          </Chip>
        ))}
      </div>

      {err ? (
        <div className="mt-6 rounded-2xl bg-white p-4 text-[12px] font-semibold text-red-700 ring-1 ring-red-200">
          {err}
        </div>
      ) : null}

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((p) => (
          <PostCard key={p.postId} post={p} />
        ))}
      </div>

      {/* Paging */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          disabled={loading || page <= 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="rounded-full bg-white px-4 py-2 text-[12px] font-extrabold text-(--corporate-blue) ring-1 ring-black/5 disabled:opacity-50"
        >
          ← Trước
        </button>
        <div className="text-[12px] font-semibold text-black/55">
          Trang {page + 1} / {totalPages}
        </div>
        <button
          type="button"
          disabled={loading || page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-full bg-white px-4 py-2 text-[12px] font-extrabold text-(--corporate-blue) ring-1 ring-black/5 disabled:opacity-50"
        >
          Sau →
        </button>
      </div>
    </section>
  );
}
