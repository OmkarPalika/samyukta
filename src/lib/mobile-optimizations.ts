'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from 'react';

// Device detection utilities
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
}

export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > 768 && window.innerWidth <= 1024;
}

export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > 1024;
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
}

// Viewport utilities
export function getViewportSize() {
  if (typeof window === 'undefined') return { width: 0, height: 0 };
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function getScreenSize() {
  if (typeof window === 'undefined') return { width: 0, height: 0 };
  return {
    width: window.screen.width,
    height: window.screen.height,
  };
}

// React hooks for responsive design
export function useViewport() {
  const [viewport, setViewport] = useState(getViewportSize());

  useEffect(() => {
    const handleResize = () => {
      setViewport(getViewportSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    ...viewport,
    isMobile: viewport.width <= 768,
    isTablet: viewport.width > 768 && viewport.width <= 1024,
    isDesktop: viewport.width > 1024,
  };
}

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isTouch: false,
    isIOS: false,
    isAndroid: false,
  });

  useEffect(() => {
    setDeviceType({
      isMobile: isMobile(),
      isTablet: isTablet(),
      isDesktop: isDesktop(),
      isTouch: isTouchDevice(),
      isIOS: isIOS(),
      isAndroid: isAndroid(),
    });
  }, []);

  return deviceType;
}

// Touch gesture utilities
export function useTouchGestures(element: React.RefObject<HTMLElement>) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    // Dispatch custom events
    if (isLeftSwipe) {
      element.current?.dispatchEvent(new CustomEvent('swipeLeft'));
    }
    if (isRightSwipe) {
      element.current?.dispatchEvent(new CustomEvent('swipeRight'));
    }
    if (isUpSwipe) {
      element.current?.dispatchEvent(new CustomEvent('swipeUp'));
    }
    if (isDownSwipe) {
      element.current?.dispatchEvent(new CustomEvent('swipeDown'));
    }
  }, [touchStart, touchEnd, element, minSwipeDistance]);

  useEffect(() => {
    const el = element.current;
    if (!el) return;

    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchmove', onTouchMove);
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [element, onTouchStart, onTouchMove, onTouchEnd]);

  return {
    touchStart,
    touchEnd,
    isSwipeLeft: touchStart && touchEnd && touchStart.x - touchEnd.x > minSwipeDistance,
    isSwipeRight: touchStart && touchEnd && touchStart.x - touchEnd.x < -minSwipeDistance,
    isSwipeUp: touchStart && touchEnd && touchStart.y - touchEnd.y > minSwipeDistance,
    isSwipeDown: touchStart && touchEnd && touchStart.y - touchEnd.y < -minSwipeDistance,
  };
}

// Performance optimizations for mobile
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options, hasIntersected]);

  return { isIntersecting, hasIntersected };
}

// Virtual scrolling for large lists on mobile
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    handleScroll,
  };
}

// Mobile-specific form optimizations
export function useMobileFormOptimizations() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [originalViewportHeight, setOriginalViewportHeight] = useState(0);

  useEffect(() => {
    if (!isMobile()) return;

    setOriginalViewportHeight(window.innerHeight);

    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = originalViewportHeight - currentHeight;
      
      // If height decreased by more than 150px, keyboard is likely open
      setIsKeyboardOpen(heightDifference > 150);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [originalViewportHeight]);

  return { isKeyboardOpen };
}

// Haptic feedback for mobile
export function triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light') {
  if (typeof window === 'undefined' || !('navigator' in window)) return;

  // For devices that support haptic feedback
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
    };
    navigator.vibrate(patterns[type]);
  }

  // For iOS devices with haptic feedback API
  if ('Taptic' in window) {
    const taptic = (window as any).Taptic;
    switch (type) {
      case 'light':
        taptic.impact({ style: 'light' });
        break;
      case 'medium':
        taptic.impact({ style: 'medium' });
        break;
      case 'heavy':
        taptic.impact({ style: 'heavy' });
        break;
    }
  }
}

// Mobile-optimized image loading
export function useMobileImageOptimization() {
  const [connectionType, setConnectionType] = useState<string>('4g');
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection.effectiveType || '4g');
      setSaveData(connection.saveData || false);

      const handleConnectionChange = () => {
        setConnectionType(connection.effectiveType || '4g');
        setSaveData(connection.saveData || false);
      };

      connection.addEventListener('change', handleConnectionChange);
      return () => connection.removeEventListener('change', handleConnectionChange);
    }
  }, []);

  const getImageQuality = () => {
    if (saveData) return 30;
    
    switch (connectionType) {
      case 'slow-2g':
      case '2g':
        return 40;
      case '3g':
        return 60;
      case '4g':
      default:
        return 80;
    }
  };

  const shouldLoadImages = () => {
    return !saveData || connectionType !== 'slow-2g';
  };

  return {
    connectionType,
    saveData,
    imageQuality: getImageQuality(),
    shouldLoadImages: shouldLoadImages(),
  };
}

// Mobile navigation utilities
export function useMobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return {
    isMenuOpen,
    toggleMenu,
    closeMenu,
  };
}

// Safe area utilities for mobile devices
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      setSafeArea({
        top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
      });
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', updateSafeArea);

    return () => {
      window.removeEventListener('resize', updateSafeArea);
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);

  return safeArea;
}

// Mobile-specific CSS classes
export const mobileClasses = {
  // Touch-friendly button sizes
  touchButton: 'min-h-[44px] min-w-[44px] touch-manipulation',
  
  // Prevent zoom on input focus
  noZoom: 'text-base', // 16px minimum to prevent zoom on iOS
  
  // Smooth scrolling
  smoothScroll: 'scroll-smooth overscroll-contain',
  
  // Hide scrollbars on mobile
  hideScrollbar: 'scrollbar-hide overflow-scroll',
  
  // Mobile-optimized spacing
  mobilePadding: 'px-4 sm:px-6 lg:px-8',
  mobileMargin: 'mx-4 sm:mx-6 lg:mx-8',
  
  // Safe area padding
  safeAreaTop: 'pt-safe-top',
  safeAreaBottom: 'pb-safe-bottom',
  safeAreaLeft: 'pl-safe-left',
  safeAreaRight: 'pr-safe-right',
  
  // Mobile-first responsive text
  responsiveText: 'text-sm sm:text-base lg:text-lg',
  responsiveHeading: 'text-xl sm:text-2xl lg:text-3xl',
  
  // Touch-optimized form inputs
  touchInput: 'min-h-[44px] text-base rounded-lg border-2 focus:border-blue-500',
  
  // Mobile-optimized cards
  mobileCard: 'rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6',
};

// Utility function to combine mobile classes
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Export all utilities
export const mobileUtils = {
  isMobile,
  isTablet,
  isDesktop,
  isTouchDevice,
  isIOS,
  isAndroid,
  getViewportSize,
  getScreenSize,
  triggerHapticFeedback,
  mobileClasses,
  cn,
};