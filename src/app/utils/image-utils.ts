import { from, Observable } from "rxjs";

export class ImageUtils {

    /**
     * Resizes an image (File, Blob or base64 string) to the specified dimensions.
     * Maintains aspect ratio if the image is larger than the specified dimensions.
     * @param image The image to resize
     * @param maxWidth Maximum width
     * @param maxHeight Maximum height
     * @returns An Observable that emits the resized image as a Blob
     */
    static resizeImage(image: any, maxWidth: number = 320, maxHeight: number = 320): Observable<Blob> {
        return from(new Promise<Blob>((resolve, reject) => {
            if (!image) {
                reject(new Error("No image provided"));
                return;
            }

            let source: string;
            let isObjectURL = false;

            if (image instanceof File || image instanceof Blob) {
                source = URL.createObjectURL(image);
                isObjectURL = true;
            } else if (typeof image === 'string') {
                source = image;
            } else {
                reject(new Error("Invalid image format. Expected File, Blob or base64 string."));
                return;
            }

            const img = new Image();
            img.src = source;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate aspect ratio to fit within maxWidth and maxHeight
                const ratio = Math.min(maxWidth / width, maxHeight / height);

                // Only downscale if the image is larger than the target area
                if (ratio < 1) {
                    width = width * ratio;
                    height = height * ratio;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    // Use better image smoothing
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';

                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error("Failed to convert canvas to blob"));
                        }
                    }, 'image/jpeg', 0.8); // JPEG format with 80% quality
                } else {
                    reject(new Error("Failed to get 2d context from canvas"));
                }

                if (isObjectURL) {
                    URL.revokeObjectURL(source);
                }
            };
            img.onerror = (err) => {
                if (isObjectURL) {
                    URL.revokeObjectURL(source);
                }
                reject(new Error("Failed to load image for resizing"));
            };
        }));
    }
}