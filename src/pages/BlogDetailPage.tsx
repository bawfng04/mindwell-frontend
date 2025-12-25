import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "../services/api";
import type { BlogPostDetailDto, BlogPostListItemDto } from "../types/api";
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

// function buildSections(post: BlogPost) {
//   // todo: Gọi API
//   // mockdata:
//   return [
//     {
//       h: "Tóm tắt nhanh",
//       p: [
//         post.excerpt,
//         "Bài viết này cung cấp góc nhìn thực tế và các bước áp dụng đơn giản. Bạn có thể thử ngay trong ngày để cảm nhận hiệu quả.",
//       ],
//     },
//     {
//       h: "Dấu hiệu thường gặp",
//       p: [
//         "Bạn dễ mất tập trung, khó thư giãn hoặc suy nghĩ lặp đi lặp lại.",
//         "Cơ thể mệt mỏi dù ngủ đủ, hoặc giấc ngủ không sâu.",
//         "Cảm xúc lên xuống nhanh, dễ cáu gắt hoặc nhạy cảm hơn bình thường.",
//       ],
//     },
//     {
//       h: "Cách áp dụng (gợi ý)",
//       p: [
//         "Chọn 1–2 thói quen nhỏ, làm đều trong 7 ngày để tạo nhịp ổn định.",
//         "Ghi chú nhanh (1 phút) về cảm xúc/điều gây căng thẳng để nhận diện “trigger”.",
//         "Nếu tình trạng kéo dài hoặc ảnh hưởng mạnh tới sinh hoạt, bạn nên cân nhắc trao đổi với chuyên gia.",
//       ],
//     },
//     {
//       h: "Lời khuyên cuối",
//       p: [
//         "Không cần làm hoàn hảo. Chỉ cần bắt đầu nhỏ và duy trì đều.",
//         "Hãy ưu tiên an toàn, nghỉ ngơi và hỗ trợ xã hội (người thân, bạn bè, chuyên gia).",
//       ],
//     },
//   ];
// }

export default function BlogDetailPage() {
  const params = useParams<{ id?: string; postId?: string }>();

  const id = useMemo(() => {
    const raw = params.postId ?? params.id;
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) ? n : null;
  }, [params.id, params.postId]);

  const [post, setPost] = useState<BlogPostDetailDto | null>(null);
  const [related, setRelated] = useState<BlogPostListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setLoading(false);
      setErr("Bài viết không hợp lệ.");
      return;
    }

    const ac = new AbortController();

    (async () => {
      setErr(null);
      setLoading(true);
      try {
        const [detail, rel] = await Promise.all([
          api.blog.getPostDetail(id, { signal: ac.signal }),
          api.blog.listRelated(id, { limit: 3 }, { signal: ac.signal }),
        ]);

        if (ac.signal.aborted) return;

        setPost(detail);
        setRelated(rel ?? []);
      } catch (e) {
        if (ac.signal.aborted || isAbortError(e)) return;
        setErr("Không tải được bài viết.");
        setPost(null);
        setRelated([]);
      } finally {
        if (ac.signal.aborted) return;
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <div className="text-[13px] font-semibold text-black/55">
          Đang tải bài viết...
        </div>
      </div>
    );
  }

  if (err || !post) {
    return (
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <div className="text-lg font-extrabold text-[color:var(--corporate-blue)]">
          {err ?? "Không tìm thấy bài viết"}
        </div>
        <Link
          to="/blog"
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--innovation-sky)]/45 bg-white px-4 py-2 text-[12px] font-semibold text-[color:var(--corporate-blue)] hover:bg-black/5"
        >
          ← Quay lại Blog
        </Link>
      </div>
    );
  }

  const categoryLabel = post.categories?.[0]?.name ?? "Blog";

  return (
    <>
      <Seo
        title={post.title}
        description={post.content.slice(0, 160)}
        canonicalPath={`/blog/${post.postId}`}
        ogType="article"
      />
      <article className="space-y-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--innovation-sky)]/45 bg-white px-4 py-2 text-[12px] font-semibold text-[color:var(--corporate-blue)] hover:bg-black/5"
        >
          ← Quay lại
        </Link>

        {/* Hero */}
        <header className="overflow-hidden rounded-3xl bg-white shadow-[0_10px_30px_rgba(27,73,101,0.12)] ring-1 ring-[color:var(--innovation-sky)]/30">
          <div className="relative aspect-[16/7] bg-[color:var(--calm-background)]">
            {post.coverImageUrl ? (
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute left-5 top-5">
              <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-extrabold text-[color:var(--corporate-blue)] ring-1 ring-black/5">
                {categoryLabel}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-7">
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-black/45">
              <span className="inline-flex items-center gap-2">
                <span className="text-[color:var(--trust-blue)]/80">
                  <CalendarIcon />
                </span>
                {new Date(post.publishedAt).toLocaleDateString("vi-VN")}
              </span>

              <span className="inline-flex items-center gap-2">
                <span className="text-[color:var(--trust-blue)]/80">
                  <ClockIcon />
                </span>
                {post.readingMinutes} phút đọc
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold text-[color:var(--corporate-blue)] md:text-3xl">
              {post.title}
            </h1>

            <div className="mt-5 border-t border-black/5 pt-5">
              <div className="text-[12px] font-extrabold text-[color:var(--corporate-blue)]">
                {post.author?.fullName ?? "—"}
              </div>
              <div className="text-[11px] font-semibold text-black/45">
                {post.author?.title ?? ""}
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* Content */}
          <section className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(27,73,101,0.10)] ring-1 ring-[color:var(--innovation-sky)]/30 md:p-7">
            {post.contentFormat === "markdown" ? (
              <div className="space-y-4 text-[13px] font-semibold leading-7 text-black/60">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-[13px] font-semibold leading-7 text-black/60">
                {post.content}
              </div>
            )}
          </section>

          {/* Related */}
          <aside className="h-fit rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(27,73,101,0.10)] ring-1 ring-[color:var(--innovation-sky)]/30 lg:sticky lg:top-20">
            <div className="text-[13px] font-extrabold text-[color:var(--corporate-blue)]">
              Bài viết liên quan
            </div>

            <div className="mt-4 space-y-3">
              {related.length === 0 ? (
                <div className="text-[12px] font-semibold text-black/55">
                  Không có bài viết liên quan.
                </div>
              ) : (
                related.map((r) => (
                  <Link
                    key={r.postId}
                    to={`/blog/${r.postId}`}
                    className="block rounded-2xl bg-[color:var(--calm-background)] p-4 ring-1 ring-black/5 hover:bg-black/5"
                  >
                    <div className="text-[12px] font-extrabold text-[color:var(--corporate-blue)] line-clamp-2">
                      {r.title}
                    </div>
                    <div className="mt-2 text-[11px] font-semibold text-black/50 line-clamp-2">
                      {r.excerpt}
                    </div>
                  </Link>
                ))
              )}
            </div>

            <Link
              to="/chuyen-gia"
              className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-[color:var(--trust-blue)] px-4 py-3 text-[12px] font-extrabold text-white hover:brightness-95 active:brightness-90"
            >
              Xem danh sách chuyên gia
            </Link>
          </aside>
        </div>
      </article>
    </>
  );
}
