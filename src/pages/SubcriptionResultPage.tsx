import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import type { SubscriptionConfirmationDto } from "../types/api";

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

export default function SubscriptionResultPage() {
  const [sp] = useSearchParams();
  const paymentId = Number(sp.get("paymentId"));

  const [data, setData] = React.useState<SubscriptionConfirmationDto | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!Number.isFinite(paymentId) || paymentId <= 0) {
      setLoading(false);
      setErr("paymentId không hợp lệ.");
      return;
    }

    const ac = new AbortController();

    (async () => {
      setErr(null);
      setLoading(true);
      try {
        const res = await api.subscriptions.confirmation(paymentId, {
          signal: ac.signal,
        });

        if (ac.signal.aborted) return;
        setData(res);
      } catch (e) {
        if (ac.signal.aborted || isAbortError(e)) return;

        const status = (e as any)?.status;
        if (status === 401) setErr("Bạn cần đăng nhập để xác nhận gói.");
        else setErr("Không lấy được kết quả thanh toán gói.");
        setData(null);
      } finally {
        if (ac.signal.aborted) return;
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-2xl bg-white p-5 text-[12px] font-semibold text-black/55 ring-1 ring-black/5">
          Đang xác nhận thanh toán...
        </div>
      </div>
    );
  }

  if (err || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
          <div className="text-[14px] font-extrabold text-red-700">{err}</div>
          <div className="mt-4 flex gap-2">
            <Link
              to="/goi-thanh-vien"
              className="rounded-xl bg-[color:var(--trust-blue)] px-4 py-2 text-[12px] font-extrabold text-white"
            >
              Quay lại gói
            </Link>
            <Link
              to="/"
              className="rounded-xl bg-white px-4 py-2 text-[12px] font-extrabold text-[color:var(--corporate-blue)] ring-1 ring-black/10"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const ok =
    data.paymentStatus === "paid" || data.subscriptionStatus === "active";

  return (
    <div className="mx-auto max-w-3xl px-4">
      <div className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(27,73,101,0.10)] ring-1 ring-[color:var(--innovation-sky)]/30">
        <div
          className={[
            "inline-flex rounded-full px-3 py-1 text-[11px] font-extrabold ring-1",
            ok
              ? "bg-green-50 text-green-700 ring-green-200"
              : "bg-yellow-50 text-yellow-700 ring-yellow-200",
          ].join(" ")}
        >
          {ok ? "THÀNH CÔNG" : "ĐANG XỬ LÝ"}
        </div>

        <h1 className="mt-3 text-2xl font-extrabold text-[color:var(--corporate-blue)]">
          {data.plan.name}
        </h1>

        <div className="mt-2 text-[12px] font-semibold text-black/55">
          Giá:{" "}
          <span className="font-extrabold">{formatVnd(data.plan.price)}</span> /{" "}
          {data.plan.billingCycle}
        </div>

        <div className="mt-3 text-[12px] font-semibold text-black/55">
          Subscription: {data.subscriptionStatus}
          {data.expiryDate ? ` • Hết hạn: ${data.expiryDate}` : ""}
        </div>

        <div className="mt-3 text-[12px] font-semibold text-black/55">
          PaymentId: {data.paymentId} • Payment: {data.paymentStatus}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/lich-hen"
            className="rounded-xl bg-[color:var(--trust-blue)] px-4 py-2 text-[12px] font-extrabold text-white"
          >
            Xem lịch hẹn
          </Link>
          <Link
            to="/goi-thanh-vien"
            className="rounded-xl bg-white px-4 py-2 text-[12px] font-extrabold text-[color:var(--corporate-blue)] ring-1 ring-black/10"
          >
            Quay lại gói
          </Link>
        </div>
      </div>
    </div>
  );
}
