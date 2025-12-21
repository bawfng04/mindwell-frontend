import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import type { AvailabilitySlotDto, ExpertDetailDto } from "../types/api";

function formatVnd(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

function isAbortError(e: unknown) {
  return (
    (typeof e === "object" &&
      e !== null &&
      "name" in e &&
      (e as any).name === "AbortError") ||
    false
  );
}

function formatDateVi(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(date);
}

function formatTimeRange(startIso: string, endIso: string) {
  const s = new Date(startIso);
  const e = new Date(endIso);
  const t1 = s.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const t2 = e.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${t1} - ${t2}`;
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

function Avatar({ expert }: { expert: ExpertDetailDto }) {
  if (expert.profileImageUrl) {
    return (
      <img
        src={expert.profileImageUrl}
        alt={expert.fullName}
        className="h-24 w-24 rounded-2xl object-cover ring-1 ring-black/5"
      />
    );
  }
  const parts = expert.fullName.trim().split(/\s+/);
  const initials = (
    (parts[0]?.[0] ?? "") + (parts.at(-1)?.[0] ?? "")
  ).toUpperCase();
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[color:var(--calm-background)] text-2xl font-bold text-[color:var(--corporate-blue)] ring-1 ring-black/5">
      {initials}
    </div>
  );
}

function CalendarBookingCard({
  expert,
  allSlots,
  onBook,
  bookingLoading,
}: {
  expert: ExpertDetailDto;
  allSlots: AvailabilitySlotDto[];
  onBook: (slotId: number) => void;
  bookingLoading: boolean;
}) {
  const [monthCursor, setMonthCursor] = useState(() =>
    startOfMonth(new Date())
  );
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<
    number | null
  >(null);

  const days = useMemo(() => {
    const first = startOfMonth(monthCursor);
    const last = endOfMonth(monthCursor);

    const mondayIndex = (first.getDay() + 6) % 7;
    const start = new Date(first);
    start.setDate(first.getDate() - mondayIndex);

    const result: Date[] = [];
    const totalCells = 42;
    for (let i = 0; i < totalCells; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      result.push(d);
    }
    return { first, last, result };
  }, [monthCursor]);

  const availableSlotsForDate = useMemo(() => {
    return allSlots.filter((s) => {
      const slotDate = new Date(s.startTime);
      return isSameDay(slotDate, selectedDate);
    });
  }, [allSlots, selectedDate]);

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat("vi-VN", {
      month: "long",
      year: "numeric",
    }).format(monthCursor);
  }, [monthCursor]);

  const selectedSlotInfo = useMemo(
    () => allSlots.find((s) => s.availabilityId === selectedAvailabilityId),
    [allSlots, selectedAvailabilityId]
  );

  return (
    <aside className="sticky top-20 rounded-2xl bg-[color:var(--trust-blue)]/80 p-5 text-white shadow-[0_10px_30px_rgba(27,73,101,0.18)] ring-1 ring-white/15">
      <div className="text-[14px] font-bold">Đặt lịch tư vấn</div>

      <div className="mt-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-white/90 hover:bg-white/10"
            onClick={() => setMonthCursor((m) => addMonths(m, -1))}
          >
            ‹
          </button>
          <div className="text-[12px] font-semibold">{monthLabel}</div>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-white/90 hover:bg-white/10"
            onClick={() => setMonthCursor((m) => addMonths(m, 1))}
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
            const hasSlots = allSlots.some((s) =>
              isSameDay(new Date(s.startTime), d)
            );

            return (
              <button
                key={`${d.toISOString()}-${idx}`}
                type="button"
                onClick={() => {
                  setSelectedDate(d);
                  setSelectedAvailabilityId(null);
                }}
                className={[
                  "h-8 rounded-lg text-[11px] font-semibold transition-colors relative",
                  inMonth ? "text-white" : "text-white/40",
                  selected
                    ? "bg-white !text-black/80 font-bold"
                    : hasSlots
                    ? "bg-white/10 hover:bg-white/15"
                    : inMonth
                    ? "bg-red-500/15 hover:bg-red-500/20 ring-1 ring-red-300/30"
                    : "bg-white/10 hover:bg-white/15",
                ].join(" ")}
              >
                {d.getDate()}
                {hasSlots && !selected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[color:var(--innovation-sky)]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-[11px] font-semibold text-white/90">
          Chọn giờ ({availableSlotsForDate.length} khung giờ)
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {availableSlotsForDate.length === 0 ? (
            <button
              type="button"
              disabled
              className="col-span-2 rounded-lg px-2 py-2 text-[10px] font-semibold ring-1 ring-red-300 bg-red-50 text-red-700 opacity-80 cursor-not-allowed"
            >
              Không có lịch trống ngày này
            </button>
          ) : (
            availableSlotsForDate.map((s) => {
              const active = selectedAvailabilityId === s.availabilityId;
              const label = formatTimeRange(s.startTime, s.endTime);

              return (
                <button
                  key={s.availabilityId}
                  type="button"
                  onClick={() => setSelectedAvailabilityId(s.availabilityId)}
                  className={[
                    "rounded-lg px-2 py-2 text-[10px] font-semibold ring-1 ring-white/15",
                    active
                      ? "bg-white text-[color:var(--corporate-blue)]"
                      : "bg-white/10 text-white hover:bg-white/15",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })
          )}
        </div>

        <div className="mt-4 rounded-xl bg-white/10 p-3 ring-1 ring-white/15">
          <div className="text-[11px] font-semibold text-white/85">
            Thông tin cuộc hẹn
          </div>
          <div className="mt-1 text-[12px] font-bold">
            {formatDateVi(selectedDate)}
            {selectedSlotInfo
              ? ` • ${formatTimeRange(
                  selectedSlotInfo.startTime,
                  selectedSlotInfo.endTime
                )}`
              : ""}
          </div>
          <div className="mt-1 text-[12px] font-semibold text-white/90">
            {formatVnd(expert.hourlyRate)}{" "}
            <span className="text-white/70">/giờ</span>
          </div>
        </div>

        <button
          type="button"
          disabled={!selectedAvailabilityId || bookingLoading}
          onClick={() => {
            if (selectedAvailabilityId) onBook(selectedAvailabilityId);
          }}
          className={[
            "mt-4 w-full rounded-xl px-4 py-3 text-[12px] font-bold shadow-sm transition-opacity",
            selectedAvailabilityId && !bookingLoading
              ? "bg-white text-[color:var(--corporate-blue)]"
              : "bg-white/50 text-[color:var(--corporate-blue)] opacity-70 cursor-not-allowed",
          ].join(" ")}
        >
          {bookingLoading ? "Đang xử lý..." : "Tiếp tục thanh toán"}
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
  const nav = useNavigate();
  const params = useParams();

  const expertId = useMemo(() => {
    const raw = params.id;
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) ? n : null;
  }, [params.id]);

  const [expert, setExpert] = useState<ExpertDetailDto | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlotDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (expertId === null) {
      setLoading(false);
      setErr("Đường dẫn không hợp lệ (expertId).");
      return;
    }

    const ac = new AbortController();

    (async () => {
      setErr(null);
      setLoading(true);

      try {
        const [detail, av] = await Promise.all([
          api.experts.getExpertDetail(expertId, { signal: ac.signal }),
          api.experts.getAvailability(expertId, undefined, {
            signal: ac.signal,
          }),
        ]);

        if (ac.signal.aborted) return;

        setExpert(detail);
        setSlots(av);
      } catch (e) {
        // ignore abort/cancel (dev StrictMode or navigating away)
        //
        if (ac.signal.aborted || isAbortError(e)) return;

        setErr("Không tải được dữ liệu chuyên gia.");
      } finally {
        if (ac.signal.aborted) return;
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [expertId]);

  async function handleBook(slotId: number) {
    if (expertId === null) return;

    setBooking(true);
    setErr(null);
    try {
      const res = await api.experts.bookAppointment(expertId, {
        availabilityId: slotId,
      });
      nav(`/thanh-toan?apptId=${res.apptId}`);
    } catch {
      alert("Đặt lịch thất bại. Vui lòng đăng nhập và thử lại.");
    } finally {
      setBooking(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[13px] font-semibold text-[color:var(--trust-blue)]">
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  if (err || !expert) {
    return (
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <div className="text-lg font-bold text-[color:var(--corporate-blue)]">
          {err ?? "Không tìm thấy chuyên gia"}
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
      <div className="space-y-5">
        <Link
          to="/chuyen-gia"
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--innovation-sky)]/45 bg-white px-4 py-2 text-[12px] font-semibold text-[color:var(--corporate-blue)] hover:bg-black/5"
        >
          ← Quay lại danh sách
        </Link>

        <div className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(27,73,101,0.10)] ring-1 ring-[color:var(--innovation-sky)]/35">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <Avatar expert={expert} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[16px] font-extrabold text-[color:var(--corporate-blue)]">
                    {expert.fullName}
                  </h1>
                  {expert.isVerified ? <VerifiedBadge /> : null}
                </div>

                <div className="mt-1 text-[12px] font-semibold text-[color:var(--trust-blue)]">
                  {expert.title}
                </div>

                <div className="mt-2">
                  <RatingLine
                    rating={expert.avgRating}
                    reviewsCount={expert.reviewCount}
                  />
                </div>

                {typeof expert.experienceYears === "number" ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                    <span className="rounded-full bg-[color:var(--calm-background)] px-3 py-1 text-[color:var(--corporate-blue)] ring-1 ring-black/5">
                      {expert.experienceYears}+ năm kinh nghiệm
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-[18px] font-extrabold text-[color:var(--corporate-blue)]">
                {formatVnd(expert.hourlyRate)}
                <span className="text-[12px] font-semibold text-black/45">
                  {" "}
                  /giờ
                </span>
              </div>
              <div className="mt-2 text-[11px] text-black/45">
                Giá có thể thay đổi theo gói dịch vụ
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 ring-1 ring-[color:var(--innovation-sky)]/25">
          <div className="text-[13px] font-bold text-[color:var(--corporate-blue)]">
            Giới thiệu
          </div>
          <p className="mt-2 text-[12px] leading-6 text-black/60">
            {expert.bio || "Chưa có nội dung giới thiệu."}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 ring-1 ring-[color:var(--innovation-sky)]/25">
          <div className="text-[13px] font-bold text-[color:var(--corporate-blue)]">
            Đánh giá từ khách hàng
          </div>

          <div className="mt-3 space-y-4">
            <div className="text-[12px] text-black/45">
              Hiện chưa có API lấy danh sách chi tiết đánh giá.
            </div>
          </div>
        </div>
      </div>

      <CalendarBookingCard
        expert={expert}
        allSlots={slots}
        onBook={handleBook}
        bookingLoading={booking}
      />
    </section>
  );
}
