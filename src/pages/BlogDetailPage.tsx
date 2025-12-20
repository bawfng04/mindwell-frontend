import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { BLOG_POSTS } from "../services/blog";
import type { BlogPost } from "../types/blog";

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

function formatDateVi(dateIso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateIso);
  if (!m) return dateIso;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

function buildSections(post: BlogPost) {
  // todo: Gọi API
  // mockdata:
  return [
    {
      h: "Tóm tắt nhanh",
      p: [
        post.excerpt,
        "Bài viết này cung cấp góc nhìn thực tế và các bước áp dụng đơn giản. Bạn có thể thử ngay trong ngày để cảm nhận hiệu quả.",
      ],
    },
    {
      h: "Dấu hiệu thường gặp",
      p: [
        "Bạn dễ mất tập trung, khó thư giãn hoặc suy nghĩ lặp đi lặp lại.",
        "Cơ thể mệt mỏi dù ngủ đủ, hoặc giấc ngủ không sâu.",
        "Cảm xúc lên xuống nhanh, dễ cáu gắt hoặc nhạy cảm hơn bình thường.",
      ],
    },
    {
      h: "Cách áp dụng (gợi ý)",
      p: [
        "Chọn 1–2 thói quen nhỏ, làm đều trong 7 ngày để tạo nhịp ổn định.",
        "Ghi chú nhanh (1 phút) về cảm xúc/điều gây căng thẳng để nhận diện “trigger”.",
        "Nếu tình trạng kéo dài hoặc ảnh hưởng mạnh tới sinh hoạt, bạn nên cân nhắc trao đổi với chuyên gia.",
      ],
    },
    {
      h: "Lời khuyên cuối",
      p: [
        "Không cần làm hoàn hảo. Chỉ cần bắt đầu nhỏ và duy trì đều.",
        "Hãy ưu tiên an toàn, nghỉ ngơi và hỗ trợ xã hội (người thân, bạn bè, chuyên gia).",
      ],
    },
  ];
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const post = useMemo(() => BLOG_POSTS.find((p) => p.id === id), [id]);

  if (!post) {
    return (
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <div className="text-lg font-extrabold text-[color:var(--corporate-blue)]">
          Không tìm thấy bài viết
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

  const sections = buildSections(post);

  return (
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
          <img
            src={post.imageUrl}
            alt={post.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute left-5 top-5">
            <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-extrabold text-[color:var(--corporate-blue)] ring-1 ring-black/5">
              {post.category}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-7">
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-black/45">
            <span className="inline-flex items-center gap-2">
              <span className="text-[color:var(--trust-blue)]/80">
                <CalendarIcon />
              </span>
              {formatDateVi(post.dateIso)}
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="text-[color:var(--trust-blue)]/80">
                <ClockIcon />
              </span>
              {post.readMinutes} phút đọc
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold text-[color:var(--corporate-blue)] md:text-3xl">
            {post.title}
          </h1>

          <p className="mt-3 max-w-3xl text-[13px] font-semibold leading-7 text-black/55">
            {post.excerpt}
          </p>

          {/* Author */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-[color:var(--calm-background)] ring-1 ring-black/5">
                {post.author.avatarUrl ? (
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div className="leading-tight">
                <div className="text-[12px] font-extrabold text-[color:var(--corporate-blue)]">
                  {post.author.name}
                </div>
                <div className="text-[11px] font-semibold text-black/45">
                  {post.author.role}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-[color:var(--calm-background)] px-3 py-1 text-[11px] font-semibold text-[color:var(--trust-blue)] ring-1 ring-black/5"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(27,73,101,0.10)] ring-1 ring-[color:var(--innovation-sky)]/30 md:p-7">
          <div className="space-y-7">
            {sections.map((s) => (
              <div key={s.h}>
                <h2 className="text-[16px] font-extrabold text-[color:var(--corporate-blue)]">
                  {s.h}
                </h2>
                <div className="mt-3 space-y-3 text-[13px] font-semibold leading-7 text-black/55">
                  {s.p.map((x, i) => (
                    <p key={i}>{x}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right sidebar */}
        <aside className="h-fit rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(27,73,101,0.10)] ring-1 ring-[color:var(--innovation-sky)]/30 lg:sticky lg:top-20">
          <div className="text-[13px] font-extrabold text-[color:var(--corporate-blue)]">
            Mục lục
          </div>
          <ul className="mt-3 space-y-2 text-[12px] font-semibold text-black/55">
            {sections.map((s) => (
              <li key={s.h} className="flex items-start gap-2">
                <span className="mt-[6px] h-2 w-2 rounded-full bg-[color:var(--innovation-sky)]" />
                <span>{s.h}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-2xl bg-[color:var(--calm-background)] p-4 ring-1 ring-black/5">
            <div className="text-[12px] font-extrabold text-[color:var(--corporate-blue)]">
              Gợi ý
            </div>
            <div className="mt-2 text-[12px] font-semibold leading-6 text-black/55">
              Nếu bạn muốn trao đổi sâu hơn, hãy đặt lịch tư vấn với chuyên gia
              phù hợp.
            </div>
          </div>

          <Link
            to="/chuyen-gia"
            className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-[color:var(--trust-blue)] px-4 py-3 text-[12px] font-extrabold text-white hover:brightness-95 active:brightness-90"
          >
            Xem danh sách chuyên gia
          </Link>
        </aside>
      </div>
    </article>
  );
}
