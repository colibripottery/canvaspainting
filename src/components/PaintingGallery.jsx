export default function PaintingGallery({ paintings, compact = false }) {
  if (!paintings?.length) {
    return (
      <p className="text-ink-muted text-sm">
        Painting options for this class will be posted soon.
      </p>
    );
  }

  if (compact) {
    const visible = paintings.slice(0, 3);
    const extra = paintings.length - visible.length;
    return (
      <div className="flex items-center gap-2">
        {visible.map((p) => (
          <div
            key={p.id}
            className="w-12 h-12 rounded-lg overflow-hidden bg-section-bg border border-edge flex-shrink-0"
          >
            {p.image_url ? (
              <img
                src={p.image_url}
                alt={p.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-ink-light">
                ?
              </div>
            )}
          </div>
        ))}
        {extra > 0 && (
          <span className="text-sm text-ink-muted font-medium">+{extra}</span>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {paintings.map((p) => (
        <article key={p.id} className="card p-0 overflow-hidden">
          <div className="aspect-square bg-section-bg">
            {p.image_url ? (
              <img
                src={p.image_url}
                alt={p.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink-light">
                No image
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1">{p.title}</h3>
            {p.description && (
              <p className="text-ink-muted text-sm leading-relaxed">{p.description}</p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
