import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { LucideIcon } from 'lucide-react';
import './AccordionGallery.css';

export interface AccordionItem {
  id?: string | number;
  title: string;
  desc: string;
  image?: string;
  imageClass?: string;
  icon?: LucideIcon | React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  isCatalog?: boolean;
  link?: string;
}

export interface AccordionGalleryProps {
  items: AccordionItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  grayscale?: boolean;
  showLabels?: boolean;
  duration?: number;
  ease?: string;
  trigger?: 'hover' | 'click';
  height?: number | string;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: 'horizontal' | 'vertical';
}

export default function AccordionGallery({
  items,
  defaultIndex = 0,
  accentColor = '#5B8A61',
  overlayColor = '#1A241A',
  textColor = '#ffffff',
  grayscale = false,
  showLabels = true,
  duration = 0.6,
  ease = 'power3.out',
  trigger = 'hover',
  height = 540,
  gap = 12,
  radius = 24,
  expandRatio = 0.5,
}: AccordionGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number>(defaultIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Trigger GSAP entrance animation for active text & button strictly AFTER panel expands
  useEffect(() => {
    const activeEl = contentRefs.current[activeIndex];
    if (activeEl) {
      const children = Array.from(activeEl.children) as HTMLElement[];
      const textElements = children.slice(0, 2); // Título y descripción
      const buttonElement = children[2];        // Botón CTA (si existe)

      gsap.killTweensOf(children);

      // Estado inicial oculto: texto desde la izquierda, botón desde abajo
      gsap.set(textElements, { opacity: 0, x: -30, y: 0 });
      if (buttonElement) {
        gsap.set(buttonElement, { opacity: 0, x: 0, y: 20 });
      }

      const animDuration = duration || 0.45;
      const animEase = ease || 'power2.out';

      const tl = gsap.timeline({ delay: 0.30 });

      // 1. Texto entra de izquierda a derecha con movimiento fluido
      tl.to(textElements, {
        opacity: 1,
        x: 0,
        duration: animDuration,
        stagger: 0.12,
        ease: animEase,
      });

      // 2. El botón sube fluidamente desde abajo y queda fijo en posición
      if (buttonElement) {
        tl.to(
          buttonElement,
          {
            opacity: 1,
            y: 0,
            duration: animDuration,
            ease: animEase,
          },
          '-=0.08'
        );
      }
    }
  }, [activeIndex, duration, ease]);

  const handleInteraction = (index: number) => {
    if (activeIndex !== index) {
      setActiveIndex(index);
    }
  };

  return (
    <div
      ref={containerRef}
      className="accordion-gallery-container"
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        gap: `${gap}px`,
      }}
    >
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        const IconComponent = item.icon;

        // Calculate flex grow ratio based on expandRatio prop
        const totalItems = items.length;
        const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
        const grow = totalItems > 1 ? (r * (totalItems - 1)) / (1 - r) : 1;
        const flexValue = isActive ? grow : 1;

        return (
          <div
            key={item.id || item.title || index}
            className={`accordion-panel ${isActive ? 'is-active' : ''}`}
            style={{
              flex: flexValue,
              borderRadius: `${radius}px`,
            }}
            onMouseEnter={trigger === 'hover' ? () => handleInteraction(index) : undefined}
            onClick={() => handleInteraction(index)}
          >
            {/* Special Catalog CTA Panel */}
            {item.isCatalog ? (
              <div className="absolute inset-0 bg-gradient-to-br from-[#2a3c2a] via-[#1a2c1a] to-[#0d180d] z-0 flex flex-col justify-between p-8 text-center items-center overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-roma-leaf/10 rounded-full blur-3xl pointer-events-none" />
                
                {/* Collapsed State Icon & Label */}
                {!isActive && (
                  <div className="h-full flex flex-col items-center justify-center gap-4 text-white/70">
                    {IconComponent && <IconComponent size={32} strokeWidth={1.5} className="text-roma-leaf" />}
                    {showLabels && (
                      <span className="text-sm font-semibold tracking-[0.18em] uppercase text-white/90 [writing-mode:vertical-lr] rotate-180">
                        {item.title}
                      </span>
                    )}
                  </div>
                )}

                {/* Expanded State Content */}
                {isActive && (
                  <div
                    ref={(el) => { contentRefs.current[index] = el; }}
                    className="w-full h-full flex flex-col items-center justify-center relative z-10 py-6 px-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-roma-leaf/20 border border-roma-leaf/30 flex items-center justify-center mb-6">
                      {IconComponent && <IconComponent size={28} strokeWidth={1.5} className="text-roma-leaf" />}
                    </div>

                    <h3 className="text-2xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
                      {item.title}
                    </h3>

                    <p className="text-white/70 text-sm md:text-base font-light leading-relaxed max-w-sm mb-8">
                      {item.desc}
                    </p>

                    <Link
                      to="/propiedades"
                      className="bg-roma-olive hover:bg-roma-olive/90 text-white px-8 py-3.5 rounded-full font-semibold text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-105 border border-white/10"
                    >
                      Ver Catálogo
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              /* Regular Service Image Panel */
              <>
                {/* Background Image */}
                {item.image && (
                  <div className="accordion-image-wrapper">
                    <img
                      src={item.image}
                      alt={item.title}
                      className={`accordion-image ${item.imageClass || ''}`}
                      style={{
                        filter: grayscale && !isActive ? 'grayscale(80%)' : 'none',
                      }}
                    />
                  </div>
                )}

                {/* Dark Overlay (Dim inactive panels) */}
                <div
                  className="accordion-overlay"
                  style={{
                    backgroundColor: overlayColor,
                    opacity: isActive ? 0.50 : 0.85,
                  }}
                />

                {/* Bottom gradient shading for high contrast text without container box */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-[3] pointer-events-none" />
                )}

                {/* Collapsed State Title (vertical label) */}
                {!isActive && showLabels && (
                  <span className="accordion-title-collapsed">
                    {item.title}
                  </span>
                )}

                {/* Expanded Active Panel Content */}
                {isActive && (
                  <div
                    ref={(el) => { contentRefs.current[index] = el; }}
                    className="accordion-content"
                  >
                    <div className="flex items-center gap-3.5 mb-3.5">
                      <div
                        className="accordion-accent-bar"
                        style={{ backgroundColor: accentColor }}
                      />
                      <h3
                        className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
                        style={{ color: textColor }}
                      >
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-white/90 text-base md:text-lg font-light leading-relaxed max-w-xl mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                      {item.desc}
                    </p>

                    {item.link && (
                      <Link
                        to={item.link}
                        className="inline-flex items-center gap-2 bg-roma-olive hover:bg-roma-olive/90 text-white px-7 py-3 rounded-full font-semibold text-xs uppercase tracking-widest shadow-xl transition-transform hover:scale-105 border border-white/10 w-fit mt-2 pointer-events-auto"
                      >
                        <span>Ver {item.title}</span>
                        <span className="material-icons text-sm">arrow_forward</span>
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
