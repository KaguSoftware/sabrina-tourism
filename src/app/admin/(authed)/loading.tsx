import { Spinner } from "@/components/admin/Spinner/Spinner";

export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <Spinner size="lg" />
    </div>
  );
}
