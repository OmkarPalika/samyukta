'use client';

import { useRouter } from 'next/navigation';

export function useNavigation() {
  const router = useRouter();

  const openExternal = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const getCurrentURL = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  const copyToClipboard = async (text: string) => {
    if (typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  };

  const createObjectURL = (blob: Blob) => {
    if (typeof window !== 'undefined') {
      return URL.createObjectURL(blob);
    }
    return '';
  };

  const revokeObjectURL = (url: string) => {
    if (typeof window !== 'undefined') {
      URL.revokeObjectURL(url);
    }
  };

  return {
    openExternal,
    navigateTo,
    router,
    getCurrentURL,
    copyToClipboard,
    createObjectURL,
    revokeObjectURL
  };
}
