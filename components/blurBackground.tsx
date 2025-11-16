export default function BlurBackground() {
  return (
    <>
      <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-110 h-110 bg-(--purple-primary) rounded-full blur-[120px] -z-10"></div>
      <div className="absolute top-10 left-0 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-(--purple-primary) rounded-full blur-[100px] -z-10"></div>
      <div className="absolute top-120 left-60 w-24 h-24 bg-(--purple-primary) rounded-full blur-[50px] -z-10"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-160 bg-(--purple-primary) rounded-full blur-[120px] -z-10"></div>
      <div className="absolute top-200 left-140 w-60 h-60 bg-(--purple-primary) rounded-full blur-[100px] -z-10"></div>
      <div className="absolute top-250 left-0 -translate-x-1/4 w-96 h-160 bg-(--purple-primary) rounded-full blur-[120px] -z-10"></div>
    </>
  );
}
