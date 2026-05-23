import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PaintingGallery from './PaintingGallery';
import { formatClassTime, formatClassDate } from '../utils/dates';
import { buildBookingUrl } from '../utils/bookingUrl';

export default function ClassCard({ canvasClass, bookingMeta }) {
  const [bookUrl, setBookUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    buildBookingUrl(canvasClass, bookingMeta).then((url) => {
      if (!cancelled) setBookUrl(url);
    });
    return () => { cancelled = true; };
  }, [canvasClass, bookingMeta]);

  const duration = canvasClass.duration_minutes
    ? `${canvasClass.duration_minutes} min`
    : null;

  return (
    <article className="card flex flex-col sm:flex-row gap-4 sm:gap-6">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-primary font-semibold mb-1">
          {canvasClass.location_name}
        </p>
        <h3 className="text-xl font-bold mb-1">{canvasClass.class_name}</h3>
        <p className="text-ink-muted text-sm mb-3">
          {formatClassDate(canvasClass.class_datetime)} &middot;{' '}
          {formatClassTime(canvasClass.class_datetime)}
          {duration && ` · ${duration}`}
        </p>
        <PaintingGallery paintings={canvasClass.paintings} compact />
      </div>
      <div className="flex flex-row sm:flex-col gap-2 sm:justify-center flex-shrink-0">
        <Link
          to={`/classes/${canvasClass.acuity_class_id}`}
          className="btn-secondary text-sm px-4 py-2 text-center"
        >
          View details
        </Link>
        {bookUrl && (
          <a
            href={bookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm px-4 py-2 text-center"
          >
            Book
          </a>
        )}
      </div>
    </article>
  );
}
