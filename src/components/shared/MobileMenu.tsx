import React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

export default function MobileMenu({ isOpen, onToggle, children }: MobileMenuProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onToggle}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden text-gray-300 hover:text-white">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-gray-800/95 border-gray-700 backdrop-blur-sm">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Mobile navigation menu for the website</SheetDescription>
        <div className="space-y-1 mt-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface MobileMenuItemProps {
  href: string;
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function MobileMenuItem({ href, isActive, onClick, children }: MobileMenuItemProps) {
  return (
    <Button variant="ghost" asChild className={`w-full justify-start ${
      isActive 
        ? 'text-blue-400 bg-gray-700' 
        : 'text-gray-300 hover:text-white hover:bg-gray-700'
    }`}>
      <Link href={href} onClick={onClick}>
        {children}
      </Link>
    </Button>
  );
}

interface MobileMenuButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export function MobileMenuButton({ onClick, children, className = '' }: MobileMenuButtonProps) {
  return (
    <Button 
      variant="ghost"
      onClick={onClick}
      className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700 ${className}`}
    >
      {children}
    </Button>
  );
}

interface MobileMenuSectionProps {
  children: React.ReactNode;
}

export function MobileMenuSection({ children }: MobileMenuSectionProps) {
  return (
    <div className="border-t border-gray-700 pt-2">
      {children}
    </div>
  );
}