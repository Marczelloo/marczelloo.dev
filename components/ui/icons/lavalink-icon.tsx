import * as React from "react";

export function LavalinkIcon({
  size = 24,
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="lavagradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#FF6B6B", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#FF5252", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#lavagradient)" rx="14" ry="14" />
      <path fill="#ffffff" d="m 57,25 h 13 l -7,27 h 12 l -2,8.5 H 48 Z" />
      <path fill="#ffffff" d="m 37.5,25 h 14 l -10,40 H 72 L 70,75 H 25 Z" />
    </svg>
  );
}
