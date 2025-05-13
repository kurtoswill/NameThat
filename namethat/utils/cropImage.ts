type PixelCrop = { x: number; y: number; width: number; height: number };

export default function getCroppedImg(imageSrc: string, pixelCrop: PixelCrop): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const image = new window.Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject();
            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            );
            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject();
            }, "image/png");
        };
        image.onerror = reject;
    });
}