import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HERO_SLIDES } from '../data/homepageContent';
import { heroImageUrl, isCloudinaryUrl } from '../utils/cloudinary';

const getSlideImage = (slide) => {
  const src = slide?.image;
  if (!src) return '';
  return isCloudinaryUrl(src) ? heroImageUrl(src) : src;
};

const normalizeSlides = (rows = []) =>
  rows
    .filter((slide) => slide?.image)
    .map((slide) => ({
      ...slide,
      image: getSlideImage(slide),
      link: slide.link || slide.fallbackLink || '/products',
      cta: slide.cta || 'View Product',
      desc: slide.desc || slide.description || slide.subtitle || '',
    }));

const HeroSlider = ({ heroSlides }) => {
  const fallbackSlides = useMemo(() => normalizeSlides(HERO_SLIDES), []);
  const liveSlides = useMemo(
    () => (heroSlides?.length ? normalizeSlides(heroSlides) : null),
    [heroSlides]
  );
  const slides = liveSlides?.length ? liveSlides : fallbackSlides;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent(0);
  }, [slides]);

  useEffect(() => {
    if (!slides.length) return undefined;
    const preload = (idx) => {
      const slide = slides[idx];
      if (!slide?.image) return;
      const img = new Image();
      img.src = slide.image;
    };
    preload(0);
    preload(1);
    const timer = setInterval(() => {
      setCurrent((prev) => {
        const next = prev === slides.length - 1 ? 0 : prev + 1;
        preload((next + 1) % slides.length);
        return next;
      });
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  if (!slides.length) return null;
  const slide = slides[current];

  return (
    <section className="hero-section relative min-h-[90vh] bg-surface-900 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${slide.link}-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {slide.image && (
            <img
              src={slide.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-center"
              decoding="async"
              fetchPriority={current === 0 ? 'high' : 'auto'}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-surface-900/90 via-surface-900/50 to-surface-900/20" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="container mx-auto px-6 pb-10 md:pb-14 lg:pb-16 w-full max-w-7xl space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${slide.link}-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 max-w-4xl"
            >
              <div className="flex items-center space-x-4">
                <div className="h-px w-10 bg-accent-500" />
                <p className="text-accent-400 tracking-[0.4em] text-[10px] font-bold uppercase">
                  {slide.subtitle}
                </p>
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif text-secondary leading-[0.85] tracking-tight max-w-4xl">
                {slide.title.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 === 1 ? 'text-accent italic font-medium' : ''}>
                    {word}{' '}
                  </span>
                ))}
              </h1>

              <p className="text-xl md:text-2xl text-secondary/80 max-w-2xl font-medium leading-relaxed">
                {slide.desc}
              </p>

              <div className="pt-4">
                <Link
                  to={slide.link}
                  className="bg-accent text-primary px-12 py-5 text-[10px] font-bold tracking-[0.22em] inline-flex items-center space-x-4 group shadow-lg shadow-accent/20 hover:bg-accent/80 transition-colors"
                >
                  <span>{slide.cta}</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-10 right-6 md:right-10 flex items-center space-x-5 z-20">
          <div className="flex items-center space-x-2 mr-6">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`h-[3px] transition-all duration-500 ${current === i ? 'w-10 bg-accent-500' : 'w-6 bg-white/20 hover:bg-white/40'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={prevSlide}
            className="w-11 h-11 border border-white/20 flex items-center justify-center text-secondary dark:text-secondary dark:text-secondary dark:text-secondary dark:text-secondary dark:text-white hover:bg-white/10 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="w-11 h-11 border border-white/20 flex items-center justify-center text-secondary dark:text-secondary dark:text-secondary dark:text-secondary dark:text-secondary dark:text-white hover:bg-white/10 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroSlider;
