export function getAvatarUrl(avatarUrl) {
  if (avatarUrl) return avatarUrl;
  return "/avatar-fallback.png";
}