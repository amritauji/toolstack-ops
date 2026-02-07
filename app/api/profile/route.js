import { getUser } from "@/lib/getUser";
import { supabase } from "@/lib/supabaseClient";
import { apiRateLimit } from '@/lib/rateLimit';

export async function GET(request) {
  const rateLimitResult = apiRateLimit(request);
  if (!rateLimitResult.success) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }

  const user = await getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, username, email, avatar_url, role, last_login")
    .eq("id", user.id)
    .single();

  return Response.json(data);
}