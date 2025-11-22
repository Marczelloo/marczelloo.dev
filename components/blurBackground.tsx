// BlurBackground.tsx
export default function BlurBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-110 h-110 bg-(--purple-primary) rounded-full blur-[120px] animate-blobDrift" />
      <div className="absolute top-0 left-80 -translate-y-1/2 w-120 h-64 bg-(--purple-primary) rounded-full blur-[140px] animate-blobDrift" />
      <div className="absolute top-10 left-0 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-(--purple-primary) rounded-full blur-[100px] animate-blobDrift" />
      <div className="absolute top-80 left-230 w-96 h-96 bg-(--purple-primary) rounded-full blur-[120px] animate-blobDrift" />
      <div className="absolute top-120 left-20 w-80 h-80 bg-(--purple-primary) rounded-full blur-[100px] animate-blobDrift" />
      <div className="absolute right-0 translate-x-1/2 bottom-[-25%] w-96 h-160 bg-(--purple-primary) rounded-full blur-[120px] animate-blobDrift" />
      <div className="absolute top-220 left-120 w-96 h-96 bg-(--purple-primary) rounded-full blur-[100px]" />
      <div className="absolute top-250 left-0 -translate-x-1/3 w-96 h-160 bg-(--purple-primary) rounded-full blur-[120px] animate-blobDrift" />
      <div className="absolute top-340 right-110 w-120 h-120 bg-(--purple-primary) rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-20 w-140 h-48 translate-y-1/2 bg-(--purple-primary) rounded-full blur-[100px] animate-blobDrift" />
      <div className="absolute bottom-170 right-0 w-96 h-120 translate-x-1/2 bg-(--purple-primary) rounded-full blur-[120px] animate-blobDrift" />
    </div>
  );
}
