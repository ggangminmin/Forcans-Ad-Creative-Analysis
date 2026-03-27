'use client';

import { useEffect } from 'react';

export default function AdCreativeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 글로벌 사이드바 숨기기 + main ml 제거
    const sidebar = document.querySelector('aside.fixed');
    const main = document.querySelector('main.ml-\\[230px\\]') as HTMLElement;
    
    if (sidebar) (sidebar as HTMLElement).style.display = 'none';
    if (main) main.style.marginLeft = '0';
    
    return () => {
      if (sidebar) (sidebar as HTMLElement).style.display = '';
      if (main) main.style.marginLeft = '';
    };
  }, []);

  return <>{children}</>;
}
