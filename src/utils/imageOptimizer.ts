/**
 * Utilidad de compresión y optimización de imágenes en el cliente (Browser Canvas).
 * 
 * - Redimensiona imágenes gigantescas (de cámaras de 12-48 MP) a un tamaño óptimo para web (máx 1920px).
 * - Convierte a formato WebP moderno con compresión equilibrada (calidad 82%).
 * - Reduce archivos de 5MB-15MB a ~150KB-280KB en milisegundos sin pérdida perceptible de calidad visual.
 */

interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
}

export async function optimizarImagen(
  file: File,
  options: OptimizeOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1440,
    quality = 0.82,
    mimeType = 'image/webp'
  } = options;

  // Si no es imagen (ej. video u otro), devolver sin cambios
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // Si es GIF o SVG, no convertir
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let width = img.width;
      let height = img.height;

      // Calcular proporciones conservando aspect-ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) {
        resolve(file);
        return;
      }

      // Mejorar nitidez al reescalar
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fondo blanco por si hay transparencias al pasar a WebP/JPEG
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          // Si por alguna razón el archivo optimizado es mayor que el original, usamos el original
          if (blob.size >= file.size && file.type === mimeType) {
            resolve(file);
            return;
          }

          const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
          const extension = mimeType === 'image/webp' ? 'webp' : 'jpg';
          const optimizedFile = new File([blob], `${baseName}.${extension}`, {
            type: mimeType,
            lastModified: Date.now(),
          });

          resolve(optimizedFile);
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Optimiza un lote de archivos en paralelo
 */
export async function optimizarImagenes(
  files: File[],
  options?: OptimizeOptions
): Promise<File[]> {
  return Promise.all(files.map((file) => optimizarImagen(file, options)));
}
