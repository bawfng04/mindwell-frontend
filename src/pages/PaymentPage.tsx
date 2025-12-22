import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type {
  AppointmentCheckoutDto,
  CheckoutOptionsDto,
  InitiateAppointmentPaymentRequestDto,
} from "../types/api";

function isAbortError(e: unknown) {
  return (
    (typeof e === "object" &&
      e !== null &&
      "name" in e &&
      (e as any).name === "AbortError") ||
    false
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function formatDateLikeDesign(dateStr: string) {
  if (!dateStr) return "—";
  const dt = new Date(dateStr);
  if (Number.isNaN(dt.getTime())) return dateStr;

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

function formatTime(dateStr: string) {
  if (!dateStr) return "—";
  const dt = new Date(dateStr);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function PlatformIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  let label = "V";
  if (n.includes("google") || n.includes("meet")) label = "G";
  else if (n.includes("zoom")) label = "Z";
  else if (n.includes("team")) label = "T";

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--calm-background)] text-[color:var(--corporate-blue)] ring-1 ring-black/5">
      {label}
    </div>
  );
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
  checkout,
  platformName,
  joinUrl,
}: {
  open: boolean;
  onClose: () => void;
  checkout: AppointmentCheckoutDto | null;
  platformName: string;
  joinUrl?: string;
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

  if (!open || !checkout) return null;

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
                value={formatDateLikeDesign(checkout.startTime)}
              />
              <InfoRow
                icon="clock"
                label="Thời gian"
                value={`${formatTime(checkout.startTime)} - ${formatTime(
                  checkout.endTime
                )}`}
              />
              <InfoRow icon="video" label="Nền tảng" value={platformName} />
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

            {joinUrl && (
              <div className="mt-4 flex items-start gap-3">
                <RowIcon kind="link" />
                <div>
                  <div className="text-[14px] font-extrabold text-[color:var(--corporate-blue)]">
                    Link {platformName}
                  </div>
                  <div className="mt-1 text-[12px] font-semibold leading-6 text-black/50">
                    Link:{" "}
                    <a
                      href={joinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Nhấn để tham gia
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full rounded-2xl bg-[color:var(--trust-blue)] px-4 py-4 text-[14px] font-extrabold text-white shadow-sm hover:brightness-95 active:brightness-90"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---

export default function PaymentPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const apptId = Number(sp.get("apptId"));

  // API State
  const [checkout, setCheckout] = useState<AppointmentCheckoutDto | null>(null);
  const [options, setOptions] = useState<CheckoutOptionsDto | null>(null);

  // Selection State
  const [methodKey, setMethodKey] = useState<string>("mindpoints");
  const [serviceType, setServiceType] = useState<string>("video");
  const [platformId, setPlatformId] = useState<number | undefined>(undefined);

  // Form State
  const [contactFullName, setContactFullName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [agree, setAgree] = useState(true);

  // Status State
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [joinUrl, setJoinUrl] = useState<string | undefined>(undefined);

  const canPay = useMemo(() => {
    return Boolean(
      checkout &&
        options &&
        apptId &&
        platformId &&
        agree &&
        contactFullName &&
        contactEmail &&
        contactPhone
    );
  }, [
    checkout,
    options,
    apptId,
    platformId,
    agree,
    contactFullName,
    contactEmail,
    contactPhone,
  ]);

  useEffect(() => {
    if (!Number.isFinite(apptId) || apptId <= 0) return;

    const ac = new AbortController();

    (async () => {
      setErr(null);
      setLoading(true);

      try {
        const [opt, ck] = await Promise.all([
          api.checkout.getOptions({ signal: ac.signal }),
          api.checkout.getAppointmentCheckout(apptId, { signal: ac.signal }),
        ]);

        if (ac.signal.aborted) return;

        setOptions(opt);
        setCheckout(ck);

        const firstPlatform = opt.platforms.find((p) => p.isActive);
        if (firstPlatform) setPlatformId(firstPlatform.platformId);

        if (opt.serviceTypes.length > 0) setServiceType(opt.serviceTypes[0]);

        const firstMethod = opt.paymentMethods.find((m) => m.isActive);
        if (firstMethod) setMethodKey(firstMethod.methodKey);

        try {
          const profile = await api.users.me({ signal: ac.signal });
          if (ac.signal.aborted) return;

          setContactFullName(profile.fullName ?? "");
          setContactEmail(profile.email ?? "");
          setContactPhone(profile.phoneNumber ?? "");
        } catch (e) {
          // ignore abort + ignore not logged in
          if (ac.signal.aborted || isAbortError(e)) return;
        }
      } catch (e) {
        // ignore abort/cancel (dev StrictMode or navigating away)
        if (ac.signal.aborted || isAbortError(e)) return;

        setErr("Không tải được thông tin thanh toán. Vui lòng thử lại.");
      } finally {
        if (ac.signal.aborted) return;
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [apptId]);

  async function onPay() {
    if (!canPay) return;
    setPaying(true);
    setErr(null);

    const paymentWindow = window.open("", "_blank");

    if (paymentWindow) {
      paymentWindow.document.write(`
            <html>
                <head><title>Đang xử lý thanh toán...</title></head>
                <body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh;">
                    <div style="text-align: center;">
                        <h3>Đang kết nối tới cổng thanh toán...</h3>
                        <p>Vui lòng không tắt cửa sổ này.</p>
                    </div>
                </body>
            </html>
        `);
    }

    try {
      const body: InitiateAppointmentPaymentRequestDto = {
        methodKey,
        platformId,
        serviceType,
        contactFullName: contactFullName || undefined,
        contactEmail: contactEmail || undefined,
        contactPhone: contactPhone || undefined,
      };

      const res = await api.checkout.payAppointment(apptId, body);

      if (res.redirectUrl) {
        if (paymentWindow) {
          paymentWindow.location.href = res.redirectUrl;
        } else {
          // Fallback nếu tab đầu tiên fail
          window.open(res.redirectUrl, "_blank");
        }
        return;
      }
      if (paymentWindow) paymentWindow.close();

      try {
        const conf = await api.checkout.confirmation(apptId);
        setJoinUrl(conf.meetingJoinUrl);
        setSuccessOpen(true);
      } catch {
        setSuccessOpen(true);
      }
    } catch {
      // Có lỗi thì đóng tab thừa
      if (paymentWindow) paymentWindow.close();
      setErr("Thanh toán thất bại. Vui lòng kiểm tra lại số dư hoặc kết nối.");
    } finally {
      setPaying(false);
    }
  }

  if (!apptId)
    return <div className="p-10 text-center">Đường dẫn không hợp lệ.</div>;
  if (loading)
    return (
      <div className="p-10 text-center text-[color:var(--trust-blue)] font-semibold">
        Đang tải thông tin thanh toán...
      </div>
    );
  if (err || !checkout || !options) {
    return (
      <div className="p-10 text-center">
        <div className="text-red-500 font-bold mb-2">
          {err || "Lỗi dữ liệu"}
        </div>
        <Link
          to="/chuyen-gia"
          className="text-[color:var(--trust-blue)] hover:underline"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const selectedPlatformName =
    options.platforms.find((p) => p.platformId === platformId)?.displayName ||
    "Video Call";

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
            {checkout.expertName}
          </span>
        </h1>

        <p className="mt-2 text-[12px] font-semibold text-black/50">
          Chọn nền tảng và hoàn tất thanh toán
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left column */}
        <div className="space-y-6">
          <div>
            <Link
              to={`/chuyen-gia/${checkout.expertId}`}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--innovation-sky)]/45 bg-white px-4 py-2 text-[12px] font-semibold text-[color:var(--corporate-blue)] hover:bg-black/5"
            >
              ‹ Quay lại
            </Link>
          </div>

          {/* Platform Selection */}
          <Card
            title="Chọn nền tảng tư vấn"
            right={
              <div className="text-[11px] font-semibold text-black/45">
                Link tham gia sẽ được gửi qua email
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {options.platforms
                .filter((p) => p.isActive)
                .map((p) => {
                  const checked = platformId === p.platformId;
                  return (
                    <button
                      key={p.platformId}
                      type="button"
                      onClick={() => setPlatformId(p.platformId)}
                      className={[
                        "flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
                        checked
                          ? "border-[color:var(--trust-blue)] bg-[color:var(--trust-blue)]/10"
                          : "border-[color:var(--innovation-sky)]/35 bg-white hover:bg-black/5",
                      ].join(" ")}
                    >
                      <PlatformIcon name={p.displayName} />
                      <div className="min-w-0">
                        <div className="text-[12px] font-extrabold text-[color:var(--corporate-blue)]">
                          {p.displayName}
                        </div>
                        {checked ? (
                          <div className="mt-1 text-[11px] font-extrabold text-[color:var(--trust-blue)]">
                            ✓ Đã chọn
                          </div>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
            </div>
          </Card>

          {/* Contact Info */}
          <Card title="Thông tin liên hệ">
            <div className="grid grid-cols-1 gap-4">
              <label className="space-y-1">
                <div className="text-[11px] font-semibold text-black/55">
                  Họ và tên <span className="text-red-500">*</span>
                </div>
                <input
                  value={contactFullName}
                  onChange={(e) => setContactFullName(e.target.value)}
                  placeholder="Nhập họ và tên của bạn"
                  className="h-10 w-full rounded-xl border border-[color:var(--innovation-sky)]/45 bg-[color:var(--calm-background)] px-3 text-[13px] text-[color:var(--corporate-blue)] outline-none placeholder:text-black/35 focus:border-[color:var(--innovation-sky)]"
                />
              </label>

              <label className="space-y-1">
                <div className="text-[11px] font-semibold text-black/55">
                  Email <span className="text-red-500">*</span>
                </div>
                <input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="h-10 w-full rounded-xl border border-[color:var(--innovation-sky)]/45 bg-[color:var(--calm-background)] px-3 text-[13px] text-[color:var(--corporate-blue)] outline-none placeholder:text-black/35 focus:border-[color:var(--innovation-sky)]"
                />
              </label>

              <label className="space-y-1">
                <div className="text-[11px] font-semibold text-black/55">
                  Số điện thoại <span className="text-red-500">*</span>
                </div>
                <input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="0912345678"
                  className="h-10 w-full rounded-xl border border-[color:var(--innovation-sky)]/45 bg-[color:var(--calm-background)] px-3 text-[13px] text-[color:var(--corporate-blue)] outline-none placeholder:text-black/35 focus:border-[color:var(--innovation-sky)]"
                />
              </label>
            </div>
          </Card>

          {/* Payment Method */}
          <Card
            title="Phương thức thanh toán"
            right={
              <div className="text-[11px] font-semibold text-black/45">
                Số dư:{" "}
                <span className="text-[color:var(--corporate-blue)] font-bold">
                  {formatCurrency(checkout.userMindpointsBalance)} Point
                </span>
              </div>
            }
          >
            <div className="space-y-3">
              {options.paymentMethods
                .filter((m) => m.isActive)
                .map((m) => {
                  const checked = methodKey === m.methodKey;
                  return (
                    <button
                      key={m.methodKey}
                      type="button"
                      onClick={() => setMethodKey(m.methodKey)}
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
                          {m.displayName}
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
                {/* Fallback avatar logic */}
                <div className="flex h-full w-full items-center justify-center font-bold text-[color:var(--corporate-blue)]">
                  {checkout.expertName.charAt(0)}
                </div>
              </div>
              <div className="min-w-0">
                <div className="truncate text-[12px] font-extrabold text-[color:var(--corporate-blue)]">
                  {checkout.expertName}
                </div>
                <div className="truncate text-[11px] font-semibold text-[color:var(--trust-blue)]">
                  Chuyên gia
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-[11px] font-semibold text-black/55">
              <div className="flex items-center justify-between">
                <span>Nền tảng</span>
                <span className="text-[color:var(--corporate-blue)]">
                  {selectedPlatformName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Thời gian</span>
                <span className="text-[color:var(--corporate-blue)]">
                  {formatDateLikeDesign(checkout.startTime)}
                </span>
              </div>
              <div className="text-right text-[color:var(--corporate-blue)]">
                {formatTime(checkout.startTime)} -{" "}
                {formatTime(checkout.endTime)}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span>Phí tư vấn</span>
                <span className="text-[color:var(--corporate-blue)]">
                  {formatCurrency(checkout.totalAmountPoints)} Point
                </span>
              </div>
            </div>

            <div className="my-4 h-px bg-black/5" />

            <div className="flex items-end justify-between">
              <div className="text-[11px] font-semibold text-black/45">
                Tổng thanh toán
              </div>
              <div className="text-[20px] font-extrabold text-[color:var(--corporate-blue)]">
                {formatCurrency(checkout.totalAmountPoints)}{" "}
                <span className="text-sm">Point</span>
              </div>
            </div>

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

            {err && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-[11px] font-semibold text-red-600 text-center">
                {err}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Bottom fixed confirm bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-black/5 bg-white/95 backdrop-blur z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="hidden sm:block text-[12px] font-semibold text-black/50">
            {checkout.expertName} • {formatDateLikeDesign(checkout.startTime)} •{" "}
            <span className="font-extrabold text-[color:var(--corporate-blue)]">
              {formatCurrency(checkout.totalAmountPoints)} Point
            </span>
          </div>

          <button
            type="button"
            disabled={!canPay || paying}
            onClick={onPay}
            className={[
              "rounded-2xl px-6 py-3 text-[12px] font-extrabold shadow-sm ml-auto sm:ml-0",
              !canPay || paying
                ? "bg-black/10 text-black/40 cursor-not-allowed"
                : "bg-[color:var(--trust-blue)] text-white hover:brightness-95 active:brightness-90",
            ].join(" ")}
          >
            {paying ? "Đang xử lý..." : "Xác nhận & Thanh toán"}
          </button>
        </div>
      </div>

      <SuccessModal
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          navigate("/");
        }}
        checkout={checkout}
        platformName={selectedPlatformName}
        joinUrl={joinUrl}
      />
    </div>
  );
}