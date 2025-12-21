import { Link } from "react-router-dom";
import logo from "../assets/mindwell-bgred.png";

// function LogoMark() {
//   return (
//     <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/15">
//       <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
//         <path
//           d="M12 2s6 6.1 6 11.2A6 6 0 1 1 6 13.2C6 8.1 12 2 12 2Z"
//           fill="none"
//           stroke="white"
//           strokeWidth="1.8"
//           strokeLinejoin="round"
//         />
//       </svg>
//     </div>
//   );
// }

function SocialIcon({ kind }: { kind: "facebook" | "instagram" | "linkedin" }) {
  const path =
    kind === "facebook" ? (
      <path
        d="M14 8h2V5h-2c-2 0-3.5 1.5-3.5 3.6V11H8v3h2.5v7H14v-7h2.5l.7-3H14V9.1c0-.6.3-1.1 1-1.1Z"
        fill="currentColor"
      />
    ) : kind === "instagram" ? (
      <>
        <path
          d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M12 16a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M17.5 6.6h.01"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </>
    ) : (
      <path
        d="M6 9h3v9H6V9Zm1.5-1.3A1.7 1.7 0 1 0 7.5 4.3a1.7 1.7 0 0 0 0 3.4ZM11 9h2.9v1.3h.1c.4-.7 1.4-1.5 3-1.5 3.2 0 3.8 2.1 3.8 4.9V18h-3v-3.7c0-.9 0-2.1-1.3-2.1s-1.5 1-1.5 2V18h-3V9Z"
        fill="currentColor"
      />
    );

  return (
    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white/85 ring-1 ring-white/15 hover:bg-white/15">
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        {path}
      </svg>
    </span>
  );
}

function RowIcon({ kind }: { kind: "mail" | "phone" | "pin" }) {
  const icon =
    kind === "mail" ? (
      <path
        d="M4 6h16v12H4V6Zm0 1 8 6 8-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : kind === "phone" ? (
      <path
        d="M8 3h3l1 5-2 1c1 3 3 5 6 6l1-2 5 1v3c0 1-1 2-2 2C10 21 3 14 3 5c0-1 1-2 2-2h3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M12 22s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    );

  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white/85 ring-1 ring-white/15">
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        {icon}
      </svg>
    </span>
  );
}

function Heart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21s-7.5-4.7-9.6-9.2C.8 8.2 3.2 5 6.6 5c1.9 0 3.3 1 4.2 2.2C11.7 6 13.1 5 15 5c3.4 0 5.8 3.2 4.2 6.8C19.5 16.3 12 21 12 21Z"
        fill="#ef4444"
      />
    </svg>
  );
}

const linkCls = "text-[15px] font-medium text-white/70 hover:text-white";

export default function Footer() {
  return (
    <footer className="mt-12 bg-[color:var(--corporate-blue)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="MindWell Logo"
                className="h-7 w-7 object-contain"
              />
              <div className="text-2xl font-extrabold tracking-tight">
                MindWell
              </div>
            </div>

            <p className="mt-6 max-w-sm text-[16px] font-medium leading-8 text-white/70">
              Nền tảng tư vấn sức khỏe tinh thần trực tuyến hàng đầu Việt Nam.
              Chăm sóc tâm trí, mọi lúc, mọi nơi.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://www.facebook.com/bawfng04"
                className="inline-flex"
                aria-label="Facebook"
              >
                <SocialIcon kind="facebook" />
              </a>
              <a
                href="https://www.instagram.com/bawfng04/"
                className="inline-flex"
                aria-label="Instagram"
              >
                <SocialIcon kind="instagram" />
              </a>
              <a
                href="https://www.linkedin.com/in/bawfng04/"
                className="inline-flex"
                aria-label="LinkedIn"
              >
                <SocialIcon kind="linkedin" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div className="text-xl font-extrabold">Liên kết nhanh</div>
            <ul className="mt-6 space-y-4">
              <li>
                <Link className={linkCls} to="/">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link className={linkCls} to="/chuyen-gia">
                  Danh sách chuyên gia
                </Link>
              </li>
              <li>
                <Link className={linkCls} to="/mindpoints">
                  Gói Premium
                </Link>
              </li>
              <li>
                <Link className={linkCls} to="/blog">
                  Blog
                </Link>
              </li>
              <li>
                <a className={linkCls} href="#">
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <div className="text-xl font-extrabold">Hỗ trợ</div>
            <ul className="mt-6 space-y-4">
              <li>
                <a className={linkCls} href="#">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a className={linkCls} href="#">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a className={linkCls} href="#">
                  Quy trình bảo mật
                </a>
              </li>
              <li>
                <a className={linkCls} href="#">
                  Hướng dẫn sử dụng
                </a>
              </li>
              <li>
                <a className={linkCls} href="#">
                  Trợ giúp
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-xl font-extrabold">Liên hệ</div>
            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-4">
                <RowIcon kind="mail" />
                <div className="text-[16px] font-medium text-white/75">
                  support@mindwell.vn
                </div>
              </div>

              <div className="flex items-center gap-4">
                <RowIcon kind="phone" />
                <div className="text-[16px] font-medium text-white/75">
                  (+84) 901 236 608
                </div>
              </div>

              <div className="flex items-center gap-4">
                <RowIcon kind="pin" />
                <div className="text-[16px] font-medium text-white/75">
                  CSE - HCMUT
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 h-px bg-white/10" />

        <div className="mt-8 flex flex-col gap-4 text-[16px] font-medium text-white/60 md:flex-row md:items-center md:justify-between">
          <div>© 2025 MindWell. Chưa đăng ký bản quyền.</div>
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <Heart />
            <span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
