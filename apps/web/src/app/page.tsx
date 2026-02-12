import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Redirect to appropriate dashboard based on role
  switch (session.user.role) {
    case "applicant":
      redirect("/applicant");
    case "reviewer":
      redirect("/reviewer");
    case "coordinator":
      redirect("/coordinator");
    default:
      redirect("/auth/signin");
  }
}
