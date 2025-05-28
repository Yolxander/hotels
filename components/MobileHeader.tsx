"use client";

import { useIsMobile } from "@/components/ui/use-mobile";
import { Bell } from "lucide-react";

export default function MobileHeader() {
  const isMobile = useIsMobile();
  if (!isMobile) return null;

  return (
    <header className="mobile-header">
      <span className="mobile-header-title">PricePulse</span>
      <button className="mobile-header-bell" aria-label="Notifications">
        <Bell className="h-6 w-6" />
      </button>
    </header>
  );
} 