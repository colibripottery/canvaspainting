import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LOGO_URL, MAIN_SITE_URL } from '../data/locations';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-edge shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 text-ink no-underline">
            <img src={LOGO_URL} alt="Colibri Logo" className="w-8 h-8" />
            <span className="font-heading text-lg font-bold tracking-wide hidden sm:inline">
              Canvas Painting
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-6">
            <Link
              to="/"
              className="text-ink-muted hover:text-primary transition-colors text-sm no-underline"
            >
              Home
            </Link>
            <a
              href="/#schedule"
              className="text-ink-muted hover:text-primary transition-colors text-sm no-underline"
            >
              Schedule
            </a>
            <a
              href={MAIN_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark transition-colors text-sm font-medium no-underline"
            >
              Main Site
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden text-ink-muted hover:text-ink bg-transparent border-none p-2 cursor-pointer"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="sm:hidden pb-4 border-t border-edge mt-2 pt-4 space-y-2">
            <Link
              to="/"
              className="block text-ink-muted hover:text-primary transition-colors text-sm no-underline py-2"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <a
              href="/#schedule"
              className="block text-ink-muted hover:text-primary transition-colors text-sm no-underline py-2"
              onClick={() => setMobileOpen(false)}
            >
              Schedule
            </a>
            <a
              href={MAIN_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-primary font-medium text-sm no-underline py-2"
              onClick={() => setMobileOpen(false)}
            >
              Main Site
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
