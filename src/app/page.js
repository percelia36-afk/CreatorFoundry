
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]";
import Link from "next/link";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-yellow-400 mb-2">DARK-TOOLS</h1>
        <nav className="mb-4">
          <Link href="/" className="text-yellow-400 mr-6">HOME</Link>
          <Link href="/stats" className="text-yellow-400">STATS</Link>
        </nav>
        <h2 className="text-2xl font-semibold mb-4">TIRED OF USING MULTIPLE PLATFORMS FOR YOUR CONTENT CREATION NEEDS?</h2>
        <p className="mb-8 max-w-xl mx-auto">
          Our all-in-one platform gives you everything you need, with new tools being developed constantly. From analytics to clip editing to publishing, we are building a creator-focused workspace that grows with you so you can stop switching apps and start creating with ease.
        </p>
        <form action="/api/auth/signin/google" method="get">
          <button className="w-full px-8 py-4 border border-gray-400 text-lg tracking-widest bg-transparent text-white hover:bg-gray-800 transition rounded">
            CONTINUE WITH GOOGLE
          </button>
        </form>
      </div>
    </main>
  );
}
