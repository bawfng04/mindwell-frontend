import { useMemo, useState } from "react";
// import kh from "../assets/kh.png";

type PointsPack = { points: number; priceVnd: number; tag?: string };
type PlanKey = "free" | "premium" | "platinum";

function formatVnd(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

// function Badge({ children }: { children: React.ReactNode }) {
//   return (
//     <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-[12px] font-extrabold text-white ring-1 ring-white/25">
//       {children}
//     </span>
//   );
// }

function IconBox({ label }: { label: string }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-white ring-1 ring-white/20">
      <span className="text-[12px] font-extrabold">{label}</span>
    </div>
  );
}

function Check({ className = "" }: { className?: string }) {
  return (
    <span
      className={[
        "inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20",
        className,
      ].join(" ")}
      aria-hidden="true"
    >
      <svg width="14" height="14" viewBox="0 0 24 24">
        <path
          d="M7.5 12.3 10.4 15l6.3-6.4"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function PlanCheck({ dark }: { dark?: boolean }) {
  return (
    <span
      className={[
        "inline-flex h-5 w-5 items-center justify-center rounded-full ring-1",
        dark
          ? "bg-[color:var(--trust-blue)]/12 ring-[color:var(--trust-blue)]/25"
          : "bg-white/15 ring-white/20",
      ].join(" ")}
      aria-hidden="true"
    >
      <svg width="14" height="14" viewBox="0 0 24 24">
        <path
          d="M7.5 12.3 10.4 15l6.3-6.4"
          fill="none"
          stroke={dark ? "var(--trust-blue)" : "white"}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function MindPointsPage() {
  const packs: PointsPack[] = useMemo(
    () => [
      { points: 300, priceVnd: 300_000 },
      { points: 500, priceVnd: 485_000, tag: "Phổ biến nhất" },
      { points: 1000, priceVnd: 950_000 },
      { points: 3000, priceVnd: 2_790_000, tag: "Tăng thêm" },
    ],
    []
  );

  const [selectedPack, setSelectedPack] = useState<number>(500);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("premium");

  return (
    <div className="space-y-6">
      {/* Page title (outside hero) */}
      <div className="text-center">
        {/* <Badge>⚡ Linh hoạt &amp; Tiết kiệm</Badge> */}

        <h1 className="mt-4 text-3xl font-extrabold text-[color:var(--corporate-blue)]">
          MindPoints &amp; Gói thành viên
        </h1>

        <p className="mt-2 text-[12px] font-semibold text-black/45">
          Hai cách linh hoạt để tiết kiệm chi phí và nhận được dịch vụ tốt nhất
        </p>
      </div>

      {/* Hero card */}
      <section className="overflow-hidden rounded-3xl bg-[color:var(--trust-blue)] shadow-[0_20px_60px_rgba(27,73,101,0.30)] ring-1 ring-white/15">
        <div className="p-6 md:p-7">
          <div className="flex items-start gap-3">
            <IconBox label="⟲" />
            <div className="min-w-0">
              <div className="text-[16px] font-extrabold text-white">
                MindPoints
              </div>
              <div className="mt-1 text-[12px] font-semibold text-white/75">
                Hệ thống điểm linh hoạt, dùng khi cần
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                n: "1",
                title: "Nạp điểm",
                desc: "100.000 VNĐ = 100 MindPoints",
                hint: "Càng nạp càng hời!",
                icon: "⬇",
              },
              {
                n: "2",
                title: "Đặt lịch",
                desc: "1 buổi = 200 – 400 điểm",
                hint: "Tuỳ theo giá tiền, chuyên gia và chuyên môn",
                icon: "📅",
              },
              {
                n: "3",
                title: "Thưởng",
                desc: "Tích luỹ 3.000 điểm",
                hint: "Tặng 1 buổi miễn phí (≈ 300 điểm)",
                icon: "🎁",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15"
              >
                <div className="flex items-center justify-between">
                  <div className="text-[18px] font-extrabold text-white">
                    {s.n}
                  </div>
                  <div className="text-[12px] text-white/80">{s.icon}</div>
                </div>
                <div className="mt-2 text-[13px] font-extrabold text-white">
                  {s.title}
                </div>
                <div className="mt-1 text-[12px] font-semibold text-white/80">
                  {s.desc}
                </div>
                <div className="mt-2 text-[11px] font-semibold text-white/65">
                  {s.hint}
                </div>
              </div>
            ))}
          </div>

          {/* Packs */}
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {packs.map((p) => {
              const active = selectedPack === p.points;
              return (
                <button
                  key={p.points}
                  type="button"
                  onClick={() => setSelectedPack(p.points)}
                  className={[
                    "relative rounded-2xl px-4 py-4 text-left ring-1 transition-colors",
                    active
                      ? "bg-white text-[color:var(--corporate-blue)] ring-white/50"
                      : "bg-white/10 text-white ring-white/15 hover:bg-white/15",
                  ].join(" ")}
                >
                  {p.tag ? (
                    <span
                      className={[
                        "absolute -top-2 left-4 rounded-full px-2 py-1 text-[10px] font-extrabold ring-1",
                        active
                          ? "bg-[color:var(--innovation-sky)] text-[color:var(--corporate-blue)] ring-black/5"
                          : "bg-amber-300 text-[color:var(--corporate-blue)] ring-black/5",
                      ].join(" ")}
                    >
                      {p.tag}
                    </span>
                  ) : null}

                  <div className="text-[18px] font-extrabold">{p.points}</div>
                  <div
                    className={
                      active
                        ? "text-[12px] font-semibold text-black/50"
                        : "text-[12px] font-semibold text-white/75"
                    }
                  >
                    {formatVnd(p.priceVnd)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefit cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[
          {
            title: "Linh hoạt",
            desc: "Dùng khi nào cần, không ràng buộc cam kết hằng tháng",
            icon: "⚡",
          },
          {
            title: "Không hết hạn",
            desc: "Điểm tồn tại vĩnh viễn, dùng khi bạn cần",
            icon: "◎",
          },
          {
            title: "Tích điểm thưởng",
            desc: "Càng dùng nhiều, càng nhận nhiều ưu đãi",
            icon: "🎁",
          },
        ].map((b) => (
          <div
            key={b.title}
            className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(27,73,101,0.10)] ring-1 ring-[color:var(--innovation-sky)]/30"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--calm-background)] text-[color:var(--trust-blue)] ring-1 ring-black/5">
                <span className="text-[14px] font-extrabold">{b.icon}</span>
              </div>
              <div>
                <div className="text-[13px] font-extrabold text-[color:var(--corporate-blue)]">
                  {b.title}
                </div>
                <div className="mt-1 text-[12px] font-semibold text-black/45">
                  {b.desc}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plans */}
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-[color:var(--corporate-blue)]">
          Hoặc chọn Gói thành viên
        </h2>
        <p className="mt-2 text-[12px] font-semibold text-black/45">
          Giảm giá và ưu đãi theo tháng, dùng kèm với MindPoints
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Free */}
        <div className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(27,73,101,0.10)] ring-1 ring-[color:var(--innovation-sky)]/30">
          <div className="text-[12px] font-extrabold text-[color:var(--corporate-blue)]">
            Free
          </div>
          <div className="mt-1 text-[11px] font-semibold text-black/45">
            Cơ bản
          </div>

          <div className="mt-4 text-3xl font-extrabold text-[color:var(--corporate-blue)]">
            0đ
          </div>
          <div className="mt-1 text-[11px] font-semibold text-black/45">
            Miễn phí mãi mãi
          </div>

          <ul className="mt-5 space-y-3 text-[12px] font-semibold text-black/55">
            <li className="flex items-start gap-2">
              <PlanCheck dark />
              <span>Đặt lịch và tính bình thường</span>
            </li>
            <li className="flex items-start gap-2">
              <PlanCheck dark />
              <span>Hỗ trợ qua email</span>
            </li>
          </ul>

          <button
            type="button"
            onClick={() => setSelectedPlan("free")}
            className={[
              "mt-6 w-full rounded-2xl px-4 py-3 text-[12px] font-extrabold ring-1 transition-colors",
              selectedPlan === "free"
                ? "bg-[color:var(--corporate-blue)] text-white ring-[color:var(--trust-blue)]"
                : "bg-white text-[color:var(--corporate-blue)] ring-[color:var(--innovation-sky)]/45 hover:bg-black/5",
            ].join(" ")}
          >
            Miễn phí
          </button>
        </div>

        {/* Premium (highlight) */}
        <div className="relative overflow-hidden rounded-3xl bg-[color:var(--trust-blue)] p-6 shadow-[0_20px_60px_rgba(27,73,101,0.35)] ring-1 ring-white/15">
          <div className="absolute left-1/2 top-4 -translate-x-1/2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-extrabold text-white ring-1 ring-white/25">
              ⭐ Phổ biến nhất
            </span>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div>
              <div className="text-[12px] font-extrabold text-white">
                Premium
              </div>
              <div className="mt-1 text-[11px] font-semibold text-white/75">
                Nâng cao
              </div>
            </div>
            <div className="rounded-2xl bg-white/15 p-2 ring-1 ring-white/20">
              <Check />
            </div>
          </div>

          <div className="mt-4 says text-3xl font-extrabold text-white">
            199.000đ
          </div>
          <div className="mt-1 text-[11px] font-semibold text-white/75">
            /tháng
          </div>

          <ul className="mt-5 space-y-3 text-[12px] font-semibold text-white/85">
            {[
              "Giảm 15% tất cả buổi tư vấn",
              "Áp dụng cả khi trả bằng MindPoints",
              "Đặt lịch ưu tiên với chuyên gia yêu thích",
              "Chat hỗ trợ tư vấn",
              "Tài liệu tự học độc quyền",
              "Báo cáo sức khoẻ tinh thần định kỳ",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check />
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setSelectedPlan("premium")}
            className={[
              "mt-6 w-full rounded-2xl px-4 py-3 text-[12px] font-extrabold transition-colors",
              selectedPlan === "premium"
                ? "bg-[color:var(--corporate-blue)] text-white ring-[color:var(--trust-blue)]"
                : "bg-white/90 text-[color:var(--corporate-blue)] hover:bg-white",
            ].join(" ")}
          >
            Chọn Premium
          </button>
        </div>

        {/* Platinum */}
        <div className="rounded-3xl bg-[color:var(--corporate-blue)] p-6 shadow-[0_20px_60px_rgba(27,73,101,0.30)] ring-1 ring-white/15">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12px] font-extrabold text-white">
                Platinum
              </div>
              <div className="mt-1 text-[11px] font-semibold text-white/75">
                Cao cấp
              </div>
            </div>
            <div className="rounded-2xl bg-white/15 p-2 ring-1 ring-white/20">
              <Check />
            </div>
          </div>

          <div className="mt-4 text-3xl font-extrabold text-white">
            399.000đ
          </div>
          <div className="mt-1 text-[11px] font-semibold text-white/75">
            /tháng
          </div>

          <ul className="mt-5 space-y-3 text-[12px] font-semibold text-white/85">
            {[
              "Giảm 30% tất cả buổi tư vấn",
              "Áp dụng cả khi trả bằng MindPoints",
              "Ưu tiên tư vấn khẩn cấp trong 24h",
              "Chuyên gia tư vấn nhanh hơn",
              "Hỗ trợ 24/7 qua mọi kênh",
              "Tư vấn nhóm không giới hạn",
              "Báo cáo sức khoẻ tinh thần định kỳ",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check />
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setSelectedPlan("platinum")}
            className={[
              "mt-6 w-full rounded-2xl px-4 py-3 text-[12px] font-extrabold transition-colors",
              selectedPlan === "platinum"
                ? "bg-[color:var(--trust-blue)] text-[color:white]"
                : "bg-white/15 text-white ring-1 ring-white/20 hover:bg-white/20",
            ].join(" ")}
          >
            Chọn Platinum
          </button>
        </div>
      </div>

      {/* Bottom banner */}
      <div className="rounded-3xl bg-[color:var(--trust-blue)]/80 px-6 py-5 text-center text-white shadow-[0_20px_60px_rgba(27,73,101,0.22)] ring-1 ring-white/15">
        <div className="text-[12px] font-extrabold">
          🤝 Kết hợp cả hai để tối ưu chi phí
        </div>
        <div className="mt-2 text-[12px] font-semibold text-white/85">
          MindPoints + Đăng ký Premium/Platinum = Giảm giá tự động cho mọi buổi
          tư vấn, tiết kiệm tối đa chi phí
        </div>
      </div>
    </div>
  );
}
