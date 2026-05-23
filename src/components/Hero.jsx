const COLIBRI_UPLOADS = 'https://www.colibripotterystudio.com/uploads/b/245acfb160a708db2cc9da85874241c4756e5a0c1348bfed823b0bb41c475c5c';
const HERO_BACKGROUND_URL = `${COLIBRI_UPLOADS}/1695339229646_1695339232.jpg`;

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center pt-16 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${HERO_BACKGROUND_URL}')` }}
      />
      <div className="absolute inset-0 bg-navy/70" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
          Canvas <span className="text-primary">Painting</span> Classes
        </h1>
        <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Browse our monthly schedule, explore painting options for each session,
          and book your spot at Colibri Pottery Studio.
        </p>
        <a href="#schedule" className="btn-primary text-lg px-8 py-4 no-underline">
          View Schedule
        </a>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
