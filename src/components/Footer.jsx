import { useEffect, useState } from 'react';
import { locations as staticLocations, MAIN_SITE_URL, LOGO_URL } from '../data/locations';
import { fetchLocations } from '../api/canvasClasses';

export default function Footer() {
  const [studioLocations, setStudioLocations] = useState(staticLocations);

  useEffect(() => {
    fetchLocations()
      .then((data) => {
        const nsj = data?.['North San Jose'];
        const campbell = data?.Campbell;
        const merged = [];
        if (nsj) {
          merged.push({
            id: 'north-san-jose',
            name: nsj.name || 'North San Jose',
            address: nsj.address,
            phone: staticLocations[0].phone,
          });
        }
        if (campbell) {
          merged.push({
            id: 'campbell',
            name: campbell.name || 'Campbell',
            address: campbell.address,
            phone: staticLocations[1].phone,
          });
        }
        if (merged.length > 0) setStudioLocations(merged);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-navy text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={LOGO_URL} alt="Colibri Logo" className="w-8 h-8" />
              <span className="font-heading text-lg font-bold">Colibri Pottery Studio</span>
            </div>
            <p className="text-white/60 text-sm mb-4">
              Guided canvas painting classes in Campbell and North San Jose. All supplies included.
            </p>
            <a
              href={MAIN_SITE_URL}
              className="text-primary hover:text-primary-dark transition-colors text-sm no-underline"
            >
              Visit Main Site &rarr;
            </a>
          </div>

          {studioLocations.map((loc) => (
            <div key={loc.id}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-3">
                {loc.name}
              </h3>
              <p className="text-white/60 text-sm mb-2">{loc.address}</p>
              <a
                href={`tel:${loc.phone.replace(/[^\d+]/g, '')}`}
                className="text-white/60 hover:text-primary text-sm no-underline transition-colors"
              >
                {loc.phone}
              </a>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            Hours: Mon–Sat 9:30 AM–9:00 PM | Sun 10:00 AM–7:00 PM
          </p>
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} Colibri Pottery Studio
          </p>
        </div>
      </div>
    </footer>
  );
}
