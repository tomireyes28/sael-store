// src/components/home/SocialGrid.tsx
'use client';

import { motion } from 'framer-motion';

// Creamos nuestro propio ícono SVG para no depender de la versión de lucide-react
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

const socialPosts = [
  { id: 1, img: '/social-1.jpg' },
  { id: 2, img: '/social-2.jpg' },
  { id: 3, img: '/social-3.jpg' },
  { id: 4, img: '/social-4.jpg' },
];

export function SocialGrid() {
  return (
    <section className="mb-20">
      <div className="flex flex-col items-center justify-center mb-10 text-center">
        <InstagramIcon className="text-[#FF5F00] w-8 h-8 mb-4" />
        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
          La Comunidad SAEL
        </h2>
        <p className="text-gray-400 mt-2">Etiquetanos usando tu camiseta en @sael.sport</p>
      </div>

      {/* Grilla responsiva: 2 fotos en celu, 4 en PC */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {socialPosts.map((post) => (
          <motion.div
            key={post.id}
            whileHover={{ y: -5 }}
            className="relative group aspect-square rounded-xl overflow-hidden bg-[#1a1a1a] cursor-pointer"
          >
            <img 
              src={post.img} 
              alt="SAEL Comunidad" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity duration-300"
            />
            {/* Overlay que aparece al hacer hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <InstagramIcon className="text-white w-10 h-10" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}