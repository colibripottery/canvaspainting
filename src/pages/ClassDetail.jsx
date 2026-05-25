import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PaintingGallery from '../components/PaintingGallery';
import { fetchCanvasClassById } from '../api/canvasClasses';
import { getBookingUrl } from '../utils/bookingUrl';
import { formatClassDateTime } from '../utils/dates';

export default function ClassDetail() {
  const { acuityClassId } = useParams();
  const [canvasClass, setCanvasClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!acuityClassId) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const data = await fetchCanvasClassById(acuityClassId);
        if (cancelled) return;
        if (!data) {
          setNotFound(true);
          setCanvasClass(null);
        } else {
          setCanvasClass(data);
          document.title = `${data.class_name} | Colibri Canvas Painting`;
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load class');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      document.title = 'Canvas Painting Classes | Colibri Pottery Studio';
    };
  }, [acuityClassId]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 flex justify-center" role="status">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="sr-only">Loading class</span>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="pt-24 pb-16 max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Class not found</h1>
        <p className="text-ink-muted mb-6">
          This session may no longer be available. Return to the schedule to browse upcoming classes.
        </p>
        <Link to="/#schedule" className="btn-primary">
          Back to schedule
        </Link>
      </div>
    );
  }

  if (error || !canvasClass) {
    return (
      <div className="pt-24 pb-16 max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-ink-muted mb-6">{error}</p>
        <Link to="/#schedule" className="btn-primary">
          Back to schedule
        </Link>
      </div>
    );
  }

  const duration = canvasClass.duration_minutes
    ? `${canvasClass.duration_minutes} minutes`
    : null;

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/#schedule"
          className="text-primary hover:text-primary-dark text-sm font-medium mb-6 inline-block no-underline"
        >
          &larr; Back to schedule
        </Link>

        <header className="mb-10">
          <p className="text-primary font-semibold mb-2">{canvasClass.location_name}</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{canvasClass.class_name}</h1>
          <p className="text-lg text-ink-body mb-2">
            {formatClassDateTime(canvasClass.class_datetime)}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-ink-muted">
            {duration && <span>Duration: {duration}</span>}
            {canvasClass.attendee_count != null && (
              <span>{canvasClass.attendee_count} attendee{canvasClass.attendee_count !== 1 ? 's' : ''} registered</span>
            )}
          </div>
        </header>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-2">
            Painting <span className="text-primary">options</span>
          </h2>
          <p className="text-ink-muted mb-6">
            Participants in this session choose together which painting to create from the options below.
          </p>
          <PaintingGallery paintings={canvasClass.paintings} />
        </section>

        <div className="card bg-section-bg border-primary/20 text-center py-8">
          <h2 className="text-xl font-bold mb-3">Ready to join?</h2>
          <p className="text-ink-muted mb-6 max-w-md mx-auto">
            Book your seat for this session. You will complete checkout on our secure scheduling page.
          </p>
          <a
            href={getBookingUrl(canvasClass)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-lg px-10 py-4"
          >
            Book This Class
          </a>
        </div>
      </div>
    </div>
  );
}
