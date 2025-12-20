import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { EXPERTS } from "../services/experts";

type Platform = "google_meet" | "zoom" | "teams";
type PaymentMethod = "momo" | "zalopay" | "card";

function formatVnd(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

function parseIsoDate(dateIso: string) {
  // expects yyyy-mm-dd
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateIso);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  const dt = new Date(y, mo, d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function formatDateLikeDesign(dateIso: string) {
  const dt = parseIsoDate(dateIso);
  if (!dt) return "—";

  const weekdays = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  const wd = weekdays[dt.getDay()] ?? "—";
  const day = dt.getDate();
  const month = dt.getMonth() + 1;
  const year = dt.getFullYear();

  return `${wd}, ${day} Tháng ${month}, ${year}`;
}

function platformLabel(p: Platform) {
  return p === "google_meet"
    ? "Google Meet"
    : p === "zoom"
    ? "Zoom"
    : "Microsoft Teams";
}

function PlatformIcon({ platform }: { platform: Platform }) {
  const base =
    "flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--calm-background)] text-[color:var(--corporate-blue)] ring-1 ring-black/5";
  const label =
    platform === "google_meet" ? "G" : platform === "zoom" ? "Z" : "T";
  return <div className={base}>{label}</div>;
}

function RadioDot({ checked }: { checked: boolean }) {
  return (
    <span
      className={[
        "inline-flex h-4 w-4 items-center justify-center rounded-full ring-1",
        checked
          ? "bg-[color:var(--trust-blue)] ring-[color:var(--trust-blue)]"
          : "bg-white ring-black/20",
      ].join(" ")}
      aria-hidden="true"
    >
      {checked ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
    </span>
  );
}

function Card({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(27,73,101,0.10)] ring-1 ring-[color:var(--innovation-sky)]/30">
      <header className="mb-4 flex items-start justify-between gap-3">
        <h2 className="text-[13px] font-extrabold text-[color:var(--corporate-blue)]">
          {title}
        </h2>
        {right}
      </header>
      {children}
    </section>
  );
}

function SuccessIcon() {
  return (
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--innovation-sky)]/35">
      <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
          fill="none"
          stroke="white"
          strokeWidth="1.8"
          opacity="0.85"
        />
        <path
          d="M7.5 12.2 10.4 15l6.1-6.2"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RowIcon({
  kind,
}: {
  kind: "calendar" | "clock" | "video" | "mail" | "link";
}) {
  const icon =
    kind === "calendar" ? (
      <path
        d="M7 3v3m10-3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    ) : kind === "clock" ? (
      <path
        d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Zm0-14v5l3 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : kind === "video" ? (
      <path
        d="M15 10.5V9a2 2 0 0 0-2-2H7A2 2 0 0 0 5 9v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1.5l4 2.5v-7l-4 2.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    ) : kind === "mail" ? (
      <path
        d="M4 6h16v12H4V6Zm0 1 8 6 8-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M10 13a5 5 0 0 1 0-7l.6-.6a5 5 0 0 1 7 7l-1.1 1.1M14 11a5 5 0 0 1 0 7l-.6.6a5 5 0 0 1-7-7l1.1-1.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    );

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--trust-blue)]/15 text-[color:var(--trust-blue)]">
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        {icon}
      </svg>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: "calendar" | "clock" | "video";
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <RowIcon kind={icon} />
      <div className="min-w-0">
        <div className="text-[12px] font-semibold text-black/45">{label}</div>
        <div className="truncate text-[16px] font-extrabold text-[color:var(--corporate-blue)]">
          {value}
        </div>
      </div>
    </div>
  );
}

function SuccessModal({
  open,
  onClose,
  date,
  slot,
  platform,
}: {
  open: boolean;
  onClose: () => void;
  date: string;
  slot: string;
  platform: Platform;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const pl = platformLabel(platform);

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_30px_80px_rgba(27,73,101,0.45)] ring-1 ring-black/5"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 text-black/60 hover:bg-black/10"
            aria-label="Đóng"
          >
            <CloseIcon />
          </button>

          <SuccessIcon />

          <h3 className="mt-4 text-center text-3xl font-extrabold text-[color:var(--corporate-blue)]">
            Đặt lịch thành công!
          </h3>
          <p className="mt-2 text-center text-[13px] font-semibold text-black/45">
            Chúc mừng bạn đã hoàn tất đặt lịch tư vấn
          </p>

          <div className="mt-5 rounded-2xl border border-[color:var(--innovation-sky)]/35 bg-[color:var(--calm-background)] p-5">
            <div className="space-y-5">
              <InfoRow
                icon="calendar"
                label="Ngày hẹn"
                value={formatDateLikeDesign(date)}
              />
              <InfoRow icon="clock" label="Thời gian" value={slot || "—"} />
              <InfoRow icon="video" label="Nền tảng" value={pl} />
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[color:var(--innovation-sky)]/35 bg-[color:var(--calm-background)] p-5">
            <div className="flex items-start gap-3">
              <RowIcon kind="mail" />
              <div>
                <div className="text-[14px] font-extrabold text-[color:var(--corporate-blue)]">
                  Email xác nhận đã được gửi
                </div>
                <div className="mt-1 text-[12px] font-semibold leading-6 text-black/50">
                  Chúng tôi đã gửi email xác nhận và link tham gia buổi tư vấn
                  đến hộp thư của bạn.
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3">
              <RowIcon kind="link" />
              <div>
                <div className="text-[14px] font-extrabold text-[color:var(--corporate-blue)]">
                  Link {pl}
                </div>
                <div className="mt-1 text-[12px] font-semibold leading-6 text-black/50">
                  Sẽ được kích hoạt 15 phút trước buổi tư vấn. Vui lòng kiểm tra
                  email để không bỏ lỡ!
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full rounded-2xl bg-[color:var(--trust-blue)] px-4 py-4 text-[14px] font-extrabold text-white shadow-sm hover:brightness-95 active:brightness-90"
          >
            Đóng
          </button>

          <div className="mt-4 text-center text-[12px] font-semibold text-black/40">
            Bạn có thể huỷ hoặc đổi lịch miễn phí trước 24 giờ
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const expertId = sp.get("expertId") ?? "";
  const date = sp.get("date") ?? ""; // yyyy-mm-dd
  const slot = sp.get("slot") ?? ""; // "14:00 - 15:00"

  const expert = useMemo(
    () => EXPERTS.find((e) => e.id === expertId),
    [expertId]
  );

  const [platform, setPlatform] = useState<Platform>("google_meet");
  const [method, setMethod] = useState<PaymentMethod>("momo");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(true);

  const [successOpen, setSuccessOpen] = useState(false);

  const price = expert?.pricePerSessionVnd ?? 0;

  const canSubmit =
    agree && !!fullName && !!email && !!phone && !!expertId && !!date && !!slot;

  return (
    <div className="pb-28">
      {/* Top step */}
      <div className="text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[color:var(--trust-blue)] px-4 py-2 text-[12px] font-extrabold text-white shadow-sm">
          Bước cuối cùng
        </div>

        <h1 className="mt-4 text-2xl font-extrabold text-[color:var(--corporate-blue)]">
          Đặt lịch với{" "}
          <span className="text-[color:var(--trust-blue)]">
            {expert
              ? `${expert.degreePrefix ?? ""} ${expert.name}`
              : "chuyên gia"}
          </span>
        </h1>

        <p className="mt-2 text-[12px] font-semibold text-black/50">
          Chọn thời gian, nền tảng và hoàn tất thanh toán
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left column */}
        <div className="space-y-6">
          <div>
            <Link
              to={expertId ? `/chuyen-gia/${expertId}` : "/chuyen-gia"}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--innovation-sky)]/45 bg-white px-4 py-2 text-[12px] font-semibold text-[color:var(--corporate-blue)] hover:bg-black/5"
            >
              ‹ Quay lại
            </Link>
          </div>

          <Card
            title="Chọn nền tảng tư vấn"
            right={
              <div className="text-[11px] font-semibold text-black/45">
                Link tham gia sẽ được gửi qua email từ 1–5 phút
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {(
                [
                  {
                    key: "google_meet",
                    name: "Google Meet",
                    sub: "Ổn định, dễ sử dụng",
                  },
                  { key: "zoom", name: "Zoom", sub: "Phổ biến, chất lượng" },
                  {
                    key: "teams",
                    name: "Microsoft Teams",
                    sub: "Bảo mật, chuyên nghiệp",
                  },
                ] as const
              ).map((p) => {
                const checked = platform === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPlatform(p.key)}
                    className={[
                      "flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
                      checked
                        ? "border-[color:var(--trust-blue)] bg-[color:var(--trust-blue)]/10"
                        : "border-[color:var(--innovation-sky)]/35 bg-white hover:bg-black/5",
                    ].join(" ")}
                  >
                    <PlatformIcon platform={p.key} />
                    <div className="min-w-0">
                      <div className="text-[12px] font-extrabold text-[color:var(--corporate-blue)]">
                        {p.name}
                      </div>
                      <div className="mt-1 text-[11px] font-semibold text-black/45">
                        {p.sub}
                      </div>
                      {checked ? (
                        <div className="mt-2 text-[11px] font-extrabold text-[color:var(--trust-blue)]">
                          ✓ Đã chọn
                        </div>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card title="Thông tin liên hệ">
            <div className="grid grid-cols-1 gap-4">
              <label className="space-y-1">
                <div className="text-[11px] font-semibold text-black/55">
                  Họ và tên <span className="text-red-500">*</span>
                </div>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập họ và tên của bạn"
                  className="h-10 w-full rounded-xl border border-[color:var(--innovation-sky)]/45 bg-[color:var(--calm-background)] px-3 text-[13px] text-[color:var(--corporate-blue)] outline-none placeholder:text-black/35 focus:border-[color:var(--innovation-sky)]"
                />
              </label>

              <label className="space-y-1">
                <div className="text-[11px] font-semibold text-black/55">
                  Email <span className="text-red-500">*</span>
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="h-10 w-full rounded-xl border border-[color:var(--innovation-sky)]/45 bg-[color:var(--calm-background)] px-3 text-[13px] text-[color:var(--corporate-blue)] outline-none placeholder:text-black/35 focus:border-[color:var(--innovation-sky)]"
                />
              </label>

              <label className="space-y-1">
                <div className="text-[11px] font-semibold text-black/55">
                  Số điện thoại <span className="text-red-500">*</span>
                </div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912345678"
                  className="h-10 w-full rounded-xl border border-[color:var(--innovation-sky)]/45 bg-[color:var(--calm-background)] px-3 text-[13px] text-[color:var(--corporate-blue)] outline-none placeholder:text-black/35 focus:border-[color:var(--innovation-sky)]"
                />
              </label>
            </div>
          </Card>

          <Card
            title="Phương thức thanh toán"
            right={
              <span className="rounded-full bg-[color:var(--calm-background)] px-3 py-1 text-[10px] font-extrabold text-[color:var(--trust-blue)] ring-1 ring-black/5">
                Phổ biến
              </span>
            }
          >
            <div className="space-y-3">
              {(
                [
                  { key: "momo", label: "Ví MoMo" },
                  { key: "zalopay", label: "ZaloPay" },
                  { key: "card", label: "Thẻ tín dụng / Ghi nợ" },
                ] as const
              ).map((m) => {
                const checked = method === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMethod(m.key)}
                    className={[
                      "flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left",
                      checked
                        ? "border-[color:var(--trust-blue)] bg-[color:var(--calm-background)]"
                        : "border-[color:var(--innovation-sky)]/35 bg-white hover:bg-black/5",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--calm-background)] text-[color:var(--corporate-blue)] ring-1 ring-black/5">
                        $
                      </div>
                      <div className="text-[12px] font-extrabold text-[color:var(--corporate-blue)]">
                        {m.label}
                      </div>
                    </div>
                    <RadioDot checked={checked} />
                  </button>
                );
              })}
            </div>
          </Card>

          <div className="rounded-2xl bg-white p-4 ring-1 ring-[color:var(--innovation-sky)]/25">
            <label className="flex items-start gap-3 text-[12px] font-semibold text-black/60">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[color:var(--trust-blue)]"
              />
              <span>
                Tôi đồng ý với{" "}
                <span className="text-[color:var(--trust-blue)]">
                  Chính sách bảo mật
                </span>{" "}
                và{" "}
                <span className="text-[color:var(--trust-blue)]">
                  Điều khoản sử dụng
                </span>{" "}
                của MindWell
              </span>
            </label>
          </div>
        </div>

        {/* Right column (summary) */}
        <aside className="lg:sticky lg:top-20 h-fit rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(27,73,101,0.10)] ring-1 ring-[color:var(--innovation-sky)]/30">
          <h2 className="text-[13px] font-extrabold text-[color:var(--corporate-blue)]">
            Tóm tắt đặt lịch
          </h2>

          <div className="mt-4 rounded-2xl border border-[color:var(--innovation-sky)]/25 p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-2xl bg-[color:var(--calm-background)] ring-1 ring-black/5">
                {expert?.avatarUrl ? (
                  <img
                    src={expert.avatarUrl}
                    alt={expert.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <div className="truncate text-[12px] font-extrabold text-[color:var(--corporate-blue)]">
                  {expert
                    ? `${expert.degreePrefix ?? ""} ${expert.name}`
                    : "Chuyên gia"}
                </div>
                <div className="truncate text-[11px] font-semibold text-[color:var(--trust-blue)]">
                  {expert?.title ?? ""}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-[11px] font-semibold text-black/55">
              <div className="flex items-center justify-between">
                <span>Nền tảng</span>
                <span className="text-[color:var(--corporate-blue)]">
                  {platform === "google_meet"
                    ? "Google Meet"
                    : platform === "zoom"
                    ? "Zoom"
                    : "Microsoft Teams"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Thời gian</span>
                <span className="text-[color:var(--corporate-blue)]">
                  {date || "—"} {slot ? `• ${slot}` : ""}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Phí tư vấn</span>
                <span className="text-[color:var(--corporate-blue)]">
                  {formatVnd(price)}
                </span>
              </div>
            </div>

            <div className="my-4 h-px bg-black/5" />

            <div className="flex items-end justify-between">
              <div className="text-[11px] font-semibold text-black/45">
                Tổng cộng
                <div className="text-[10px] text-black/35">
                  (chưa áp dụng voucher)
                </div>
              </div>
              <div className="text-[20px] font-extrabold text-[color:var(--corporate-blue)]">
                {formatVnd(price)}
              </div>
            </div>

            <button
              type="button"
              className="mt-4 w-full rounded-xl bg-[color:var(--trust-blue)] px-4 py-3 text-[12px] font-extrabold text-white hover:brightness-95 active:brightness-90"
            >
              Áp dụng voucher
            </button>

            <div className="mt-4 rounded-2xl bg-[color:var(--calm-background)] p-4 ring-1 ring-black/5">
              <div className="text-[12px] font-extrabold text-[color:var(--corporate-blue)]">
                Lưu ý trước buổi tư vấn
              </div>
              <ul className="mt-2 space-y-2 text-[11px] font-semibold text-black/55">
                <li>• Đến đúng giờ</li>
                <li>• Chuẩn bị trước nội dung muốn trao đổi</li>
                <li>• Môi trường yên tĩnh</li>
              </ul>
            </div>

            <div className="mt-4 rounded-2xl border border-[color:var(--innovation-sky)]/25 p-4 text-[11px] font-semibold text-black/55">
              Thông tin thanh toán được mã hoá và bảo mật theo tiêu chuẩn quốc
              tế.
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom fixed confirm bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-black/5 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="text-[12px] font-semibold text-black/50">
            {expert
              ? `${expert.degreePrefix ?? ""} ${expert.name}`
              : "Chuyên gia"}{" "}
            • {date || "—"} {slot ? `• ${slot}` : ""} •{" "}
            <span className="font-extrabold text-[color:var(--corporate-blue)]">
              {formatVnd(price)}
            </span>
          </div>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => {
              if (!canSubmit) return;
              // todo: call API create booking + payment
              setSuccessOpen(true);
            }}
            className={[
              "rounded-2xl px-6 py-3 text-[12px] font-extrabold shadow-sm",
              !canSubmit
                ? "bg-black/10 text-black/40"
                : "bg-[color:var(--trust-blue)] text-white hover:brightness-95 active:brightness-90",
            ].join(" ")}
          >
            Xác nhận &amp; Thanh toán
          </button>
        </div>
      </div>

      <SuccessModal
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          navigate("/");
        }}
        date={date}
        slot={slot}
        platform={platform}
      />
    </div>
  );
}
