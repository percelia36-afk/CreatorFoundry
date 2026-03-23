import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  // Fetch user/dashboard data from API if needed
  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-6">DASHBOARD</h1>
      {/* Render dashboard content here, but do not show user name or email */}
      {/* Add more dashboard UI here */}
    </main>
  );
}
