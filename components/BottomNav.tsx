"use client";
import Link from "next/link";
import { useIsMobile } from "@/components/ui/use-mobile";
import { usePathname, useRouter } from "next/navigation";
import { Building, LayoutDashboard, LogOut, Users, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HotelTrackerForm } from "@/components/hotel-tracker-form";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";

export default function BottomNav() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut } = useAuth();

  if (!isMobile) return null;

  // Helper to check active link
  const isActive = (href: string) => pathname === href;

  // Plus button handler: go to dashboard and open dialog
  const handlePlusClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (pathname !== "/dashboard") {
      router.push("/dashboard");
      setTimeout(() => setIsDialogOpen(true), 400);
    } else {
      setIsDialogOpen(true);
    }
  };

  // Login/Logout handler
  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAuthModalOpen(true);
  };
  const handleLogoutClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut();
    router.push("/");
  };

  return (
    <>
      <nav className="bottom-nav">
        <Link href="/" className={`nav-item${isActive("/") ? " active" : ""}`}>
          <Building className="h-5 w-5 mb-1" />
          <span className="label">Home</span>
        </Link>
        <Link href="/top-hotels" className={`nav-item${isActive("/top-hotels") ? " active" : ""}`}>
          <Building className="h-5 w-5 mb-1" />
          <span className="label">Top Hotels</span>
        </Link>
        <button className="nav-item plus-btn" onClick={handlePlusClick} aria-label="Track Booking">
          <Plus className="h-6 w-6" />
        </button>
        <Link href="/dashboard" className={`nav-item${isActive("/dashboard") ? " active" : ""}`}>
          <LayoutDashboard className="h-5 w-5 mb-1" />
          <span className="label">Dashboard</span>
        </Link>
        {user ? (
          <button className="nav-item" onClick={handleLogoutClick} aria-label="Logout">
            <LogOut className="h-5 w-5 mb-1" />
            <span className="label">Logout</span>
          </button>
        ) : (
          <button className="nav-item" onClick={handleLoginClick} aria-label="Login">
            <Users className="h-5 w-5 mb-1" />
            <span className="label">Login</span>
          </button>
        )}
      </nav>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Track a New Hotel Booking</DialogTitle>
          </DialogHeader>
          <HotelTrackerForm onSubmit={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
} 