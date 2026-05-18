// src/app/(store)/page.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const leagues = [
  { id: 'liga-profesional', name: 'Liga Profesional', bgClass: 'bg-gradient-to-br from-blue-900 to-blue-950' },
  { id: 'premier-league', name: 'Premier League', bgClass: 'bg-gradient-to-br from-purple-900 to-indigo-950' },
  { id: 'selecciones', name: 'Selecciones Nacionales', bgClass: 'bg-gradient-to-br from-sky-900 to-slate-900' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0a0a0a] to-[#0a0a0a] z-0" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto mt-[-10vh]">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter"
          >
            VISTIENDO <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              PASIÓN
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Las mejores camisetas del fútbol mundial. Calidad premium, talles para todos y envíos a todo el país.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Link 
              href="/catalog" 
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)] hover:-translate-y-1"
            >
              Ver Catálogo Completo
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Navegación por Ligas (Grilla) */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Explorar por Ligas</h2>
          <p className="text-gray-400">Encontrá la piel de tu equipo favorito.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {leagues.map((league, index) => (
            <Link href={`/catalog?category=${league.id}`} key={league.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative h-72 md:h-80 rounded-3xl overflow-hidden cursor-pointer border border-white/5 shadow-2xl ${league.bgClass}`}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="text-2xl font-bold text-white group-hover:-translate-y-2 transition-transform duration-300">
                    {league.name}
                  </h3>
                  <div className="h-0 overflow-hidden group-hover:h-6 transition-all duration-300">
                    <span className="text-blue-400 text-sm font-medium mt-2 block">Ver colección →</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}