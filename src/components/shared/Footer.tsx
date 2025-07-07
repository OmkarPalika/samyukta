import React from 'react';
import { Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="bg-gray-900/50 border-t border-gray-800">
      <div className="container-responsive component-padding text-center">
        <div className="text-spacing-lg">
          <div className="flex justify-center" style={{ gap: 'var(--gap-md)' }}>
            <Button variant="ghost" size="sm" asChild className="text-gray-400 hover:text-white">
              <a 
                href="https://instagram.com/samyukta.2025" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-gray-400 hover:text-white">
              <a 
                href="https://www.linkedin.com/groups/14723748/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </Button>
          </div>
          <div className="text-spacing">
            <p className="text-gray-400 text-sm">&copy; 2025 Samyukta, ANITS. All rights reserved.</p>
            <p className="text-gray-500 text-xs">Designed & Developed with ❤️</p>
          </div>
        </div>
      </div>
    </footer>
  );
}