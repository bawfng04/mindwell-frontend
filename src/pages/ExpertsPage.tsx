import { useMemo, useState } from "react";
import { EXPERTS } from "../services/experts";
import { Link } from "react-router-dom";
import type { Expert, ExpertGender } from "../types/expert";

type PriceFilter = "Tất cả" | "<= 250k" | "250k - 300k" | ">= 300k";

function formatVnd(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
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

function CheckBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-[color:var(--corporate-blue)] ring-1 ring-black/5">
      <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--innovation-sky)]" />
      Đã xác minh
    </span>
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

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm6.2-1.3L21 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 6h16M7 12h10M10 18h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts.at(-1)?.[0] ?? "";
  return (a + b).toUpperCase();
}

function ExpertCard({ expert }: { expert: Expert }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(27,73,101,0.10)] ring-1 ring-[color:var(--innovation-sky)]/35">
      <div className="relative aspect-[16/9] bg-gradient-to-br from-[color:var(--innovation-sky)]/20 to-[color:var(--trust-blue)]/15">
        {expert.avatarUrl ? (
          <img
            src={expert.avatarUrl}
            alt={`${expert.degreePrefix ?? ""} ${expert.name}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/70 text-xl font-bold text-[color:var(--corporate-blue)] ring-1 ring-black/5">
              {initials(expert.name)}
            </div>
          </div>
        )}

        {/* Rating */}
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-[color:var(--corporate-blue)] ring-1 ring-black/5">
          <span className="text-amber-500">
            <StarIcon />
          </span>
          {expert.rating.toFixed(1)}
        </div>

        {/* Verified */}
        <div className="absolute right-3 top-3">
          {expert.verified ? <CheckBadge /> : null}
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-1">
          <h3 className="text-[15px] font-bold text-[color:var(--corporate-blue)]">
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
            <div className="text-[15px] font-bold text-[color:var(--corporate-blue)]">
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
            className="flex-1 rounded-full border border-[color:var(--innovation-sky)]/60 bg-white px-4 py-2 text-center text-[12px] font-semibold text-[color:var(--corporate-blue)] hover:bg-black/5"
          >
            Xem hồ sơ
          </Link>

          <Link
            to={`/chuyen-gia/${expert.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--trust-blue)] px-4 py-2 text-[12px] font-semibold text-white hover:brightness-95 active:brightness-90"
          >
            <CalendarIcon />
            Đặt lịch
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ExpertsPage() {
  const [q, setQ] = useState("");
  const [specialty, setSpecialty] = useState<string>("Tất cả");
  const [price, setPrice] = useState<PriceFilter>("Tất cả");
  const [gender, setGender] = useState<ExpertGender | "Tất cả">("Tất cả");
  const [language, setLanguage] = useState<string>("Tất cả");

  const specialties = useMemo(() => {
    const set = new Set(EXPERTS.map((e) => e.specialty));
    return ["Tất cả", ...Array.from(set)];
  }, []);

  const languages = useMemo(() => {
    const set = new Set(EXPERTS.flatMap((e) => e.languages));
    return ["Tất cả", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();

    return EXPERTS.filter((e) => {
      const matchesQ =
        !needle ||
        `${e.degreePrefix ?? ""} ${e.name} ${e.title} ${e.specialty}`
          .toLowerCase()
          .includes(needle);

      const matchesSpecialty =
        specialty === "Tất cả" || e.specialty === specialty;

      const matchesGender = gender === "Tất cả" || e.gender === gender;

      const matchesLanguage =
        language === "Tất cả" || e.languages.includes(language);

      const matchesPrice =
        price === "Tất cả" ||
        (price === "<= 250k" && e.pricePerSessionVnd <= 250_000) ||
        (price === "250k - 300k" &&
          e.pricePerSessionVnd >= 250_000 &&
          e.pricePerSessionVnd <= 300_000) ||
        (price === ">= 300k" && e.pricePerSessionVnd >= 300_000);

      return (
        matchesQ &&
        matchesSpecialty &&
        matchesGender &&
        matchesLanguage &&
        matchesPrice
      );
    });
  }, [q, specialty, price, gender, language]);

  return (
    <section>
      <div className="space-y-1">
        <h1 className="text-[15px] font-bold text-[color:var(--corporate-blue)]">
          Danh sách chuyên gia
        </h1>
        <p className="text-[12px] text-[color:var(--trust-blue)]/80">
          Tìm chuyên gia phù hợp với nhu cầu của bạn
        </p>
      </div>

      {/* Search row */}
      <div className="mt-4 flex items-center gap-3">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--trust-blue)]/60">
            <SearchIcon />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm kiếm theo tên, chuyên môn..."
            className="h-10 w-full rounded-xl border border-[color:var(--innovation-sky)]/45 bg-white pl-10 pr-3 text-[13px] text-[color:var(--corporate-blue)] outline-none placeholder:text-black/35 focus:border-[color:var(--innovation-sky)]"
          />
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[color:var(--innovation-sky)]/45 bg-white px-3 text-[12px] font-semibold text-[color:var(--corporate-blue)] hover:bg-black/5"
        >
          <FilterIcon />
          Bộ lọc
        </button>
      </div>

      {/* Filters */}
      <div className="mt-4 rounded-xl border border-[color:var(--innovation-sky)]/35 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          <label className="space-y-1">
            <div className="text-[11px] font-semibold text-black/55">
              Chuyên môn
            </div>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="h-10 w-full rounded-xl border border-[color:var(--innovation-sky)]/45 bg-white px-3 text-[13px] text-[color:var(--corporate-blue)] outline-none"
            >
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <div className="text-[11px] font-semibold text-black/55">
              Mức giá
            </div>
            <select
              value={price}
              onChange={(e) => setPrice(e.target.value as PriceFilter)}
              className="h-10 w-full rounded-xl border border-[color:var(--innovation-sky)]/45 bg-white px-3 text-[13px] text-[color:var(--corporate-blue)] outline-none"
            >
              {(["Tất cả", "<= 250k", "250k - 300k", ">= 300k"] as const).map(
                (p) => (
                  <option key={p} value={p}>
                    {p === "Tất cả" ? "Tất cả" : p}
                  </option>
                )
              )}
            </select>
          </label>

          <label className="space-y-1">
            <div className="text-[11px] font-semibold text-black/55">
              Giới tính
            </div>
            <select
              value={gender}
              onChange={(e) =>
                setGender(e.target.value as ExpertGender | "Tất cả")
              }
              className="h-10 w-full rounded-xl border border-[color:var(--innovation-sky)]/45 bg-white px-3 text-[13px] text-[color:var(--corporate-blue)] outline-none"
            >
              {(["Tất cả", "Nam", "Nữ", "Khác"] as const).map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <div className="text-[11px] font-semibold text-black/55">
              Ngôn ngữ
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="h-10 w-full rounded-xl border border-[color:var(--innovation-sky)]/45 bg-white px-3 text-[13px] text-[color:var(--corporate-blue)] outline-none"
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <div className="text-[11px] font-semibold text-black/55">
              Lịch trống
            </div>
            <select
              value="Tất cả"
              onChange={() => {
                /* placeholder giống UI */
              }}
              className="h-10 w-full rounded-xl border border-[color:var(--innovation-sky)]/45 bg-white px-3 text-[13px] text-[color:var(--corporate-blue)] outline-none"
            >
              <option value="Tất cả">Tất cả</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-4 text-[12px] font-semibold text-black/45">
        Tìm thấy:{" "}
        <span className="text-[color:var(--corporate-blue)]">
          {filtered.length}
        </span>{" "}
        chuyên gia
      </div>

      <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
        {filtered.map((e) => (
          <ExpertCard key={e.id} expert={e} />
        ))}
      </div>
    </section>
  );
}
