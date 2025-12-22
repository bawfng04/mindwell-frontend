import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { MySubscriptionDto, SubscriptionPlanDto } from "../types/api";

// component này không dùng, đừng quan tâm cái này

function isAbortError(e: unknown) {
  return (
    (typeof e === "object" &&
      e !== null &&
      "name" in e &&
      (e as any).name === "AbortError") ||
    false
  );
}

function formatVnd(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

function isInternalApiRedirect(url: string) {
  return url.startsWith("/api/") || url.includes("localhost:5173/api/");
}

export default function SubscriptionsPage() {
  const nav = useNavigate();

  const [plans, setPlans] = React.useState<SubscriptionPlanDto[]>([]);
  const [mySub, setMySub] = React.useState<MySubscriptionDto | null>(null);

  const [methodKey, setMethodKey] = React.useState("vnpay");
  const [loading, setLoading] = React.useState(true);
  const [payingSubId, setPayingSubId] = React.useState<number | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    const ac = new AbortController();

    (async () => {
      setErr(null);
      setLoading(true);
      try {
        const [p, mine] = await Promise.all([
          api.subscriptions.listPlans({ signal: ac.signal }),
          api.subscriptions.my({ signal: ac.signal }).catch(() => null),
        ]);

        if (ac.signal.aborted) return;

        setPlans((p ?? []).filter((x) => x.isActive));
        setMySub(mine);
      } catch (e) {
        if (ac.signal.aborted || isAbortError(e)) return;
        setErr("Không tải được danh sách gói. Kiểm tra backend/proxy.");
        setPlans([]);
        setMySub(null);
      } finally {
        if (ac.signal.aborted) return;
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  async function onBuy(subId: number) {
    setErr(null);
    setPayingSubId(subId);
    try {
      const res = await api.subscriptions.pay(subId, { methodKey });

      // nếu backend trả link mock /api/... thì không rời SPA
      if (res.redirectUrl && isInternalApiRedirect(res.redirectUrl)) {
        await fetch(res.redirectUrl, {
          headers: { Accept: "application/json" },
        }).catch(() => {});
        nav(`/goi-thanh-vien/ket-qua?paymentId=${res.paymentId}`);
        return;
      }

      // redirect thật (cổng thanh toán)
      if (res.redirectUrl) {
        window.location.href = res.redirectUrl;
        return;
      }

      // không redirect
      nav(`/goi-thanh-vien/ket-qua?paymentId=${res.paymentId}`);
    } catch (e) {
      const status = (e as any)?.status;
      if (status === 401) setErr("Bạn cần đăng nhập để mua gói.");
      else if (status === 409) setErr("Bạn đã có gói thành viên hiện tại.");
      else setErr("Không thể tạo thanh toán. Vui lòng thử lại.");
    } finally {
      setPayingSubId(null);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[color:var(--corporate-blue)]">
            Gói thành viên
          </h1>
          <div className="mt-1 text-[12px] font-semibold text-black/55">
            Chọn gói phù hợp và thanh toán.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[12px] font-semibold text-black/55">
            Phương thức:
          </label>
          <select
            value={methodKey}
            onChange={(e) => setMethodKey(e.target.value)}
            className="h-10 rounded-xl border border-black/10 bg-white px-3 text-[13px] font-semibold text-[color:var(--corporate-blue)]"
          >
            <option value="vnpay">VNPay</option>
            <option value="momo">MoMo</option>
            <option value="zalopay">ZaloPay</option>
            <option value="card">Card</option>
            <option value="mindpoints">MindPoints</option>
          </select>
        </div>
      </div>

      {mySub?.plan ? (
        <div className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-[color:var(--innovation-sky)]/30">
          <div className="text-[12px] font-extrabold text-[color:var(--corporate-blue)]">
            Gói hiện tại: {mySub.plan.name}
          </div>
          <div className="mt-1 text-[12px] font-semibold text-black/55">
            Trạng thái: {mySub.status}
            {mySub.expiryDate ? ` • Hết hạn: ${mySub.expiryDate}` : ""}
          </div>
        </div>
      ) : null}

      {err ? (
        <div className="mt-5 rounded-2xl bg-white p-4 text-[12px] font-semibold text-red-700 ring-1 ring-red-200">
          {err}{" "}
          {err.includes("đăng nhập") ? (
            <Link to="/dang-nhap" className="underline">
              Đăng nhập
            </Link>
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-6 rounded-2xl bg-white p-4 text-[12px] font-semibold text-black/55 ring-1 ring-black/5">
          Đang tải...
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <article
            key={p.subId}
            className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(27,73,101,0.10)] ring-1 ring-[color:var(--innovation-sky)]/30"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[13px] font-extrabold text-[color:var(--corporate-blue)]">
                  {p.name}
                </div>
                <div className="mt-1 text-[12px] font-semibold text-black/55">
                  {p.tierSubtitle ?? ""}
                </div>
              </div>
              {p.badgeLabel ? (
                <span className="rounded-full bg-[color:var(--calm-background)] px-3 py-1 text-[11px] font-extrabold text-[color:var(--corporate-blue)] ring-1 ring-black/5">
                  {p.badgeLabel}
                </span>
              ) : null}
            </div>

            <div className="mt-4 text-3xl font-extrabold text-[color:var(--trust-blue)]">
              {formatVnd(p.price)}
              <span className="ml-2 text-[12px] font-semibold text-black/45">
                / {p.billingCycle}
              </span>
            </div>

            {p.shortDesc ? (
              <div className="mt-3 text-[12px] font-semibold text-black/55">
                {p.shortDesc}
              </div>
            ) : null}

            <ul className="mt-4 space-y-2 text-[12px] font-semibold text-black/60">
              {(p.features ?? []).slice(0, 8).map((f, idx) => (
                <li key={idx}>• {f}</li>
              ))}
            </ul>

            <button
              type="button"
              disabled={payingSubId === p.subId}
              onClick={() => onBuy(p.subId)}
              className={[
                "mt-5 w-full rounded-2xl px-4 py-3 text-[12px] font-extrabold",
                payingSubId === p.subId
                  ? "bg-black/10 text-black/40 cursor-not-allowed"
                  : "bg-[color:var(--trust-blue)] text-white hover:brightness-95 active:brightness-90",
              ].join(" ")}
            >
              {payingSubId === p.subId ? "Đang xử lý..." : "Mua gói 2"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
