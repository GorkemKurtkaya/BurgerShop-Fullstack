'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavigationWrapper() {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith('/admin');

    return !isAdminPage ? <Navbar /> : null;
} 