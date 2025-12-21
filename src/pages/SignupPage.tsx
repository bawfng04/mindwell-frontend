import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import phd from "../assets/res-placeholder.png";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9.7 5.1A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a17.5 17.5 0 0 1-3.5 4.6M6.2 6.2C3.3 8.3 2 12 2 12s3.6 7 10 7c1 0 2-.2 3-.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 11V8a5 5 0 0 1 10 0v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 11h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 6h16v12H4V6Zm0 1 8 6 8-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4 21a8 8 0 0 1 16 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Field({
  label,
  required,
  icon,
  right,
  ...inputProps
}: {
  label: string;
  required?: boolean;
  icon: React.ReactNode;
  right?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-extrabold text-[color:var(--corporate-blue)]">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </div>

      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--trust-blue)]/65">
          {icon}
        </span>

        <input
          {...inputProps}
          className={[
            "h-11 w-full rounded-2xl border bg-white px-11 pr-12 text-[13px] font-semibold text-[color:var(--corporate-blue)] outline-none",
            "border-[color:var(--innovation-sky)]/45 focus:border-[color:var(--innovation-sky)]",
            "placeholder:text-black/30",
          ].join(" ")}
        />

        {right ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {right}
          </span>
        ) : null}
      </div>
    </label>
  );
}

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const emailOk = useMemo(() => {
    const v = email.trim();
    if (!v) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }, [email]);

  const pwOk = pw.length >= 6;
  const pwMatch = pw && pw2 && pw === pw2;

  const canSubmit = fullName.trim() && emailOk && pwOk && pwMatch;

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(27,73,101,0.20)] ring-1 ring-[color:var(--innovation-sky)]/25">
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
        {/* Left panel */}
        <div className="relative min-h-[280px] bg-[color:var(--trust-blue)] md:min-h-[560px]">
          {/* image */}
          <img
            src={phd}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden="true"
          />

          {/* blue overlay (tint) */}
          <div
            className="absolute inset-0 bg-[color:var(--trust-blue)]/70"
            aria-hidden="true"
          />

          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.10),transparent_45%),linear-gradient(180deg,rgba(0,0,0,0.10),rgba(0,0,0,0.35))]"
            aria-hidden="true"
          />

          <div className="relative flex h-full items-center justify-center p-8 text-center md:justify-start md:text-left">
            <div className="max-w-md">
              <div className="text-[25px] font-extrabold text-white">
                Chào mừng đến với MindWell
              </div>
              <div className="mt-2 text-[19px] font-semibold leading-6 text-white/80">
                Bắt đầu hành trình chăm sóc sức khỏe tinh thần của bạn ngay hôm
                nay
              </div>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="p-7 md:p-8">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-[color:var(--corporate-blue)]">
              Đăng ký
            </h1>
            <p className="mt-2 text-[12px] font-semibold text-black/45">
              Tạo tài khoản để bắt đầu
            </p>
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!canSubmit) return;
              // TODO: integrate API register
              alert("Đăng ký thành công (mock).");
            }}
          >
            <Field
              label="Họ và tên"
              required
              icon={<UserIcon />}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ và tên"
              autoComplete="name"
            />

            <Field
              label="Email"
              required
              icon={<MailIcon />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              autoComplete="email"
              inputMode="email"
            />
            {!emailOk && email ? (
              <div className="text-[11px] font-semibold text-red-500">
                Email không hợp lệ.
              </div>
            ) : null}

            <Field
              label="Mật khẩu"
              required
              icon={<LockIcon />}
              type={showPw ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Nhập mật khẩu"
              autoComplete="new-password"
              right={
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 text-black/55 hover:bg-black/10"
                  aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  <EyeIcon open={showPw} />
                </button>
              }
            />
            {!pwOk && pw ? (
              <div className="text-[11px] font-semibold text-red-500">
                Mật khẩu tối thiểu 6 ký tự.
              </div>
            ) : null}

            <Field
              label="Xác nhận mật khẩu"
              required
              icon={<LockIcon />}
              type={showPw2 ? "text" : "password"}
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
              right={
                <button
                  type="button"
                  onClick={() => setShowPw2((v) => !v)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 text-black/55 hover:bg-black/10"
                  aria-label={showPw2 ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  <EyeIcon open={showPw2} />
                </button>
              }
            />
            {pw2 && !pwMatch ? (
              <div className="text-[11px] font-semibold text-red-500">
                Mật khẩu xác nhận không khớp.
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit}
              className={[
                "mt-2 w-full rounded-2xl px-4 py-3 text-[13px] font-extrabold shadow-sm transition-colors",
                canSubmit
                  ? "bg-[color:var(--trust-blue)] text-white hover:brightness-95 active:brightness-90"
                  : "bg-black/10 text-black/40",
              ].join(" ")}
            >
              Đăng ký
            </button>

            <div className="mt-3 text-center text-[12px] font-semibold text-black/45">
              Đã có tài khoản?{" "}
              <Link to="/dang-nhap" className="text-[color:var(--trust-blue)]">
                Đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
