// src/app/(store)/layout.tsx
import { Navbar } from '@/components/public/Navbar';
import { CartDrawer } from '@/components/public/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Navbar />
      <CartDrawer />
      {children}
      <WhatsAppButton />
    </div>
  );
}