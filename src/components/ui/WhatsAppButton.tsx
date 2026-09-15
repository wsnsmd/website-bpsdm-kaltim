// src/components/ui/WhatsAppButton.tsx
"use client";

interface WhatsAppButtonProps {
  number: string; // format: 628xxxxxxxxx
  message?: string;
}

export function WhatsAppButton({ number, message }: WhatsAppButtonProps) {
  if (!number) return null;

  // Normalisasi nomor: hapus +, spasi, strip; pastikan diawali 62
  const normalized = number
    .replace(/[\s\-().+]/g, "")
    .replace(/^0/, "62");

  const url = message
    ? `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${normalized}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
          aria-label="Hubungi kami via WhatsApp"
          className="fixed bottom-8 right-8 z-40 bg-forest-800 hover:bg-forest-900 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
    >
      {/* WhatsApp SVG icon resmi */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="20"
        height="20"
        fill="#ffc333"
        aria-hidden="true"
      >
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.469 2.027 7.77L0 32l8.437-2.01A15.938 15.938 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.267 13.267 0 0 1-6.77-1.851l-.486-.29-5.007 1.194 1.224-4.877-.317-.5A13.267 13.267 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.862c-.398-.199-2.354-1.162-2.719-1.295-.365-.133-.63-.199-.896.199-.265.398-1.029 1.295-1.261 1.56-.232.266-.465.299-.863.1-.398-.2-1.682-.62-3.203-1.977-1.184-1.056-1.983-2.36-2.215-2.758-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.697.199-.232.265-.398.398-.664.133-.265.066-.497-.033-.697-.1-.199-.896-2.16-1.228-2.958-.323-.775-.651-.67-.896-.683l-.764-.013c-.265 0-.697.1-1.062.497-.365.398-1.394 1.362-1.394 3.322s1.427 3.854 1.626 4.12c.199.265 2.808 4.287 6.803 6.014.951.41 1.693.655 2.272.839.955.303 1.824.26 2.511.158.766-.114 2.354-.962 2.686-1.891.332-.929.332-1.725.232-1.891-.099-.166-.365-.265-.763-.464z" />
      </svg>
    </a>
  );
}
