const layers = [
  {
    id: "01",
    title: "Experience",
    description: "Web, mobile and digital touchpoints",
  },
  {
    id: "02",
    title: "Applications",
    description: "Custom software and integration",
  },
  {
    id: "03",
    title: "Infrastructure",
    description: "Cloud, platforms and operations",
  },
];

export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[34rem] select-none">
      <div
        className="absolute inset-[5%] rounded-full border border-white/[0.06]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-[14%] rounded-full border border-dashed border-white/[0.08] motion-safe:animate-[spin-slow_120s_linear_infinite]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-[26%] rounded-full border border-white/[0.05]"
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 top-1/2 size-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[70px]"
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 560 560"
        className="absolute inset-x-0 top-0 h-[85%] w-full"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="plane-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="plane-side" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e40af" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0b1221" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="beam-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g stroke="#93c5fd" strokeOpacity="0.55" strokeWidth="1" fill="none">
          <polyline
            points="144,250 114,340 84,430"
            strokeDasharray="3 6"
            strokeOpacity="0.35"
          />
          <polyline
            points="416,250 446,340 476,430"
            strokeDasharray="3 6"
            strokeOpacity="0.35"
          />
          <line
            x1="280"
            y1="196"
            x2="280"
            y2="512"
            strokeDasharray="2 7"
            strokeOpacity="0.28"
          />
        </g>

        {/* Infrastructure plane */}
        <g>
          <polygon
            points="84,430 280,490 280,512 84,452"
            fill="url(#plane-side)"
            stroke="#93c5fd"
            strokeOpacity="0.3"
          />
          <polygon
            points="280,490 476,430 476,452 280,512"
            fill="#0a1a2f"
            fillOpacity="0.65"
            stroke="#93c5fd"
            strokeOpacity="0.22"
          />
          <polygon
            points="280,370 476,430 280,490 84,430"
            fill="url(#plane-fill)"
            fillOpacity="0.5"
            stroke="#93c5fd"
            strokeOpacity="0.45"
          />
          <polyline
            points="84,430 280,370 476,430"
            stroke="#bfdbfe"
            strokeOpacity="0.55"
          />
        </g>

        {/* Applications plane */}
        <g>
          <polygon
            points="114,340 280,400 280,420 114,360"
            fill="url(#plane-side)"
            stroke="#93c5fd"
            strokeOpacity="0.3"
          />
          <polygon
            points="280,400 446,340 446,360 280,420"
            fill="#0a1a2f"
            fillOpacity="0.7"
            stroke="#93c5fd"
            strokeOpacity="0.24"
          />
          <polygon
            points="280,280 446,340 280,400 114,340"
            fill="url(#plane-fill)"
            fillOpacity="0.72"
            stroke="#93c5fd"
            strokeOpacity="0.5"
          />
          <polyline
            points="114,340 280,280 446,340"
            stroke="#bfdbfe"
            strokeOpacity="0.65"
          />
        </g>

        {/* Experience plane */}
        <g>
          <polygon
            points="144,250 280,304 280,322 144,268"
            fill="url(#plane-side)"
            stroke="#93c5fd"
            strokeOpacity="0.35"
          />
          <polygon
            points="280,304 416,250 416,268 280,322"
            fill="#0a1a2f"
            fillOpacity="0.75"
            stroke="#93c5fd"
            strokeOpacity="0.28"
          />
          <polygon
            points="280,196 416,250 280,304 144,250"
            fill="url(#plane-fill)"
            fillOpacity="0.85"
            stroke="#bfdbfe"
            strokeOpacity="0.6"
          />
          <polyline
            points="144,250 280,196 416,250"
            stroke="#e0f2fe"
            strokeOpacity="0.7"
          />
        </g>

        {/* Vertical data beam */}
        <line
          x1="280"
          y1="196"
          x2="280"
          y2="512"
          stroke="url(#beam-fill)"
          strokeWidth="1.5"
        />

        {/* Nodes */}
        {[
          { x: 280, y: 250, delay: "0s" },
          { x: 280, y: 340, delay: "1.2s" },
          { x: 280, y: 430, delay: "2.4s" },
        ].map((node) => (
          <g key={node.y}>
            <circle
              cx={node.x}
              cy={node.y}
              r="20"
              fill="url(#node-glow)"
              className="motion-safe:animate-[node-glow_5s_ease-in-out_infinite]"
              style={{ animationDelay: node.delay }}
            />
            <circle cx={node.x} cy={node.y} r="4" fill="#22d3ee" />
            <circle
              cx={node.x}
              cy={node.y}
              r="9"
              fill="none"
              stroke="#22d3ee"
              strokeOpacity="0.35"
            />
          </g>
        ))}

        {[
          [144, 250],
          [416, 250],
          [114, 340],
          [446, 340],
          [84, 430],
          [476, 430],
        ].map(([x, y]) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="2.5"
            fill="#e0f2fe"
            fillOpacity="0.7"
          />
        ))}

        <g stroke="#7dd3fc" strokeOpacity="0.4" strokeWidth="1">
          <line x1="280" y1="180" x2="280" y2="190" />
          <line x1="270" y1="196" x2="290" y2="196" />
          <line x1="268" y1="512" x2="292" y2="512" />
        </g>
      </svg>

      <div className="absolute left-0 top-[3%] flex items-center gap-2.5 text-[9px] font-medium uppercase tracking-[0.22em] text-white/60">
        <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
        System map / 01
      </div>

      <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
        {layers.map((layer) => (
          <div key={layer.id}>
            <p className="font-mono text-[9px] tracking-[0.12em] text-accent">
              {layer.id}
            </p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.1em] text-white/70 sm:text-[11px]">
              {layer.title}
            </p>
            <p className="mt-1 hidden text-[10px] leading-4 text-white/60 sm:block">
              {layer.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
