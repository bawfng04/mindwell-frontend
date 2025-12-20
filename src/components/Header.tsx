import { NavLink } from "react-router-dom";

const LogoMark = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--calm-background)] ring-1 ring-black/5">
    <svg width="18" height="22" viewBox="0 0 18 22" aria-hidden="true">
      <path
        d="M9 1C6.5 4.6 3 8.4 3 12.5 3 16.6 5.7 20 9 20s6-3.4 6-7.5C15 8.4 11.5 4.6 9 1Z"
        fill="none"
        stroke="var(--trust-blue)"
        strokeWidth="1.8"
      />
      <path
        d="M6.2 13.2c.2 1.9 1.5 3.3 3.4 3.6"
        fill="none"
        stroke="var(--innovation-sky)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

const QuizIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M8 7h8M8 12h5M7 21h10a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const CoinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 21c4.4 0 8-3.1 8-7s-3.6-7-8-7-8 3.1-8 7 3.6 7 8 7Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M12 9v8m-3-6h6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M8 6.3C9.2 4.9 10.8 4 12.5 4c1.4 0 2.8.5 4 1.4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm7 9a7 7 0 0 0-14 0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const navLinkBase =
  "px-3 py-2 rounded-full text-sm font-medium transition-colors";
const navLinkInactive = "text-[color:var(--corporate-blue)] hover:bg-black/5";
const navLinkActive = "text-white bg-[color:var(--trust-blue)] shadow-sm";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <LogoMark />
          <div className="leading-tight">
            <div className="text-lg font-semibold tracking-tight text-[color:var(--corporate-blue)]">
              MindWell
            </div>
            <div className="text-[11px] uppercase tracking-wide text-black/45">
              Wellness Platform
            </div>
          </div>
        </div>

        {/* Center: Nav */}
        <nav className="hidden items-center gap-2 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
            end
          >
            Trang chủ
          </NavLink>

          <NavLink
            to="/chuyen-gia"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
          >
            Chuyên gia
          </NavLink>

          <NavLink
            to="/mindpoints"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
          >
            MindPoints &amp; Gói Premium
          </NavLink>

          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
          >
            Blog
          </NavLink>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <NavLink
            to="/trac-nghiem"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--trust-blue)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-95 active:brightness-90"
          >
            <QuizIcon />
            Trắc nghiệm
          </NavLink>

          <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[color:var(--innovation-sky)]/60 bg-white px-3 py-2 text-sm font-semibold text-[color:var(--corporate-blue)]">
            <span className="text-[color:var(--trust-blue)]">
              <CoinIcon />
            </span>
            <span>2,450</span>
            <span className="font-medium text-black/45">điểm</span>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-[color:var(--corporate-blue)] hover:bg-black/5"
            aria-label="Tài khoản"
          >
            <UserIcon />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="border-t border-black/5 md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${navLinkBase} whitespace-nowrap ${
                isActive ? navLinkActive : navLinkInactive
              }`
            }
            end
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/chuyen-gia"
            className={({ isActive }) =>
              `${navLinkBase} whitespace-nowrap ${
                isActive ? navLinkActive : navLinkInactive
              }`
            }
          >
            Chuyên gia
          </NavLink>
          <NavLink
            to="/mindpoints"
            className={({ isActive }) =>
              `${navLinkBase} whitespace-nowrap ${
                isActive ? navLinkActive : navLinkInactive
              }`
            }
          >
            MindPoints &amp; Gói Premium
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `${navLinkBase} whitespace-nowrap ${
                isActive ? navLinkActive : navLinkInactive
              }`
            }
          >
            Blog
          </NavLink>
        </div>
      </div>
    </header>
  );
}
