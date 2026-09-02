/**
 * Resize/compress images before upload — faster saves and smaller Cloudinary delivery.
 * Uses WebP where supported with JPEG fallback for maximum quality at minimal size.
 */
export async function compressImageFile(
  file,
  { maxWidth = 1920, maxHeight = 1920, quality = 0.85, skipBelowBytes = 200_000, targetMaxBytes = 800_000 } = {}
) {
  if (!file?.type?.startsWith('image/')) return file;
  if (file.size <= skipBelowBytes) return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close?.();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const formats = ['image/webp', 'image/jpeg'];
  for (const fmt of formats) {
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, fmt, quality);
    });
    if (blob && blob.size < file.size) {
      if (blob.size <= targetMaxBytes) {
        const baseName = (file.name || 'image').replace(/\.[^.]+$/, '') || 'image';
        return new File([blob], `${baseName}.${fmt === 'image/webp' ? 'webp' : 'jpg'}`, { type: fmt, lastModified: Date.now() });
      }
      // WebP/JPEG under original size but over target — return it anyway since it's still smaller
      const baseName = (file.name || 'image').replace(/\.[^.]+$/, '') || 'image';
      return new File([blob], `${baseName}.${fmt === 'image/webp' ? 'webp' : 'jpg'}`, { type: fmt, lastModified: Date.now() });
    }
  }

  return file;
}
