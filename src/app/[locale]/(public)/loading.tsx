import { LogoLoader } from "@/components/primitives/Loader/LogoLoader";

export default function Loading() {
  return (
    <div className="min-h-[72vh] flex items-center justify-center">
      <LogoLoader />
    </div>
  );
}
