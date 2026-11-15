import type React from 'react';

export function MaxIcon({
  className = 'w-5 h-5 text-white shrink-0',
}: {
  className?: string;
}): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 3C6.75 3 2.5 6.69 2.5 11.25c0 2.48 1.27 4.71 3.28 6.22L4.9 20.7a.55.55 0 0 0 .74.65l3.65-1.56c.87.22 1.78.34 2.71.34 5.25 0 9.5-3.69 9.5-8.25S17.25 3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.75 14.25V8.5L12 12.25 16.25 8.5v5.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WhatsAppIcon({
  className = 'w-5 h-5 text-white shrink-0',
}: {
  className?: string;
}): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12.04 2.75a9.2 9.2 0 0 0-7.96 13.81L3 21l4.57-1.19a9.21 9.21 0 1 0 4.47-17.06Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.35 8.4c-.2-.44-.41-.45-.6-.46h-.5c-.18 0-.47.07-.71.33-.25.27-.94.92-.94 2.24s.96 2.6 1.1 2.78c.13.18 1.86 2.97 4.58 4.04 2.26.89 2.72.71 3.21.67.49-.05 1.58-.65 1.8-1.27.22-.62.22-1.16.16-1.27-.07-.11-.25-.18-.52-.31-.27-.13-1.58-.78-1.82-.87-.25-.09-.43-.13-.61.14-.18.26-.7.86-.86 1.04-.16.18-.31.2-.58.07-.27-.14-1.13-.42-2.16-1.33-.8-.71-1.34-1.59-1.5-1.86-.15-.26-.02-.41.12-.54.12-.12.27-.31.4-.47.13-.15.18-.26.27-.44.09-.18.04-.34-.02-.47-.07-.13-.59-1.45-.82-1.97Z"
        fill="currentColor"
      />
    </svg>
  );
}
