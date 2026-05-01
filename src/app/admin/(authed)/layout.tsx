import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { createServerClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar/AdminSidebar";

export default async function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const email = user.email ?? "";

  return (
    <div className="min-h-screen bg-cream flex">
      <AdminSidebar email={email} />

      <main className="flex-1 min-w-0 overflow-y-auto md:pt-0 pt-14">
        <div className="max-w-5xl mx-auto px-6 py-10">
          {children}
        </div>
      </main>

      <Toaster
        position="top-right"
        theme="light"
        toastOptions={{
          style: {
            background: "#f5ede0",
            color: "#1f1a14",
            border: "1px solid #d6cab5",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          },
        }}
      />
    </div>
  );
}
