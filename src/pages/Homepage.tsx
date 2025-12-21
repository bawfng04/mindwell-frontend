import { useMemo } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { EXPERTS } from "../services/experts";
import type { Expert } from "../types/expert";
import hero from "../assets/mindwell-hero.png";

function formatVnd(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

function Pill({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-extrabold ring-1",
        dark
          ? "bg-white/10 text-white ring-white/15"
          : "bg-white/30 text-white ring-white/25",
      ].join(" ")}
    >
      <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--innovation-sky)]" />
      {children}
    </span>
  );
}

function IconBadge({
  children,
  size = "md",
}: {
  children: ReactNode;
  size?: "sm" | "md";
}) {
  return (
    <div
      className={[
        "grid place-items-center rounded-2xl ring-1 ring-black/5",
        size === "sm" ? "h-10 w-10" : "h-12 w-12",
        "bg-[color:var(--calm-background)] text-[color:var(--trust-blue)]",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function LiftCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(27,73,101,0.18)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <LiftCard className="rounded-2xl bg-white p-5 text-center shadow-[0_10px_30px_rgba(27,73,101,0.10)] ring-1 ring-[color:var(--innovation-sky)]/25">
      <div className="mx-auto mb-3 w-fit">
        <IconBadge size="sm">{icon}</IconBadge>
      </div>
      <div className="text-[18px] font-extrabold text-[color:var(--corporate-blue)]">
        {value}
      </div>
      <div className="mt-1 text-[11px] font-semibold text-black/45">
        {label}
      </div>
    </LiftCard>
  );
}

function FeatureCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: ReactNode;
}) {
  return (
    <LiftCard className="rounded-3xl bg-[color:var(--calm-background)] p-6 ring-1 ring-white/10">
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/70 text-[color:var(--trust-blue)] ring-1 ring-black/5">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-extrabold text-[color:var(--corporate-blue)]">
            {title}
          </div>
          <p className="mt-2 text-[12px] font-semibold leading-6 text-black/55">
            {desc}
          </p>
        </div>
      </div>
    </LiftCard>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.9 6.1 20l1.2-6.5L2.5 8.9 9.1 8 12 2z"
        fill="currentColor"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
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

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-[color:var(--corporate-blue)] ring-1 ring-black/5">
      <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--innovation-sky)]" />
      Đã xác minh
    </span>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts.at(-1)?.[0] ?? "";
  return (a + b).toUpperCase();
}

