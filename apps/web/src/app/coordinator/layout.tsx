import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/sign-out-button";
import { LayoutDashboard, Folder, Users, FileSpreadsheet, ScrollText } from "lucide-react";

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
              <nav className="flex gap-2" aria-label="Main navigation">
                <Link href="/coordinator">
                  <Button variant="ghost" size="sm" aria-label="Go to coordinator dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-2" aria-hidden="true" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/coordinator/programs">
                  <Button variant="ghost" size="sm" aria-label="Manage programs">
                    <Folder className="h-4 w-4 mr-2" aria-hidden="true" />
                    Programs
                  </Button>
                </Link>
                <Link href="/coordinator/pipeline">
                  <Button variant="ghost" size="sm" aria-label="View application pipeline">
                    <Users className="h-4 w-4 mr-2" aria-hidden="true" />
                    Pipeline
                  </Button>
                </Link>
                <Link href="/coordinator/export">
                  <Button variant="ghost" size="sm" aria-label="Export application data">
                    <FileSpreadsheet className="h-4 w-4 mr-2" aria-hidden="true" />
                    Export
                  </Button>
                </Link>
                <Link href="/coordinator/audit">
                  <Button variant="ghost" size="sm" aria-label="View audit log">
                    <ScrollText className="h-4 w-4 mr-2" aria-hidden="true" />
                    Audit Log
                  </Button>
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{session.user.name}</span>
              <SignOutButton />
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
