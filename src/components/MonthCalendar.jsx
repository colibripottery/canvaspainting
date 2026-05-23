import { formatMonthYear, getCalendarDays, toDateKey } from '../utils/dates';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const LOCATION_OPTIONS = [
  { value: '', label: 'All locations' },
  { value: 'Campbell', label: 'Campbell' },
  { value: 'NSJ', label: 'North San Jose' },
];

export default function MonthCalendar({
  year,
  month,
  selectedDateKey,
  classesByDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  location,
  onLocationChange,
}) {
  const days = getCalendarDays(year, month);
  const todayKey = toDateKey(new Date().toISOString());

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPrevMonth}
            className="p-2 rounded-full border border-edge hover:border-primary hover:text-primary transition-colors bg-white cursor-pointer"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold min-w-[180px] text-center">
            {formatMonthYear(year, month)}
          </h2>
          <button
            type="button"
            onClick={onNextMonth}
            className="p-2 rounded-full border border-edge hover:border-primary hover:text-primary transition-colors bg-white cursor-pointer"
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by location">
          {LOCATION_OPTIONS.map((opt) => (
            <button
              key={opt.value || 'all'}
              type="button"
              onClick={() => onLocationChange(opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer border ${
                location === opt.value
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-ink-muted border-edge hover:border-primary'
              }`}
              aria-pressed={location === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="grid grid-cols-7 gap-1 sm:gap-2 mb-2"
        role="row"
        aria-hidden="true"
      >
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-ink-muted py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2" role="grid" aria-label="Class calendar">
        {days.map((cell) => {
          const { dateKey } = cell;
          const count = classesByDate.get(dateKey)?.length ?? 0;
          const isSelected = selectedDateKey === dateKey;
          const isToday = todayKey === dateKey;

          return (
            <button
              key={dateKey}
              type="button"
              role="gridcell"
              onClick={() => onSelectDate(dateKey)}
              className={`
                relative min-h-[52px] sm:min-h-[64px] rounded-lg text-sm transition-colors cursor-pointer
                ${!cell.inMonth ? 'text-ink-light/50 cursor-default' : 'text-ink hover:bg-section-bg'}
                ${isSelected ? 'bg-primary/15 ring-2 ring-primary' : ''}
                ${isToday && cell.inMonth ? 'font-bold' : ''}
              `}
              aria-label={
                cell.inMonth
                  ? `${cell.day}, ${count} class${count !== 1 ? 'es' : ''}`
                  : undefined
              }
              aria-selected={isSelected}
            >
              <span className="block pt-1">{cell.day}</span>
              {count > 0 && cell.inMonth && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {count <= 3 ? (
                    Array.from({ length: count }).map((_, i) => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
                    ))
                  ) : (
                    <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1 rounded">
                      {count}
                    </span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
