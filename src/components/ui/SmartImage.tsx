// src/components/ui/SmartImage.tsx
/* eslint-disable @next/next/no-img-element */

type Props = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * SmartImage — tampilkan gambar dari URL lokal maupun eksternal.
 * Gunakan ini sebagai pengganti next/image untuk gambar upload.
 */
export function SmartImage({ src, alt, className, style }: Props) {
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ objectFit: "cover", width: "100%", height: "100%", ...style }}
      loading="lazy"
    />
  );
}
