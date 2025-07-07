import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ href = "/", size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: '24',
    md: '32',
    lg: '40'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl', 
    lg: 'text-2xl'
  };

  return (
    <Link href={href} className="flex items-center space-x-2">
      <div className="flex items-center justify-center">
        <Image 
          src="/logo.png"
          alt="Logo"
          width={Number(sizeClasses[size])}
          height={Number(sizeClasses[size])}
        />
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent`}>
          Samyukta 2025
        </span>
      )}
    </Link>
  );
}
