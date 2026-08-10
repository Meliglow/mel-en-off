// Puce (chip) cliquable et cumulable. Cible tapable >= 44px via la classe .puce.
export default function Puce({
  label,
  active = false,
  onClick,
  className = "",
}: {
  label: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`puce ${active ? "active" : ""} ${className}`}
      aria-pressed={active}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
