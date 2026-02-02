import { getUser } from "@/lib/getUser";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const user = await getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, username, email, avatar_url, role, last_login")
    .eq("id", user.id)
    .single();

  return Response.json(data);
}