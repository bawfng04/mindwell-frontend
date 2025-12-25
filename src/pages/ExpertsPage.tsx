// mindwell-frontend/src/pages/ExpertsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type {
  ExpertCardDto,
  ExpertFilterOptionsDto,
  LanguageOption,
  SpecializationOption,
} from "../types/api";
import Seo from "../components/Seo";

type PriceFilter = "Tất cả" | "<= 250k" | "250k - 300k" | ">= 300k";
type GenderFilter = "Tất cả" | "male" | "female" | "other";

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

function isAbortError(e: unknown) {
  return (
    (typeof e === "object" &&
      e !== null &&
      "name" in e &&
      (e as any).name === "AbortError") ||
    false
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts.at(-1)?.[0] ?? "";
  return (a + b).toUpperCase();
}

function mapPriceToRateRange(price: PriceFilter): {
  minRate?: number;
  maxRate?: number;
} {
  if (price === "<= 250k") return { maxRate: 250_000 };
  if (price === "250k - 300k") return { minRate: 250_000, maxRate: 300_000 };
  if (price === ">= 300k") return { minRate: 300_000 };
  return {};
}

function genderLabel(g: string) {
  if (g === "male") return "Nam";
  if (g === "female") return "Nữ";
  if (g === "other") return "Khác";
  return g;
}

function ExpertCard({ expert }: { expert: ExpertCardDto }) {
  const spec = expert.specializations?.[0]?.name ?? "Chưa cập nhật";
  const langs = (expert.languages ?? []).map((l) => l.name).join(", ");

  return (
    <>
      <Seo
        title={`Đặt lịch với ${expert.fullName} - MindWell`}
        description={`Đặt lịch tư vấn với chuyên gia ${expert.fullName}, ${expert.title} trên MindWell.`}
        canonicalPath={`/chuyen-gia/${expert.expertId}`}
        ogType="website"
      />
      <article className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(27,73,101,0.10)] ring-1 ring-[color:var(--innovation-sky)]/35">
        <div className="relative aspect-[16/9] bg-gradient-to-br from-[color:var(--innovation-sky)]/20 to-[color:var(--trust-blue)]/15">
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/70 text-xl font-bold text-[color:var(--corporate-blue)] ring-1 ring-black/5">
              {initials(expert.fullName)}
            </div>
          </div>

          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-[color:var(--corporate-blue)] ring-1 ring-black/5">
            <span className="text-amber-500">
              <StarIcon />
            </span>
            {Number.isFinite(expert.avgRating)
              ? expert.avgRating.toFixed(1)
              : "0.0"}
          </div>

          <div className="absolute right-3 top-3">
            {expert.isVerified ? <CheckBadge /> : null}
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-1">
            <h3 className="text-[15px] font-bold text-[color:var(--corporate-blue)]">
              {expert.fullName}
            </h3>
            <p className="text-[12px] font-semibold text-[color:var(--trust-blue)]">
              {expert.title}
            </p>
            <p className="text-[12px] text-black/55">{spec}</p>
            {langs ? (
              <p className="text-[11px] text-black/45">Ngôn ngữ: {langs}</p>
            ) : null}
          </div>

          <div className="mt-3 flex items-end justify-between">
            <div className="leading-tight">
              <div className="text-[15px] font-bold text-[color:var(--corporate-blue)]">
                {formatVnd(expert.hourlyRate)}
                <span className="text-[11px] font-semibold text-black/45">
                  {" "}
                  /giờ
                </span>
              </div>
            </div>

            <div className="text-[11px] font-semibold text-black/45">
              {expert.reviewCount} đánh giá
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Link
              to={`/chuyen-gia/${expert.expertId}`}
              className="flex-1 rounded-full border border-[color:var(--innovation-sky)]/60 bg-white px-4 py-2 text-center text-[12px] font-semibold text-[color:var(--corporate-blue)] hover:bg-black/5"
            >
              Xem hồ sơ
            </Link>

            <Link
              to={`/chuyen-gia/${expert.expertId}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--trust-blue)] px-4 py-2 text-[12px] font-semibold text-white hover:brightness-95 active:brightness-90"
            >
              <CalendarIcon />
              Đặt lịch
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

export default function ExpertsPage() {
  // search + filters
  const [q, setQ] = useState("");
  const [specializationId, setSpecializationId] = useState<number | "Tất cả">(
    "Tất cả"
  );
  const [languageCode, setLanguageCode] = useState<string | "Tất cả">("Tất cả");
  const [gender, setGender] = useState<GenderFilter>("Tất cả");
  const [price, setPrice] = useState<PriceFilter>("Tất cả");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // paging
  const [page, setPage] = useState(0);
  const size = 12;

  // remote filter options
  const [filterOptions, setFilterOptions] =
    useState<ExpertFilterOptionsDto | null>(null);

  // data
  const [items, setItems] = useState<ExpertCardDto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const specializations: SpecializationOption[] = useMemo(
    () => filterOptions?.specializations ?? [],
    [filterOptions]
  );

  const languages: LanguageOption[] = useMemo(
    () => filterOptions?.languages ?? [],
    [filterOptions]
  );

  const genders = useMemo(
    () => filterOptions?.genders ?? ["male", "female", "other"],
    [filterOptions]
  );

  // load filter options once
  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        const opt = await api.experts.getFilterOptions({ signal: ac.signal });
        if (ac.signal.aborted) return;
        setFilterOptions(opt);
      } catch (e) {
        if (ac.signal.aborted || isAbortError(e)) return;
      }
    })();

    return () => ac.abort();
  }, []);

  // reset page when filters/search change
  useEffect(() => {
    setPage(0);
  }, [q, specializationId, languageCode, gender, price, verifiedOnly]);

  // load experts
  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      setErr(null);
      setLoading(true);

      try {
        const { minRate, maxRate } = mapPriceToRateRange(price);

        const res = await api.experts.listExperts(
          {
            q: q.trim() || undefined,
            specializationIds:
              specializationId === "Tất cả" ? undefined : [specializationId],
            languageCodes:
              languageCode === "Tất cả" ? undefined : [languageCode],
            gender: gender === "Tất cả" ? undefined : gender,
            verified: verifiedOnly ? true : undefined,
            minRate,
            maxRate,
            page,
            size,
          },
          { signal: ac.signal }
        );

        if (ac.signal.aborted) return;

        setItems(res.items ?? []);
        setTotalPages(res.totalPages ?? 1);
        setTotalItems(res.totalItems ?? 0);
      } catch (e) {
        // ignore abort/cancel (dev StrictMode or navigating away)
        if (ac.signal.aborted || isAbortError(e)) return;

        setErr("Không tải được danh sách chuyên gia. Kiểm tra backend/proxy.");
        setItems([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        if (ac.signal.aborted) return;
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [q, specializationId, languageCode, gender, price, verifiedOnly, page]);

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

      <div className="mt-4 flex items-center gap-3">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--trust-blue)]/60">
            <SearchIcon />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm kiếm theo tên, chức danh..."
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

      {/* Filters (optional, nhưng có sẵn) */}
      <div className="mt-4 rounded-xl border border-[color:var(--innovation-sky)]/35 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          <label className="space-y-1">
            <div className="text-[11px] font-semibold text-black/55">
              Chuyên môn
            </div>
            <select
              value={specializationId}
              onChange={(e) => {
                const v = e.target.value;
                setSpecializationId(v === "Tất cả" ? "Tất cả" : Number(v));
              }}
              className="h-10 w-full rounded-xl border border-[color:var(--innovation-sky)]/45 bg-white px-3 text-[13px] text-[color:var(--corporate-blue)] outline-none"
            >
              <option value="Tất cả">Tất cả</option>
              {specializations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <div className="text-[11px] font-semibold text-black/55">
              Mức giá (giờ)
            </div>
            <select
              value={price}
              onChange={(e) => setPrice(e.target.value as PriceFilter)}
              className="h-10 w-full rounded-xl border border-[color:var(--innovation-sky)]/45 bg-white px-3 text-[13px] text-[color:var(--corporate-blue)] outline-none"
            >
              {(["Tất cả", "<= 250k", "250k - 300k", ">= 300k"] as const).map(
                (p) => (
                  <option key={p} value={p}>
                    {p}
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
              onChange={(e) => setGender(e.target.value as GenderFilter)}
              className="h-10 w-full rounded-xl border border-[color:var(--innovation-sky)]/45 bg-white px-3 text-[13px] text-[color:var(--corporate-blue)] outline-none"
            >
              <option value="Tất cả">Tất cả</option>
              {genders.map((g) => (
                <option key={g} value={g}>
                  {genderLabel(g)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <div className="text-[11px] font-semibold text-black/55">
              Ngôn ngữ
            </div>
            <select
              value={languageCode}
              onChange={(e) => setLanguageCode(e.target.value)}
              className="h-10 w-full rounded-xl border border-[color:var(--innovation-sky)]/45 bg-white px-3 text-[13px] text-[color:var(--corporate-blue)] outline-none"
            >
              <option value="Tất cả">Tất cả</option>
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-end gap-2">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-[12px] font-semibold text-[color:var(--corporate-blue)]">
              Chỉ hiển thị đã xác minh
            </span>
          </label>
        </div>
      </div>

      <div className="mt-4 text-[12px] font-semibold text-black/45">
        {loading ? (
          "Đang tải..."
        ) : err ? (
          <span className="text-red-600">{err}</span>
        ) : (
          <>
            Tìm thấy:{" "}
            <span className="text-[color:var(--corporate-blue)]">
              {totalItems}
            </span>{" "}
            chuyên gia
          </>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
        {items.map((e) => (
          <ExpertCard key={e.expertId} expert={e} />
        ))}
      </div>

      {/* Paging */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          disabled={page <= 0 || loading}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="rounded-xl border border-[color:var(--innovation-sky)]/45 bg-white px-4 py-2 text-[12px] font-semibold text-[color:var(--corporate-blue)] disabled:opacity-60"
        >
          ← Trước
        </button>

        <div className="text-[12px] font-semibold text-black/45">
          Trang {page + 1} / {totalPages}
        </div>

        <button
          type="button"
          disabled={page + 1 >= totalPages || loading}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-xl border border-[color:var(--innovation-sky)]/45 bg-white px-4 py-2 text-[12px] font-semibold text-[color:var(--corporate-blue)] disabled:opacity-60"
        >
          Sau →
        </button>
      </div>
    </section>
  );
}
