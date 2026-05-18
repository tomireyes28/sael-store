// src/components/public/SizeSelector.tsx
'use client';

interface Variant {
  size: string;
  stock: number;
}

interface SizeSelectorProps {
  variants: Variant[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
}

export function SizeSelector({ variants, selectedSize, onSelectSize }: SizeSelectorProps) {
  // Ordenamos los talles lógicamente (S, M, L, XL)
  const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL'];
  const sortedVariants = [...variants].sort((a, b) => sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size));

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-bold text-white uppercase">Seleccioná tu talle</span>
        <button className="text-xs text-[#FF5F00] font-bold hover:underline">Guía de talles</button>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {sortedVariants.map((variant) => {
          const isOutOfStock = variant.stock === 0;
          const isSelected = selectedSize === variant.size;

          return (
            <button
              key={variant.size}
              disabled={isOutOfStock}
              onClick={() => onSelectSize(variant.size)}
              className={`
                h-12 w-16 rounded flex items-center justify-center font-bold text-sm transition-all
                ${isOutOfStock 
                  ? 'bg-[#1a1a1a] text-[#444] cursor-not-allowed border border-[#333] line-through' 
                  : isSelected
                    ? 'bg-[#FF5F00] text-white border-2 border-[#FF5F00] shadow-[0_0_15px_rgba(255,95,0,0.4)]'
                    : 'bg-[#1e1e1e] text-gray-300 border border-[#333] hover:border-[#FF5F00] hover:text-white'
                }
              `}
            >
              {variant.size}
            </button>
          );
        })}
      </div>
    </div>
  );
}