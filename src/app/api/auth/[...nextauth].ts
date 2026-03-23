import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";

const pool = new Pool({
  connectionString: process.env.DB_CONN,
});

async function findOrCreateUser(email, name) {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (res.rows.length > 0) {
      return res.rows[0];
    } else {
      const auth_user_id = uuidv4();
      const insert = await client.query(
        "INSERT INTO users (auth_user_id, email, username) VALUES ($1, $2, $3) RETURNING *",
        [auth_user_id, email, name],
      );
      return insert.rows[0];
    }
  } finally {
    client.release();
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await findOrCreateUser(user.email, user.name);
      return true;
    },
    async session({ session }) {
      // Optionally, you can fetch more user info here
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
