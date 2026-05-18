// src/app/(store)/layout.tsx
import { Navbar } from '@/components/public/Navbar';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      {children}
    </div>
  );
}