const productImages = [
  {
    label: "Tissus colorés en boutique",
    source:
      "https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Rouleaux de tissus colorés",
    source:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
  },
];

export function HomeProductImages() {
  return (
    <div
      aria-label="Tissus de la boutique"
      className="mt-5 grid grid-cols-2 gap-2"
    >
      {productImages.map((image) => (
        <div
          aria-label={image.label}
          className="h-24 rounded-[var(--radius-card)] bg-cover bg-center shadow-[var(--shadow-card)]"
          key={image.label}
          role="img"
          style={{ backgroundImage: `url(${image.source})` }}
        />
      ))}
    </div>
  );
}
