import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EXPERTS } from "../services/experts";
import type { Expert } from "../types/expert";

function formatVnd(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

function formatDateVi(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(date);
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}
function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.9 6.1 20l1.2-6.5L2.5 8.9 9.1 8 12 2z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--calm-background)] px-3 py-1 text-[12px] font-semibold text-[color:var(--corporate-blue)] ring-1 ring-[color:var(--innovation-sky)]/45">
      <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--innovation-sky)]" />
      Đã xác minh
    </span>
  );
}

function Avatar({ expert }: { expert: Expert }) {
  if (expert.avatarUrl) {
    return (
      <img
        src={expert.avatarUrl}
        alt={`${expert.degreePrefix ?? ""} ${expert.name}`}
        className="h-24 w-24 rounded-2xl object-cover ring-1 ring-black/5"
      />
    );
  }
  const parts = expert.name.trim().split(/\s+/);
  const initials = (
    (parts[0]?.[0] ?? "") + (parts.at(-1)?.[0] ?? "")
  ).toUpperCase();
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[color:var(--calm-background)] text-2xl font-bold text-[color:var(--corporate-blue)] ring-1 ring-black/5">
      {initials}
    </div>
  );
}

function CalendarBookingCard({ expert }: { expert: Expert }) {
  const [monthCursor, setMonthCursor] = useState(() =>
    startOfMonth(new Date())
  );
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const days = useMemo(() => {
    const first = startOfMonth(monthCursor);
    const last = endOfMonth(monthCursor);

    // Monday-first grid (T2..CN)
    const mondayIndex = (first.getDay() + 6) % 7; // 0..6 where 0=Mon
    const start = new Date(first);
    start.setDate(first.getDate() - mondayIndex);

    const result: Date[] = [];
    const totalCells = 42; // 6 weeks
    for (let i = 0; i < totalCells; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      result.push(d);
    }
    return { first, last, result };
  }, [monthCursor]);

  const slots = useMemo(() => {
    // mock slots like screenshot
    return [
      "09:00 - 10:00",
      "10:00 - 11:00",
      "11:00 - 12:00",
      "14:00 - 15:00",
      "15:00 - 16:00",
      "16:00 - 17:00",
      "17:00 - 18:00",
      "19:00 - 20:00",
      "21:00 - 22:00",
    ];
  }, []);

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat("vi-VN", {
      month: "long",
      year: "numeric",
    }).format(monthCursor);
  }, [monthCursor]);

  return (
    <aside className="sticky top-20 rounded-2xl bg-[color:var(--trust-blue)]/80 p-5 text-white shadow-[0_10px_30px_rgba(27,73,101,0.18)] ring-1 ring-white/15">
      <div className="text-[14px] font-bold">Đặt lịch tư vấn</div>

      <div className="mt-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-white/90 hover:bg-white/10"
            onClick={() => setMonthCursor((m) => addMonths(m, -1))}
            aria-label="Tháng trước"
          >
            ‹
          </button>
          <div className="text-[12px] font-semibold">{monthLabel}</div>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-white/90 hover:bg-white/10"
            onClick={() => setMonthCursor((m) => addMonths(m, 1))}
            aria-label="Tháng sau"
          >
            ›
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-2 text-center text-[10px] font-semibold text-white/70">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-2">
          {days.result.map((d, idx) => {
            const inMonth = d.getMonth() === monthCursor.getMonth();
            const selected = isSameDay(d, selectedDate);
            return (
              <button
                key={`${d.toISOString()}-${idx}`}
                type="button"
                onClick={() => {
                  setSelectedDate(d);
                  setSelectedSlot("");
                }}
                className={[
                  "h-8 rounded-lg text-[11px] font-semibold transition-colors",
                  inMonth ? "text-white" : "text-white/40",
                  selected
                    ? "bg-white text-[color:var(--corporate-blue)]"
                    : "bg-white/10 hover:bg-white/15",
                ].join(" ")}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-[11px] font-semibold text-white/90">
          Chọn giờ (chỉ hiển thị những khung giờ khả dụng)
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {slots.map((s) => {
            const active = selectedSlot === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSlot(s)}
                className={[
                  "rounded-lg px-2 py-2 text-[10px] font-semibold ring-1 ring-white/15",
                  active
                    ? "bg-white text-[color:var(--corporate-blue)]"
                    : "bg-white/10 text-white hover:bg-white/15",
                ].join(" ")}
              >
                {s}
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl bg-white/10 p-3 ring-1 ring-white/15">
          <div className="text-[11px] font-semibold text-white/85">
            Thông tin cuộc hẹn
          </div>
          <div className="mt-1 text-[12px] font-bold">
            {formatDateVi(selectedDate)}
            {selectedSlot ? ` • ${selectedSlot}` : ""}
          </div>
          <div className="mt-1 text-[12px] font-semibold text-white/90">
            {formatVnd(expert.pricePerSessionVnd)}{" "}
            <span className="text-white/70">/buổi</span>
          </div>
        </div>

        <button
          type="button"
          disabled={!selectedSlot}
          className={[
            "mt-4 w-full rounded-xl px-4 py-3 text-[12px] font-bold shadow-sm transition-opacity",
            selectedSlot
              ? "bg-white text-[color:var(--corporate-blue)]"
              : "bg-white/50 text-[color:var(--corporate-blue)] opacity-70",
          ].join(" ")}
        >
          Tiếp tục thanh toán
        </button>

        <div className="mt-2 text-center text-[10px] text-white/70">
          Bạn có thể huỷ hoặc đổi lịch miễn phí trước 24h
        </div>
      </div>
    </aside>
  );
}

function RatingLine({
  rating,
  reviewsCount,
}: {
  rating: number;
  reviewsCount: number;
}) {
  const full = Math.round(rating);
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 text-[color:var(--innovation-sky)]">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={i < full ? "text-amber-500" : "text-black/20"}
          >
            <Star filled={i < full} />
          </span>
        ))}
      </div>
      <div className="text-[12px] font-semibold text-black/55">
        {rating.toFixed(1)} ({reviewsCount} đánh giá)
      </div>
    </div>
  );
}

export default function ExpertDetailPage() {
  const { id } = useParams();
  const expert = useMemo(() => EXPERTS.find((e) => e.id === id), [id]);

  if (!expert) {
    return (
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <div className="text-lg font-bold text-[color:var(--corporate-blue)]">
          Không tìm thấy chuyên gia
        </div>
        <Link
          to="/chuyen-gia"
          className="mt-3 inline-block text-sm font-semibold text-[color:var(--trust-blue)]"
        >
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      {/* Left column */}
      <div className="space-y-5">
        <Link
          to="/chuyen-gia"
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--innovation-sky)]/45 bg-white px-4 py-2 text-[12px] font-semibold text-[color:var(--corporate-blue)] hover:bg-black/5"
        >
          ← Quay lại danh sách
        </Link>

        {/* Profile summary card */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(27,73,101,0.10)] ring-1 ring-[color:var(--innovation-sky)]/35">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <Avatar expert={expert} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[16px] font-extrabold text-[color:var(--corporate-blue)]">
                    {(expert.degreePrefix ? `${expert.degreePrefix} ` : "") +
                      expert.name}
                  </h1>
                  {expert.verified ? <VerifiedBadge /> : null}
                </div>

                <div className="mt-1 text-[12px] font-semibold text-[color:var(--trust-blue)]">
                  {expert.title}
                </div>

                <div className="mt-2">
                  <RatingLine
                    rating={expert.rating}
                    reviewsCount={expert.reviewsCount}
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                  <span className="rounded-full bg-[color:var(--calm-background)] px-3 py-1 text-[color:var(--corporate-blue)] ring-1 ring-black/5">
                    {expert.experienceYears
                      ? `${expert.experienceYears}+ năm kinh nghiệm`
                      : "Kinh nghiệm"}
                  </span>
                  <span className="rounded-full bg-[color:var(--calm-background)] px-3 py-1 text-[color:var(--corporate-blue)] ring-1 ring-black/5">
                    {expert.languages.join(", ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-[18px] font-extrabold text-[color:var(--corporate-blue)]">
                {formatVnd(expert.pricePerSessionVnd)}
                <span className="text-[12px] font-semibold text-black/45">
                  {" "}
                  /buổi
                </span>
              </div>
              <div className="mt-2 text-[11px] text-black/45">
                Giá có thể thay đổi theo gói dịch vụ
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="rounded-2xl bg-white p-5 ring-1 ring-[color:var(--innovation-sky)]/25">
          <div className="text-[13px] font-bold text-[color:var(--corporate-blue)]">
            Giới thiệu
          </div>
          <p className="mt-2 text-[12px] leading-6 text-black/60">
            {expert.about ?? "Chưa có nội dung giới thiệu."}
          </p>
        </div>

        {/* Expertise */}
        <div className="rounded-2xl bg-white p-5 ring-1 ring-[color:var(--innovation-sky)]/25">
          <div className="text-[13px] font-bold text-[color:var(--corporate-blue)]">
            Chuyên môn
          </div>
          <ul className="mt-3 space-y-2 text-[12px] text-black/60">
            {(expert.expertise?.length
              ? expert.expertise
              : ["Chưa cập nhật danh sách chuyên môn."]
            ).map((x) => (
              <li key={x} className="flex items-start gap-2">
                <span className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-[color:var(--innovation-sky)]" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Reviews */}
        <div className="rounded-2xl bg-white p-5 ring-1 ring-[color:var(--innovation-sky)]/25">
          <div className="text-[13px] font-bold text-[color:var(--corporate-blue)]">
            Đánh giá từ khách hàng tự buổi tư vấn
          </div>

          <div className="mt-3 space-y-4">
            {(expert.reviews?.length ? expert.reviews : []).map((r) => (
              <div
                key={r.id}
                className="border-b border-black/5 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-bold text-[color:var(--corporate-blue)]">
                    {r.customerName}
                  </div>
                  <div className="text-[11px] font-semibold text-black/40">
                    {r.dateIso}
                  </div>
                </div>

                <div className="mt-1 flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} filled={i < r.rating} />
                  ))}
                </div>

                <p className="mt-2 text-[12px] leading-6 text-black/60">
                  {r.comment}
                </p>
              </div>
            ))}

            {!expert.reviews?.length ? (
              <div className="text-[12px] text-black/45">Chưa có đánh giá.</div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Right column */}
      <CalendarBookingCard expert={expert} />
    </section>
  );
}
