// utils/cropImage.js
export const getCroppedImg = (imageSrc, crop, zoom = 1) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.crossOrigin = "anonymous"; // Handle cross-origin
  
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        // Calculate the actual cropping area
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
  
        // Set canvas width and height to match the crop size
        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;
  
        // Draw the image onto the canvas, taking into account the zoom factor
        ctx.drawImage(
          image,
          crop.x * scaleX,    // x coordinate where to start cropping in the source image
          crop.y * scaleY,    // y coordinate where to start cropping in the source image
          crop.width * scaleX, // width to crop in the source image
          crop.height * scaleY, // height to crop in the source image
          0,  // x coordinate where to place the result on the canvas
          0,  // y coordinate where to place the result on the canvas
          crop.width * scaleX,  // width of the result on the canvas
          crop.height * scaleY  // height of the result on the canvas
        );
  
        // Convert canvas to a Blob or data URL
        canvas.toBlob(
          (blob) => {
            const url = URL.createObjectURL(blob);
            resolve(url);
          },
          "image/jpeg",
          1
        );
      };
  
      image.onerror = (err) => {
        reject(err);
      };
    });
  };
  