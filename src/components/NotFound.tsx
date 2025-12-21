import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

type Thought = {
  text: string;
  top: number; // %
  left: number; // %
  rot: number; // deg
  blur: number; // px
  scale: number;
  delay: number; // s
  dur: number; // s
  opacity: number;
};

export default function NotFound() {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement | null>(null);

  const thoughts = useMemo<Thought[]>(() => {
    const words = [
      "STRESS",
      "DEADLINE",
      "LO ÂU",
      "OVERLOAD",
      "LOST",
      "QUÁ TẢI",
    ];
    const n = 26;

    const rand = (min: number, max: number) =>
      min + Math.random() * (max - min);
    const clamp = (v: number, a: number, b: number) =>
      Math.max(a, Math.min(b, v));

    const items: Thought[] = Array.from({ length: n }).map((_, i) => {
      const edgeBias = i % 3 === 0; // đẩy vài chữ ra rìa để tăng "mất kiểm soát"
      const top = edgeBias
        ? Math.random() < 0.5
          ? rand(2, 18)
          : rand(82, 98)
        : rand(6, 94);
      const left = edgeBias
        ? Math.random() < 0.5
          ? rand(2, 15)
          : rand(85, 98)
        : rand(6, 94);

      return {
        text: words[Math.floor(Math.random() * words.length)],
        top: clamp(top, 1, 99),
        left: clamp(left, 1, 99),
        rot: rand(-28, 28),
        blur: rand(0.8, 2.8),
        scale: rand(0.85, 1.35),
        delay: rand(0, 1.6),
        dur: rand(1.2, 3.2),
        opacity: rand(0.25, 0.7),
      };
    });

    return items;
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let raf = 0;
    let targetDX = 0;
    let targetDY = 0;
    let currentDX = 0;
    let currentDY = 0;

    const setVars = (dx: number, dy: number) => {
      el.style.setProperty("--dx", dx.toFixed(4));
      el.style.setProperty("--dy", dy.toFixed(4));
      el.style.setProperty("--tiltX", `${(-dy * 22).toFixed(2)}deg`);
      el.style.setProperty("--tiltY", `${(dx * 24).toFixed(2)}deg`);
      el.style.setProperty("--splitR", `${(-dx * 24).toFixed(2)}px`);
      el.style.setProperty("--splitB", `${(dx * 24).toFixed(2)}px`);
      el.style.setProperty("--splitY", `${(dy * 10).toFixed(2)}px`);
    };

    const animate = () => {
      // smooth follow để tạo cảm giác "chóng mặt"
      currentDX += (targetDX - currentDX) * 0.12;
      currentDY += (targetDY - currentDY) * 0.12;
      setVars(currentDX, currentDY);
      raf = requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // -1..1
      targetDX = (e.clientX - cx) / (rect.width / 2) || 0;
      targetDY = (e.clientY - cy) / (rect.height / 2) || 0;

      // clamp mạnh tay để còn "dị ứng tiền đình" nhưng không vỡ layout
      targetDX = Math.max(-1, Math.min(1, targetDX));
      targetDY = Math.max(-1, Math.min(1, targetDY));
    };

    const onLeave = () => {
      targetDX = 0;
      targetDY = 0;
    };

    // init
    setVars(0, 0);
    raf = requestAnimationFrame(animate);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className="nf-root">
      {/* SVG filter for noise */}
      <svg
        className="nf-noise-svg"
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
      >
        <filter id="nfNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      {/* Rotating Moiré backgrounds */}
      <div className="nf-bg nf-bg-a" aria-hidden="true" />
      <div className="nf-bg nf-bg-b" aria-hidden="true" />

      {/* Overlays: scanlines + noise + vignette */}
      <div className="nf-overlay nf-scanlines" aria-hidden="true" />
      <div className="nf-overlay nf-noise" aria-hidden="true" />
      <div className="nf-overlay nf-vignette" aria-hidden="true" />

      {/* Intrusive words */}
      <div className="nf-thoughts" aria-hidden="true">
        {thoughts.map((t, i) => (
          <span
            key={`${t.text}-${i}`}
            className="nf-thought"
            style={{
              top: `${t.top}%`,
              left: `${t.left}%`,
              transform: `translate(-50%, -50%) rotate(${t.rot}deg) scale(${t.scale})`,
              filter: `blur(${t.blur}px)`,
              opacity: t.opacity,
              animationDelay: `${t.delay}s`,
              animationDuration: `${t.dur}s`,
            }}
          >
            {t.text}
          </span>
        ))}
      </div>

      {/* Perspective stage */}
      <div className="nf-stage">
        <div className="nf-card" role="main">
          <div className="nf-404" aria-label="404">
            {/* RGB split layers */}
            <span className="nf-404-layer nf-404-r">404</span>
            <span className="nf-404-layer nf-404-g">404</span>
            <span className="nf-404-layer nf-404-b">404</span>
          </div>

          <p className="nf-title">QUÁ TẢI TÂM LÝ</p>
          <p className="nf-sub">
            Bạn đang ở ngoài vùng phủ thực tại. Trang này không tồn tại — hoặc
            não bạn đang “buffer”.
          </p>

          <div className="nf-actions">
            <button
              className="nf-anchor"
              type="button"
              onClick={() => navigate("/", { replace: true })}
            >
              <span className="nf-anchor-text">QUAY LẠI THỰC TẠI</span>
            </button>

            {/* <button
              className="nf-ghost"
              type="button"
              onClick={() => navigate(-1)}
            >
              Quay lại trang trước
            </button> */}
          </div>

          {/* <div className="nf-hint">
            Mẹo: di chuột để thấy “song thị” RGB và độ nghiêng tiền đình.
          </div> */}
        </div>
      </div>

      <style>{`
        .nf-root{
          --dx: 0;
          --dy: 0;
          --tiltX: 0deg;
          --tiltY: 0deg;
          --splitR: 0px;
          --splitB: 0px;
          --splitY: 0px;

          position: relative;
          min-height: calc(100dvh - 0px);
          width: 100%;
          overflow: hidden;
          background: radial-gradient(circle at 30% 20%, rgba(137,207,240,0.25), transparent 40%),
                      radial-gradient(circle at 80% 70%, rgba(70,130,180,0.22), transparent 45%),
                      linear-gradient(180deg, rgba(27,73,101,0.14), rgba(0,0,0,0.55));
        }

        .nf-noise-svg{ position:absolute; width:0; height:0; }

        /* === Moiré / Optical illusion layers (2 layers counter-rotating) === */
        .nf-bg{
          position:absolute;
          inset:-40vmin;
          transform-origin: 50% 50%;
          opacity: 0.55;
          mix-blend-mode: overlay;
          pointer-events:none;
          will-change: transform;
        }

        .nf-bg-a{
          background-image:
            repeating-linear-gradient(
              0deg,
              rgba(255,255,255,0.08) 0px,
              rgba(255,255,255,0.08) 1px,
              transparent 1px,
              transparent 18px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(255,255,255,0.06) 0px,
              rgba(255,255,255,0.06) 1px,
              transparent 1px,
              transparent 18px
            );
          animation: nf-rot-cw 22s linear infinite;
        }

        .nf-bg-b{
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.11) 1px, transparent 1.6px);
          background-size: 14px 14px;
          animation: nf-rot-ccw 18s linear infinite;
          opacity: 0.42;
          filter: blur(0.2px);
        }

        @keyframes nf-rot-cw { to { transform: rotate(360deg); } }
        @keyframes nf-rot-ccw { to { transform: rotate(-360deg); } }

        /* === Overlays === */
        .nf-overlay{
          position:absolute;
          inset:0;
          pointer-events:none;
        }

        .nf-scanlines{
          opacity: 0.20;
          background-image:
            repeating-linear-gradient(
              180deg,
              rgba(0,0,0,0.0) 0px,
              rgba(0,0,0,0.0) 2px,
              rgba(0,0,0,0.35) 3px
            );
          mix-blend-mode: multiply;
          animation: nf-scan 6s linear infinite;
        }

        @keyframes nf-scan{
          0% { transform: translateY(0); }
          100% { transform: translateY(12px); }
        }

        .nf-noise{
          opacity: 0.18;
          filter: url(#nfNoise);
          background: rgba(255,255,255,0.35);
          mix-blend-mode: overlay;
        }

        .nf-vignette{
          background: radial-gradient(circle at 50% 45%, transparent 0 46%, rgba(0,0,0,0.62) 78%, rgba(0,0,0,0.85) 100%);
          opacity: 0.95;
        }

        /* === Intrusive thoughts === */
        .nf-thoughts{
          position:absolute;
          inset:0;
          pointer-events:none;
        }

        .nf-thought{
          position:absolute;
          color: rgba(255,255,255,0.85);
          font-weight: 900;
          letter-spacing: 0.12em;
          font-size: 12px;
          text-transform: uppercase;
          text-shadow: 0 0 24px rgba(137,207,240,0.30);
          animation-name: nf-flicker;
          animation-timing-function: steps(2, end);
          animation-iteration-count: infinite;
          will-change: opacity, transform, filter;
        }

        @keyframes nf-flicker{
          0%{ opacity: 0.05; }
          10%{ opacity: 0.75; }
          12%{ opacity: 0.15; }
          26%{ opacity: 0.65; }
          38%{ opacity: 0.22; }
          52%{ opacity: 0.72; }
          65%{ opacity: 0.18; }
          78%{ opacity: 0.64; }
          100%{ opacity: 0.08; }
        }

        /* === Perspective stage + strong tilt === */
        .nf-stage{
          position:relative;
          z-index: 5;
          min-height: 100dvh;
          display:flex;
          align-items:center;
          justify-content:center;
          padding: 42px 16px;
          perspective: 800px;
          perspective-origin: 50% 45%;
        }

        .nf-card{
          width: min(920px, 100%);
          border-radius: 28px;
          padding: 34px 22px 26px;
          text-align:center;
          transform:
            rotateX(var(--tiltX))
            rotateY(var(--tiltY))
            translateZ(0);
          transition: transform 90ms linear;
          will-change: transform;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.16);
          box-shadow: 0 22px 70px rgba(0,0,0,0.35);
          backdrop-filter: blur(12px);
        }

        /* === 404 RGB split === */
        .nf-404{
          position:relative;
          line-height: 0.9;
          margin: 2px 0 12px;
          user-select:none;
          font-variation-settings: "wght" 900;
        }

        .nf-404-layer{
          position:absolute;
          left:50%;
          top:0;
          transform: translateX(-50%);
          font-size: clamp(88px, 16vw, 190px);
          font-weight: 900;
          letter-spacing: 0.02em;
          filter: drop-shadow(0 10px 30px rgba(0,0,0,0.35));
        }

        .nf-404-r{
          color: rgba(255, 70, 70, 0.95);
          transform: translate(calc(-50% + var(--splitR)), calc(var(--splitY) * -1));
          mix-blend-mode: screen;
        }

        .nf-404-g{
          color: rgba(90, 255, 140, 0.72);
          transform: translate(-50%, 0);
          mix-blend-mode: screen;
          opacity: 0.75;
        }

        .nf-404-b{
          color: rgba(100, 165, 255, 0.95);
          transform: translate(calc(-50% + var(--splitB)), var(--splitY));
          mix-blend-mode: screen;
        }

        /* subtle jitter to increase "dizzy" */
        .nf-404::after{
          content:"";
          display:block;
          height: 1px;
          width: 0;
        }

        .nf-title{
          margin: 10px 0 0;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.22em;
          color: rgba(255,255,255,1);
        }

        .nf-sub{
          margin: 10px auto 0;
          max-width: 60ch;
          font-size: 13px;
          font-weight: 650;
          line-height: 1.8;
          color: rgba(255, 255, 255, 1)
        }

        .nf-actions{
          margin-top: 18px;
          display:flex;
          flex-direction: column;
          gap: 10px;
          align-items:center;
          justify-content:center;
        }

        /* === Anchor button (stable, but glitches hard on hover) === */
        .nf-anchor{
          position: relative;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding: 12px 18px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.92);
          color: rgba(27,73,101,1);
          font-weight: 900;
          letter-spacing: 0.08em;
          font-size: 12px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.22);
          cursor:pointer;
          transform: translateZ(0);
          transition: transform 120ms ease, filter 120ms ease, background 120ms ease;
          isolation: isolate;
          overflow:hidden;
        }

        .nf-anchor-text{
          position:relative;
          z-index: 2;
        }

        .nf-anchor::before,
        .nf-anchor::after{
          content: "";
          position:absolute;
          inset:-40%;
          opacity: 0;
          background:
            linear-gradient(90deg, rgba(255,0,80,0.0), rgba(255,0,80,0.26), rgba(0,160,255,0.0)),
            repeating-linear-gradient(180deg, rgba(0,0,0,0.0) 0px, rgba(0,0,0,0.0) 2px, rgba(0,0,0,0.20) 3px);
          mix-blend-mode: overlay;
          transform: translateX(0);
          z-index: 1;
        }

        .nf-anchor:hover{
          transform: translateY(-1px) scale(1.01);
          filter: saturate(1.2) contrast(1.05);
        }

        .nf-anchor:hover::before{
          opacity: 0.85;
          animation: nf-glitch-sweep 650ms steps(2,end) infinite;
        }

        .nf-anchor:hover::after{
          opacity: 0.65;
          animation: nf-glitch-sweep2 420ms steps(2,end) infinite;
        }

        @keyframes nf-glitch-sweep{
          0%{ transform: translate(-6%, -2%) skewX(0deg); }
          20%{ transform: translate(8%, 1%) skewX(6deg); }
          40%{ transform: translate(-10%, 2%) skewX(-10deg); }
          60%{ transform: translate(12%, -1%) skewX(12deg); }
          80%{ transform: translate(-5%, 1%) skewX(-6deg); }
          100%{ transform: translate(0%, 0%) skewX(0deg); }
        }

        @keyframes nf-glitch-sweep2{
          0%{ transform: translate(12%, 0%) scale(1.02); }
          50%{ transform: translate(-10%, 0%) scale(0.99); }
          100%{ transform: translate(8%, 0%) scale(1.01); }
        }

        .nf-ghost{
          background: transparent;
          color: rgba(255,255,255,0.75);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 14px;
          padding: 10px 14px;
          cursor:pointer;
          font-weight: 750;
          font-size: 12px;
          transition: background 120ms ease, color 120ms ease, transform 120ms ease;
        }

        .nf-ghost:hover{
          background: rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.92);
          transform: translateY(-1px);
        }

        .nf-hint{
          margin-top: 14px;
          font-size: 11px;
          font-weight: 650;
          color: rgba(255,255,255,0.55);
        }

        @media (min-width: 768px){
          .nf-card{ padding: 44px 40px 34px; }
          .nf-actions{ flex-direction: row; gap: 12px; }
        }

        @media (prefers-reduced-motion: reduce){
          .nf-bg-a, .nf-bg-b, .nf-scanlines, .nf-thought, .nf-anchor::before, .nf-anchor::after{
            animation: none !important;
          }
          .nf-card{
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
