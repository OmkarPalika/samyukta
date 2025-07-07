'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Logo from '@/components/shared/Logo';
import UserMenu from '@/components/shared/UserMenu';
import MobileMenu, { MobileMenuItem, MobileMenuSection, MobileMenuButton } from '@/components/shared/MobileMenu';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuContent } from '@/components/ui/navigation-menu';

interface UserType {
  full_name: string;
  role?: string;
}

interface PublicNavigationProps {
  user: UserType | null;
  onLogout: () => void;
}

export default function PublicNavigation({ user, onLogout }: PublicNavigationProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { href: "Home", label: "Home", path: "/" },
    { href: "EventDetails", label: "Events", path: "/events" },
    { href: "Tickets", label: "Tickets", path: "/tickets" },
    { href: "FAQs", label: "FAQs", path: "/faqs" },
    { href: "Contact", label: "Contact", path: "/contact" },
  ];

  const aboutItems = [
    { href: "About", label: "About Us", path: "/about" },
    { href: "Speakers", label: "Speakers", path: "/speakers" },
    { href: "Sponsors", label: "Sponsors", path: "/sponsors" },
    { href: "Gallery", label: "Gallery", path: "/gallery" },
  ];

  const allNavItems = [...navItems, ...aboutItems];

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center nav-height">
          <Logo />
          
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="space-x-2">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    href="/" 
                    className={`px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors rounded-md ${
                      pathname === "/" ? 'text-blue-400 bg-gray-800/50' : ''
                    }`}
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors rounded-md bg-transparent">
                  About
                </NavigationMenuTrigger>
                <NavigationMenuContent className="shadow-md rounded-md bg-gray-900 border border-gray-700">
                  <div className="grid w-48 bg-gray-900 rounded-md">
                    {aboutItems.map((item) => (
                      <NavigationMenuLink key={item.href} asChild>
                        <Link
                          href={item.path}
                          className={`block px-3 py-2 text-gray-300 hover:text-blue-400 hover:bg-gray-800/50 transition-colors rounded-md ${
                            pathname === item.path ? 'text-blue-400 bg-gray-800/50' : ''
                          }`}
                        >
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    href="/events" 
                    className={`px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors rounded-md ${
                      pathname === "/events" ? 'text-blue-400 bg-gray-800/50' : ''
                    }`}
                  >
                    Events
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    href="/tickets" 
                    className={`px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors rounded-md ${
                      pathname === "/tickets" ? 'text-blue-400 bg-gray-800/50' : ''
                    }`}
                  >
                    Tickets
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    href="/faqs" 
                    className={`px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors rounded-md ${
                      pathname === "/faqs" ? 'text-blue-400 bg-gray-800/50' : ''
                    }`}
                  >
                    FAQs
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    href="/contact" 
                    className={`px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors rounded-md ${
                      pathname === "/contact" ? 'text-blue-400 bg-gray-800/50' : ''
                    }`}
                  >
                    Contact
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <UserMenu user={user} onLogout={onLogout} variant="public" />
          </div>

          {/* Mobile Menu */}
          <MobileMenu 
            isOpen={mobileMenuOpen} 
            onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            onClose={() => setMobileMenuOpen(false)}
          >
            {allNavItems.map((item) => (
              <MobileMenuItem 
                key={item.href}
                href={item.path}
                isActive={pathname === item.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </MobileMenuItem>
            ))}
            
            <MobileMenuSection>
              {user ? (
                <>
                  <MobileMenuItem 
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </MobileMenuItem>
                  <MobileMenuButton 
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </MobileMenuButton>
                </>
              ) : (
                <>
                  <MobileMenuItem 
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </MobileMenuItem>
                  <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:shadow-lg neon-glow">
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      Register Now
                    </Link>
                  </Button>
                </>
              )}
            </MobileMenuSection>
          </MobileMenu>
        </div>
      </div>
    </nav>
  );
}