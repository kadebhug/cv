import { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { useDropzone } from 'react-dropzone';
import 'react-image-crop/dist/ReactCrop.css';
import { FaCamera, FaTrash, FaCheck, FaUndo, FaRedo, FaSearchPlus, FaSearchMinus } from 'react-icons/fa';
import { MdRotateLeft, MdRotateRight } from 'react-icons/md';

interface ImageUploaderProps {
  value?: string;
  onChange: (value: string) => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [src, setSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(1);
  const [isCircular, setIsCircular] = useState(true);
  
  // Initialize with existing value if provided
  useEffect(() => {
    if (value) {
      setSrc(value);
    }
  }, [value]);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Maximum size is 5MB.');
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = () => {
        setSrc(reader.result as string);
        setIsEditing(true);
        // Reset editing parameters
        setScale(1);
        setRotate(0);
      };
      
      reader.readAsDataURL(file);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });
  
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerAspectCrop(width, height, aspect || 1);
    setCrop(crop);
  };
  
  const getCroppedImg = useCallback(() => {
    if (!completedCrop || !imgRef.current) return;
    
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return;
    }
    
    // Set canvas dimensions to the cropped size
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const pixelRatio = window.devicePixelRatio;
    
    // Calculate the actual dimensions considering scale and rotation
    canvas.width = completedCrop.width * scaleX * scale;
    canvas.height = completedCrop.height * scaleY * scale;
    
    // Set canvas properties for better quality
    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';
    
    // Save the current context state
    ctx.save();
    
    // Move to the center of the canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Rotate the canvas by the specified angle
    ctx.rotate((rotate * Math.PI) / 180);
    
    // Draw the image at the center, considering the rotation
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    
    // Draw the cropped image onto the canvas
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );
    
    // Restore the context state
    ctx.restore();
    
    // If circular crop is enabled, create a circular mask
    if (isCircular) {
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        Math.min(canvas.width, canvas.height) / 2,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
    
    // Convert canvas to base64 string with quality option
    const base64Image = canvas.toDataURL('image/jpeg', 0.9);
    onChange(base64Image);
    setSrc(base64Image);
    setIsEditing(false);
  }, [completedCrop, onChange, scale, rotate, isCircular]);
  
  const handleCancel = () => {
    if (value) {
      setSrc(value);
    } else {
      setSrc(null);
    }
    setIsEditing(false);
    setScale(1);
    setRotate(0);
  };
  
  const handleRemove = () => {
    setSrc(null);
    onChange('');
    setIsEditing(false);
    setScale(1);
    setRotate(0);
  };
  
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };
  
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const handleRotateLeft = () => {
    setRotate(prev => prev - 90);
  };
  
  const handleRotateRight = () => {
    setRotate(prev => prev + 90);
  };
  
  const handleResetTransform = () => {
    setScale(1);
    setRotate(0);
  };
  
  const handleToggleCropShape = () => {
    setIsCircular(prev => !prev);
  };
  
  return (
    <div className="w-full">
      {!src && !isEditing ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          <input {...getInputProps()} />
          <FaCamera className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Drag & drop an image here, or click to select one
          </p>
          <p className="text-xs text-gray-400 mt-1">
            JPG, PNG or GIF, max 5MB
          </p>
        </div>
      ) : isEditing ? (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              circularCrop={isCircular}
              className="max-w-full mx-auto bg-gray-100 rounded-lg overflow-hidden"
            >
              <img
                ref={imgRef}
                src={src || ''}
                alt="Upload preview"
                className="max-w-full max-h-[300px] mx-auto"
                onLoad={onImageLoad}
                style={{
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  transition: 'transform 0.2s ease-in-out',
                }}
              />
            </ReactCrop>
          </div>
          
          {/* Image editing controls */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-2 bg-white rounded-md text-gray-700 hover:bg-gray-100 border border-gray-300"
                title="Zoom In"
              >
                <FaSearchPlus />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-2 bg-white rounded-md text-gray-700 hover:bg-gray-100 border border-gray-300"
                title="Zoom Out"
              >
                <FaSearchMinus />
              </button>
              <button
                type="button"
                onClick={handleRotateLeft}
                className="p-2 bg-white rounded-md text-gray-700 hover:bg-gray-100 border border-gray-300"
                title="Rotate Left"
              >
                <MdRotateLeft />
              </button>
              <button
                type="button"
                onClick={handleRotateRight}
                className="p-2 bg-white rounded-md text-gray-700 hover:bg-gray-100 border border-gray-300"
                title="Rotate Right"
              >
                <MdRotateRight />
              </button>
              <button
                type="button"
                onClick={handleResetTransform}
                className="p-2 bg-white rounded-md text-gray-700 hover:bg-gray-100 border border-gray-300"
                title="Reset Transformations"
              >
                <FaUndo />
              </button>
              <button
                type="button"
                onClick={handleToggleCropShape}
                className={`p-2 rounded-md border ${
                  isCircular 
                    ? 'bg-blue-100 text-blue-700 border-blue-300' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
                title={isCircular ? "Using Circular Crop" : "Using Square Crop"}
              >
                {isCircular ? "Circular" : "Square"}
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Zoom: {Math.round(scale * 100)}%</label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={scale * 100}
                  onChange={(e) => setScale(Number(e.target.value) / 100)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Rotation: {rotate}°</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={rotate}
                  onChange={(e) => setRotate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-3">
            <button
              type="button"
              onClick={getCroppedImg}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaCheck className="mr-2" /> Apply
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <img 
            src={src || ''} 
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover mx-auto border-2 border-gray-200"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-2 bg-black bg-opacity-50 p-2 rounded-full">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Edit Photo"
              >
                <FaCamera />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                title="Remove Photo"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 