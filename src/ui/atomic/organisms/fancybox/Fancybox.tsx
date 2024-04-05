import { PropsWithChildren, useEffect, useRef } from 'react';
import { Fancybox as NativeFancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

export function Fancybox({
  delegate,
  options,
  children,
}: PropsWithChildren<{ delegate?: string; options?: Record<any, any> }>) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const delegateSelector = delegate || '[data-fancybox]';
    const fancyboxOptions = options || {};

    NativeFancybox.bind(container, delegateSelector, fancyboxOptions);

    return () => {
      NativeFancybox.unbind(container);
      NativeFancybox.close();
    };
  });

  return <div ref={containerRef}>{children}</div>;
}
