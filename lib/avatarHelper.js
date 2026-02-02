export function getAvatarUrl(path) {
  if (!path) return "/avatar-fallback.png";
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}