import { useNavigate } from 'react-router-dom';

interface PanelItem {
  id: string;
  title: string;
  image: string;
  onClick: () => void;
  isExternal?: boolean;
  href?: string;
}

export default function HeroServicesMenu() {
  const navigate = useNavigate();

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const PANELS: PanelItem[] = [
    {
      id: 'propiedades',
      title: 'PROPIEDADES',
      image: '/hero_propiedades_real.png',
      onClick: () => navigate('/propiedades'),
    },
    {
      id: 'campos',
      title: 'CAMPOS',
      image: '/hero_campos_real.png',
      onClick: () => navigate('/propiedades?tipo=Campo'),
    },
    {
      id: 'tasaciones',
      title: 'TASACIONES',
      image: '/hero_tasaciones_real.png',
      onClick: () => handleScrollTo('tasaciones'),
    },
    {
      id: 'nosotros',
      title: 'NOSOTROS',
      image: '/hero_nosotros_real.png',
      onClick: () => handleScrollTo('equipo'),
    },
  ];

  return (
    <section id="servicios" className="relative w-full h-screen overflow-hidden bg-black select-none">
      <div className="flex flex-col md:flex-row w-full h-full">
        {PANELS.map((panel) => {
          const Tag = panel.isExternal ? 'a' : 'div';
          const extraProps = panel.isExternal
            ? { href: panel.href, target: '_blank', rel: 'noopener noreferrer' }
            : { onClick: panel.onClick };

          return (
            <Tag
              key={panel.id}
              {...extraProps}
              className="group relative flex-1 h-1/4 md:h-full w-full md:w-1/4 overflow-hidden border-b md:border-b-0 md:border-r border-white/25 last:border-b-0 last:border-r-0 cursor-pointer block transition-all duration-500"
            >
              {/* Imagen de fondo con Ken Burns hover zoom */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[7000ms] ease-out group-hover:scale-110 scale-100 transform-gpu"
                style={{
                  backgroundImage: `url('${panel.image}')`,
                  backgroundPosition: 'center center',
                  backgroundSize: 'cover',
                }}
              />

              {/* Dark Gradient Overlay (Verde/Negro oscuro a transparente/medio) */}
              <div
                className="absolute inset-0 transition-opacity duration-700 ease-in-out pointer-events-none group-hover:opacity-10 opacity-80"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(10, 24, 12, 0.88) 0%, rgba(15, 30, 15, 0.5) 45%, rgba(0, 0, 0, 0.85) 100%)',
                }}
              />

              {/* Contenido centrado: Línea superior - Título Cinzel - Línea inferior */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full px-3 md:px-5 text-center pointer-events-none">
                {/* Línea horizontal superior decorativa */}
                <div className="h-[1px] w-14 sm:w-20 md:w-24 bg-white/50 mb-4 sm:mb-5 md:mb-6 shadow-sm transition-all duration-500 group-hover:w-24 sm:group-hover:w-32 md:group-hover:w-36 group-hover:bg-white" />

                {/* Título en mayúsculas con la tipografía Cinzel */}
                <h3 className="font-['Cinzel',serif] uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.28em] text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] transition-all duration-500 group-hover:scale-[1.05]">
                  {panel.title}
                </h3>

                {/* Línea horizontal inferior decorativa */}
                <div className="h-[1px] w-14 sm:w-20 md:w-24 bg-white/50 mt-4 sm:mt-5 md:mt-6 shadow-sm transition-all duration-500 group-hover:w-24 sm:group-hover:w-32 md:group-hover:w-36 group-hover:bg-white" />
              </div>
            </Tag>
          );
        })}
      </div>
    </section>
  );
}
