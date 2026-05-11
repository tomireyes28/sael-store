// src/middleware.ts (o frontend/middleware.ts)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Buscamos la cookie que vamos a guardar en el login
  const token = request.cookies.get('sael_admin_token')?.value;
  const url = request.nextUrl.pathname;

  const isLoginPage = url.startsWith('/admin/login');
  const isAdminRoute = url.startsWith('/admin');

  // Si quiere entrar al admin y NO tiene token, lo pateamos al login
  if (isAdminRoute && !isLoginPage && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Si ya está logueado y quiere entrar al login, lo mandamos al dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// Le decimos a Next que solo ejecute este middleware en las rutas de admin
export const config = {
  matcher: ['/admin/:path*'],
};