// Separateur centre par une fleur ✦, vocabulaire du carnet.
export default function SepFleur({ className = "" }: { className?: string }) {
  return (
    <div className={`sep-fleur ${className}`} aria-hidden>
      <span className="text-sm">✦</span>
    </div>
  );
}
