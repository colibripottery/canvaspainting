import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Hero from '../components/Hero';
import MonthCalendar from '../components/MonthCalendar';
import ClassCard from '../components/ClassCard';
import { fetchCanvasClasses } from '../api/canvasClasses';
import {
  formatClassDate,
  getMonthBounds,
  groupClassesByDate,
  toDateKey,
} from '../utils/dates';

export default function Home() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [location, setLocation] = useState('');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(today.toISOString()));
  const dayPanelRef = useRef(null);

  const loadClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { minDate, maxDate } = getMonthBounds(year, month);
    try {
      const data = await fetchCanvasClasses({
        minDate,
        maxDate,
        location: location || undefined,
        onlyWithPaintings: true,
        refresh: true,
      });
      setClasses(data);
    } catch (err) {
      setError(err.message || 'Failed to load schedule');
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, [year, month, location]);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const classesByDate = useMemo(() => groupClassesByDate(classes), [classes]);

  const selectedClasses = useMemo(
    () => classesByDate.get(selectedDateKey) ?? [],
    [classesByDate, selectedDateKey],
  );

  const upcomingClasses = useMemo(() => {
    const now = Date.now();
    return [...classes]
      .filter((c) => new Date(c.class_datetime).getTime() >= now)
      .sort((a, b) => new Date(a.class_datetime) - new Date(b.class_datetime))
      .slice(0, 3);
  }, [classes]);

  const handleSelectDate = (dateKey) => {
    setSelectedDateKey(dateKey);
    dayPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <>
      <Hero />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Paint Your Own <span className="text-primary">Masterpiece</span>
          </h2>
          <p className="text-ink-body leading-relaxed">
            Join a guided two-hour canvas painting session. Each class offers a selection of
            paintings to choose from as a group. All supplies are included.
          </p>
        </div>

        {upcomingClasses.length > 0 && !loading && (
          <div className="mb-16">
            <h3 className="text-xl font-bold mb-4">Coming up soon</h3>
            <div className="grid gap-4">
              {upcomingClasses.map((cls) => (
                <ClassCard key={cls.acuity_class_id} canvasClass={cls} />
              ))}
            </div>
          </div>
        )}
      </section>

      <section
        id="schedule"
        className="bg-section-bg py-16 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-center">
            Class <span className="text-primary">Schedule</span>
          </h2>
          <p className="text-ink-muted text-center mb-10 max-w-xl mx-auto">
            Select a day on the calendar to see available sessions and painting options.
          </p>

          <MonthCalendar
            year={year}
            month={month}
            selectedDateKey={selectedDateKey}
            classesByDate={classesByDate}
            onSelectDate={handleSelectDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            location={location}
            onLocationChange={setLocation}
          />

          {loading && (
            <div className="flex justify-center py-12" role="status" aria-live="polite">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="sr-only">Loading schedule</span>
            </div>
          )}

          {error && !loading && (
            <div className="card border-red-200 bg-red-50 text-center py-8 mt-8">
              <p className="text-ink-body mb-4">{error}</p>
              <button type="button" onClick={loadClasses} className="btn-primary">
                Try again
              </button>
            </div>
          )}

          {!loading && !error && classes.length === 0 && (
            <p className="text-center text-ink-muted py-12 mt-8">
              No canvas painting classes scheduled this month. Check back soon or visit our main site.
            </p>
          )}

          <div ref={dayPanelRef} className="mt-10">
            {!loading && !error && selectedDateKey && (
              <>
                <h3 className="text-xl font-bold mb-4">
                  {selectedClasses.length > 0
                    ? `Classes on ${formatClassDate(selectedClasses[0].class_datetime)}`
                    : `No classes on ${formatClassDate(`${selectedDateKey}T12:00:00-07:00`)}`}
                </h3>
                {selectedClasses.length > 0 ? (
                  <div className="grid gap-4">
                    {selectedClasses.map((cls) => (
                      <ClassCard key={cls.acuity_class_id} canvasClass={cls} />
                    ))}
                  </div>
                ) : (
                  <p className="text-ink-muted">
                    Select another day with highlighted dots, or try a different location filter.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
