import { RefObject, useEffect, useState } from 'react';

/**
 * This hook monitors the appearance of the page element in the screen scope.
 * @param trackedNode
 * @return {{item: null, visited: boolean, isIntersection: boolean}}
 */
export const useIntersected = (trackedNode: RefObject<any>, observerOptions = {}) => {
  const [intersected, setIntersected] = useState<{
    isIntersection: boolean;
    visited: boolean;
    item: IntersectionObserverEntry | null;
  }>({
    isIntersection: false,
    visited: false,
    item: null,
  });

  const observer = new IntersectionObserver(([item]) => {
    if (item.isIntersecting && !intersected.isIntersection) {
      setIntersected((prevState) => ({ ...prevState, isIntersection: true, visited: true, item }));
    } else if (!item.isIntersecting && intersected.isIntersection) {
      setIntersected((prevState) => ({ ...prevState, isIntersection: false, item }));
    } else if (item.isIntersecting && intersected.isIntersection && !intersected.visited) {
      setIntersected((prevState) => ({ ...prevState, isIntersection: true, visited: true, item }));
    }
  }, observerOptions);

  useEffect(() => {
    const { current = null } = trackedNode;
    if (!current) return;
    observer.observe(current);

    // eslint-disable-next-line consistent-return
    return () => observer.disconnect();
  });

  return intersected;
};
