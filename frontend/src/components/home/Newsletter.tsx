// src/components/home/Newsletter.tsx
'use client';

export function Newsletter() {
  return (
    <section className="bg-[#FF5F00] py-16 px-6 mt-10">
      <div className="max-w-[800px] mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase mb-4 leading-tight">
          Unite al equipo titular
        </h2>
        <p className="text-white/90 text-lg mb-8 font-medium">
          Dejanos tu email y llevate un <strong>10% de descuento</strong> en tu primera compra, además de enterarte antes de los nuevos ingresos.
        </p>
        
        <form 
          onSubmit={(e) => e.preventDefault()} 
          className="flex flex-col md:flex-row gap-3 justify-center max-w-[500px] mx-auto"
        >
          <input 
            type="email" 
            placeholder="tu@email.com" 
            required
            className="flex-1 bg-white text-black px-6 py-4 rounded font-bold focus:outline-none focus:ring-4 focus:ring-black/20 placeholder-gray-500"
          />
          <button 
            type="submit"
            className="bg-[#121212] hover:bg-black text-white font-black uppercase px-8 py-4 rounded transition-colors shadow-lg"
          >
            Suscribirme
          </button>
        </form>
      </div>
    </section>
  );
}