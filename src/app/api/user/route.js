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
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return new Response(JSON.stringify(rows[0]), { status: 200 });
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401,
    });
  }
  const email = session.user.email;
  const { username } = await req.json();
  if (!username || typeof username !== "string" || !username.trim()) {
    return new Response(JSON.stringify({ message: "Invalid username" }), {
      status: 400,
    });
  }
  const { rows } = await pool.query(
    "UPDATE users SET username = $1 WHERE email = $2 RETURNING *",
    [username.trim(), email],
  );
  return new Response(
    JSON.stringify({ message: "Username updated", user: rows[0] }),
    { status: 200 },
  );
}
