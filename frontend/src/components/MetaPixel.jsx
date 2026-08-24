import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { initMetaPixel, trackMetaPageView, META_PIXEL_ID } from '../lib/metaPixel';

/**
 * Boots Meta Pixel and re-fires PageView on client-side route changes.
 */
const MetaPixel = () => {
  const location = useLocation();
  const isFirstRoute = useRef(true);

  useEffect(() => {
    initMetaPixel();
  }, []);

  useEffect(() => {
    if (!META_PIXEL_ID) return;
    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      return;
    }
    trackMetaPageView();
  }, [location.pathname, location.search]);

  if (!META_PIXEL_ID) return null;

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
};

export default MetaPixel;
