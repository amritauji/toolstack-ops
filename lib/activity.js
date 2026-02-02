import { createSupabaseServer } from "./supabaseServer";

export async function logActivity({
  action,
  resourceType,
  resourceId,
  details = {}
}) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    details,
  });
}