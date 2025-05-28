"use client";

import { useIsMobile } from "@/components/ui/use-mobile";
import { Bell } from "lucide-react";
import Image from "next/image";

export default function MobileHeader() {
  const isMobile = useIsMobile();
  if (!isMobile) return null;

  return (
    <header className="mobile-header">
      <Image src="/logo/price-pulse-logo.png" alt="PricePulse Logo" width={90} height={24} priority />
      <button className="mobile-header-bell" aria-label="Notifications">
        <Bell className="h-6 w-6" />
      </button>
    </header>
  );
} 