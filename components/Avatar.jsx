"use client";

import { useState } from "react";
import { getAvatarUrl } from "@/lib/getAvatarUrl";

export default function Avatar({ src, size = 24 }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <img
      src={hasError ? "/avatar-fallback.png" : getAvatarUrl(src)}
      alt=""
      width={size}
      height={size}
      style={{
        borderRadius: "50%",
        objectFit: "cover",
        border: "1px solid #e5e7eb",
      }}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}