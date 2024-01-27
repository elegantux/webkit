import React, { useEffect, useRef, useState } from 'react';

/**
 * This hook returns a tuple containing a reference to an HTML element and a ref used to interface with the component.
 * It is used to pass a reference to an HTML element into the Swiper component.
 */
export const useSwiperRef = (): [HTMLElement | null, React.Ref<any> | null] => {
  const [wrapper, setWrapper] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    setWrapper(ref.current);
  }, []);

  return [wrapper, ref];
};
