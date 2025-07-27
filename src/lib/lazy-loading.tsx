'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { lazy, Suspense, ComponentType } from 'react';
import Loading from '@/components/shared/Loading';

// Generic lazy loading wrapper with error boundary
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = lazy(importFn);
  
  return function LazyWrapper(props: React.ComponentProps<T>) {
    const FallbackComponent = fallback || Loading;
    
    return (
      <Suspense fallback={<FallbackComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Specific lazy components for large/heavy components
// Note: These components need to be created or imports updated

// export const LazyUserManagementTable = createLazyComponent(
//   () => import('@/components/admin/UserManagementTable').then(m => ({ default: m.UserManagementTable }))
// );

// export const LazyAnalyticsCharts = createLazyComponent(
//   () => import('@/components/admin/analytics/RegistrationChart')
// );

// export const LazyQRScanner = createLazyComponent(
//   () => import('@/components/dashboard/QRScanner')
// );

// export const LazyInteractiveMap = createLazyComponent(
//   () => import('@/components/shared/InteractiveMap')
// );

// Lazy load heavy chart components
// Note: These analytics components need to be created

// export const LazyRevenueChart = createLazyComponent(
//   () => import('@/components/admin/analytics/RevenueChart')
// );

// export const LazyDemographicsChart = createLazyComponent(
//   () => import('@/components/admin/analytics/DemographicsChart')
// );

// export const LazyParticipationChart = createLazyComponent(
//   () => import('@/components/admin/analytics/ParticipationChart')
// );

// export const LazyTeamSizeAnalysis = createLazyComponent(
//   () => import('@/components/admin/analytics/TeamSizeAnalysis')
// );

// Intersection Observer hook for lazy loading on scroll
export function useIntersectionObserver(
  ref: React.RefObject<Element | null>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
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
  }, [ref, options]);

  return isIntersecting;
}

// Component for lazy loading on scroll
export function LazyOnScroll({ 
  children, 
  fallback = <Loading />,
  className = '',
  threshold = 0.1,
  rootMargin = '50px'
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(ref, { threshold, rootMargin });

  return (
    <div ref={ref} className={className}>
      {isIntersecting ? children : fallback}
    </div>
  );
}