function ExpertPreviewCard({ expert }: { expert: Expert }) {
  return (
    <LiftCard>
      <article className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(27,73,101,0.10)] ring-1 ring-[color:var(--innovation-sky)]/35">
        <div className="relative aspect-[16/10] bg-gradient-to-br from-[color:var(--innovation-sky)]/25 to-[color:var(--trust-blue)]/15">
          {expert.avatarUrl ? (
            <img
              src={expert.avatarUrl}
              alt={`${expert.degreePrefix ?? ""} ${expert.name}`.trim()}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/70 text-xl font-extrabold text-[color:var(--corporate-blue)] ring-1 ring-black/5">
                {initials(expert.name)}
              </div>
            </div>
          )}

          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-[color:var(--corporate-blue)] ring-1 ring-black/5">
            <span className="text-amber-500">
              <StarIcon />
            </span>
            {expert.rating.toFixed(1)}
          </div>

          <div className="absolute right-3 top-3">
            {expert.verified ? <VerifiedBadge /> : null}
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-1">
            <h3 className="text-[15px] font-extrabold text-[color:var(--corporate-blue)]">
              {(expert.degreePrefix ? `${expert.degreePrefix} ` : "") +
                expert.name}
            </h3>
            <p className="text-[12px] font-semibold text-[color:var(--trust-blue)]">
              {expert.title}
            </p>
            <p className="text-[12px] text-black/55">{expert.specialty}</p>
          </div>

          <div className="mt-3 flex items-end justify-between">
            <div className="leading-tight">
              <div className="text-[15px] font-extrabold text-[color:var(--corporate-blue)]">
                {formatVnd(expert.pricePerSessionVnd)}
                <span className="text-[11px] font-semibold text-black/45">
                  {" "}
                  /buổi
                </span>
              </div>
            </div>
            <div className="text-[11px] font-semibold text-black/45">
              {expert.reviewsCount} đánh giá
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Link
              to={`/chuyen-gia/${expert.id}`}
              className="flex-1 rounded-full border border-[color:var(--innovation-sky)]/60 bg-white px-4 py-2 text-center text-[12px] font-extrabold text-[color:var(--corporate-blue)] hover:bg-black/5"
            >
              Xem hồ sơ
            </Link>

            <Link
              to={`/chuyen-gia/${expert.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--trust-blue)] px-4 py-2 text-[12px] font-extrabold text-white hover:brightness-95 active:brightness-90"
            >
              <CalendarIcon />
              Đặt lịch
            </Link>
          </div>
        </div>
      </article>
    </LiftCard>
  );
}

export default function Home() {
  const topExperts = useMemo(() => {
    return [...EXPERTS]
      .sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount)
      .slice(0, 3);
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-3xl shadow-[0_22px_70px_rgba(27,73,101,0.28)] ring-1 ring-white/20"
        style={{ background: "var(--gradient-system)" }}
      >
        {/* decor */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_90%_20%,rgba(255,255,255,0.18),transparent_48%),radial-gradient(circle_at_70%_90%,rgba(0,0,0,0.18),transparent_55%)]" />
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative grid grid-cols-1 gap-7 p-6 md:grid-cols-[1.15fr_0.85fr] md:p-10">
          <div className="min-w-0">
            <Pill>Nền tảng chăm sóc sức khỏe tinh thần #1 Việt Nam</Pill>

            <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] text-white md:text-5xl">
              Tâm trí khỏe mạnh,
              <br />
              cuộc sống bình yên
            </h1>

            <p className="mt-4 max-w-xl text-[13px] font-semibold leading-7 text-white/90">
              Chăm sóc tâm trí, mọi lúc, mọi nơi. Kết nối với chuyên gia tâm lý
              uy tín, tư vấn trực tuyến an toàn và bảo mật tuyệt đối.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/dang-ky"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-[12px] font-extrabold text-[color:var(--corporate-blue)] shadow-sm transition hover:bg-white/90"
              >
                Bắt đầu ngay →
              </Link>
              <Link
                to="/mindpoints"
                className="inline-flex items-center justify-center rounded-2xl bg-white/15 px-5 py-3 text-[12px] font-extrabold text-white ring-1 ring-white/25 transition hover:bg-white/20"
              >
                Xem gói MindPoints
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/25 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
              <div className="relative aspect-[16/11] bg-[color:var(--calm-background)]">
                <img
                  src={hero}
                  alt="MindWell"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
              </div>

              <div className="absolute bottom-4 left-4">
                <div className="inline-flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-sm ring-1 ring-black/5">
                  <IconBadge size="sm">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </IconBadge>

                  <div className="leading-tight">
                    <div className="text-[13px] font-extrabold text-[color:var(--corporate-blue)]">
                      10K+
                    </div>
                    <div className="text-[10px] font-semibold text-black/45">
                      Người dùng
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/12 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(27,73,101,0.06)] ring-1 ring-[color:var(--innovation-sky)]/18">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M9 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            }
            value="10.000+"
            label="Người dùng tin tưởng"
          />
          <StatCard
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 21s-8-4.6-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.4-8 11-8 11Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            }
            value="50.000+"
            label="Buổi tư vấn thành công"
          />
          <StatCard
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7l3-7Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            }
            value="100+"
            label="Chuyên gia được xác minh"
          />
          <StatCard
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M4 16l4-4 4 3 7-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 20h16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            }
            value="98%"
            label="Khách hàng hài lòng"
          />
        </div>
      </section>

      {/* Why MindWell (dark like mockup) */}
      <section className="relative overflow-hidden rounded-3xl bg-[color:var(--trust-blue)]/50 p-6 shadow-[0_22px_70px_rgba(27,73,101,0.28)] ring-1 ring-white/20 md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(137,207,240,0.16),transparent_40%),radial-gradient(circle_at_85%_25%,rgba(70,130,180,0.18),transparent_45%)]" />
        <div className="relative text-center">
          <Pill dark>Tại sao chọn MindWell?</Pill>

          <h2 className="mt-4 text-3xl font-extrabold text-white md:text-4xl">
            Đồng hành cùng bạn trên
            <br />
            hành trình chữa lành
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-[12px] font-semibold leading-6 text-white/70">
            Chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe tinh thần tốt
            nhất.
          </p>
        </div>

        <div className="relative mt-9 grid grid-cols-1 gap-5 md:grid-cols-3">
          <FeatureCard
            title="Riêng tư 100%"
            desc="Mọi thông tin cá nhân và cuộc trò chuyện đều được mã hóa và bảo mật tuyệt đối theo chuẩn quốc tế."
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <FeatureCard
            title="Linh hoạt 24/7"
            desc="Đặt lịch bất cứ lúc nào phù hợp với thời gian của bạn, tư vấn xả stress tiện lợi."
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Zm0-14v5l3 2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <FeatureCard
            title="Chuyên gia hàng đầu"
            desc="Tất cả chuyên gia đều có chứng chỉ hành nghề được kiểm định và giàu kinh nghiệm."
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 2l4 4v6c0 2.2-1.8 4-4 4s-4-1.8-4-4V6l4-4Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 22h8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            }
          />
        </div>
      </section>

      {/* Top experts */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-[color:var(--corporate-blue)]">
              Chuyên gia hàng đầu
            </h2>
            <p className="mt-1 text-[12px] font-semibold text-black/45">
              Những chuyên gia được khách hàng tin tưởng nhất
            </p>
          </div>

          <Link
            to="/chuyen-gia"
            className="inline-flex items-center gap-2 rounded-2xl border border-[color:var(--innovation-sky)]/45 bg-white px-4 py-2 text-[12px] font-extrabold text-[color:var(--corporate-blue)] transition hover:bg-black/5"
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {topExperts.map((e) => (
            <ExpertPreviewCard key={e.id} expert={e} />
          ))}
        </div>
      </section>

      {/* MindPoints + Membership */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-[color:var(--corporate-blue)]">
            Linh hoạt với MindPoints &amp; Gói thành viên
          </h2>
          <p className="mt-1 text-[12px] font-semibold text-black/45">
            Cách thông minh để tiết kiệm chi phí
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <LiftCard className="rounded-3xl bg-[color:var(--trust-blue)]/80 p-6 text-white shadow-[0_20px_60px_rgba(27,73,101,0.22)] ring-1 ring-white/15">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[16px] font-extrabold">MindPoints</div>
                <div className="mt-1 text-[11px] font-semibold text-white/80">
                  Hệ thống điểm linh hoạt
                </div>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2a7 7 0 0 0-4 13v5l4-2 4 2v-5a7 7 0 0 0-4-13Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <ul className="mt-5 space-y-2 text-[12px] font-semibold text-white/90">
              <li>• 100.000đ = 100 điểm</li>
              <li>• 1 buổi = 200–400 điểm</li>
              <li>• Tích điểm thưởng</li>
              <li>• Không hết hạn</li>
            </ul>

            <Link
              to="/mindpoints"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-[12px] font-extrabold text-white ring-1 ring-white/25 transition hover:bg-white/20"
            >
              Tìm hiểu thêm →
            </Link>
          </LiftCard>

          <LiftCard className="rounded-3xl bg-[color:var(--corporate-blue)] p-6 text-white shadow-[0_20px_60px_rgba(27,73,101,0.28)] ring-1 ring-white/15">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[16px] font-extrabold">Membership</div>
                <div className="mt-1 text-[11px] font-semibold text-white/80">
                  Giảm giá tự động
                </div>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M6 4h12v16l-6-3-6 3V4Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <ul className="mt-5 space-y-2 text-[12px] font-semibold text-white/90">
              <li>• Premium: giảm 15%</li>
              <li>• Platinum: giảm 30%</li>
              <li>• Áp dụng cả với MindPoints</li>
              <li>• Nhiều ưu đãi hấp dẫn</li>
            </ul>

            <Link
              to="/mindpoints"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-[12px] font-extrabold text-white ring-1 ring-white/25 transition hover:bg-white/20"
            >
              Tìm hiểu thêm →
            </Link>
          </LiftCard>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        className="relative overflow-hidden rounded-3xl px-6 py-14 text-center text-white shadow-[0_20px_60px_rgba(27,73,101,0.22)] ring-1 ring-white/15"
        style={{ background: "var(--gradient-system)" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.22),transparent_45%),radial-gradient(circle_at_80%_25%,rgba(255,255,255,0.14),transparent_48%)]" />
        <div className="relative">
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Bắt đầu hành trình chữa lành của bạn
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[12px] font-semibold leading-6 text-white/90">
            Đừng để lo lắng và căng thẳng cản trở cuộc sống. Hãy để chúng tôi
            đồng hành cùng bạn trên con đường tìm lại sự bình yên và hạnh phúc.
          </p>

          <Link
            to="/dang-ky"
            className="mx-auto mt-6 inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-[12px] font-extrabold text-[color:var(--corporate-blue)] shadow-sm transition hover:bg-white/90"
          >
            Tạo tài khoản miễn phí
          </Link>
        </div>
      </section>
    </div>
  );
}
