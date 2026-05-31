// src/components/ui/SmartImage.tsx
/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

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
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: "cover" }}
        priority={false} // Next.js otomatis menambahkan loading="lazy" jika priority false
      />
    </div>
  );
}
