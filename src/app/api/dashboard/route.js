import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DB_CONN });

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401,
    });
  }
  const email = session.user.email;
  const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = userRes.rows[0];
  // Fetch dashboard data (add more as needed)
  return new Response(JSON.stringify({ user }), { status: 200 });
}
