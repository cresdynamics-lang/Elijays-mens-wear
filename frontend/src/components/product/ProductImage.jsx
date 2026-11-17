import { useState } from 'react';
import { resolveDisplayImageUrl } from '../../utils/cloudinary';

// Keying the inner image resets failure state whenever the selected image changes.
const ImageAttempt = ({ src, alt, className, ...props }) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span role="img" aria-label={`${alt || 'Product'}: image unavailable`}
        className={`flex items-center justify-center bg-gray-100 text-gray-500 text-xs text-center p-2 ${className || ''}`}>
        Image unavailable
      </span>
    );
  }
  return <img {...props} src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
};

export default function ProductImage({ src, ...props }) {
  const resolved = resolveDisplayImageUrl(src, { width: 800 });
  return <ImageAttempt key={resolved} src={resolved} {...props} />;
}
