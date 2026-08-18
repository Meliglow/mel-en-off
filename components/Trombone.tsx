// Trombone dessine, jamais une image.
export default function Trombone({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 44"
      fill="none"
      aria-hidden
      className={`trombone ${className}`}
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13.6 9v22.4a5.1 5.1 0 0 1-10.2 0V7.6a3.2 3.2 0 0 1 6.4 0v23.2a1.6 1.6 0 0 1-3.2 0V11" />
    </svg>
  );
}
