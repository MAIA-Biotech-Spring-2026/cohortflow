import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Folder, Users, FileSpreadsheet, ScrollText, LogOut } from "lucide-react";

export default async function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "coordinator") {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-primary">CohortFlow</h1>
              <nav className="flex gap-2">
                <Link href="/coordinator">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/coordinator/programs">
                  <Button variant="ghost" size="sm">
                    <Folder className="h-4 w-4 mr-2" />
                    Programs
                  </Button>
                </Link>
                <Link href="/coordinator/pipeline">
                  <Button variant="ghost" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Pipeline
                  </Button>
                </Link>
                <Link href="/coordinator/export">
                  <Button variant="ghost" size="sm">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </Link>
                <Link href="/coordinator/audit">
                  <Button variant="ghost" size="sm">
                    <ScrollText className="h-4 w-4 mr-2" />
                    Audit Log
                  </Button>
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{session.user.name}</span>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
