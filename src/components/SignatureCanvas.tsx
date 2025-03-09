import { useRef, useState, useEffect } from 'react';
import { FaUndo, FaSave, FaTrash } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

interface SignatureCanvasProps {
  onSave: (signatureDataUrl: string) => void;
  initialSignature?: string;
}

export function SignatureCanvas({ onSave, initialSignature }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const { theme } = useTheme();
  
  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas size to match its display size
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Set line style
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = theme === 'dark' ? '#ffffff' : '#000000';
        
        setCtx(context);
        
        // Load initial signature if provided
        if (initialSignature) {
          const img = new Image();
          img.onload = () => {
            context.drawImage(img, 0, 0);
          };
          img.src = initialSignature;
        }
      }
    }
  }, [initialSignature, theme]);
  
  // Update stroke color when theme changes
  useEffect(() => {
    if (ctx) {
      ctx.strokeStyle = theme === 'dark' ? '#ffffff' : '#000000';
    }
  }, [theme, ctx]);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    
    setIsDrawing(true);
    ctx.beginPath();
    
    // Get coordinates
    const coordinates = getCoordinates(e);
    if (coordinates) {
      ctx.moveTo(coordinates.x, coordinates.y);
    }
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    
    // Get coordinates
    const coordinates = getCoordinates(e);
    if (coordinates) {
      ctx.lineTo(coordinates.x, coordinates.y);
      ctx.stroke();
    }
  };
  
  const stopDrawing = () => {
    if (!ctx) return;
    
    setIsDrawing(false);
    ctx.closePath();
  };
  
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    
    // Handle both mouse and touch events
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };
  
  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };
  
  const saveSignature = () => {
    if (!canvasRef.current) return;
    
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onSave(dataUrl);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className={`border-2 rounded-lg ${
        theme === 'dark' 
          ? 'border-gray-600 bg-gray-800' 
          : 'border-gray-300 bg-white'
      } mb-6 w-full shadow-md overflow-hidden`}>
        <div className={`p-2 text-sm ${
          theme === 'dark' 
            ? 'bg-gray-700 text-gray-300 border-b border-gray-600' 
            : 'bg-gray-50 text-gray-500 border-b border-gray-200'
        }`}>
          Draw your signature here
        </div>
        <canvas
          ref={canvasRef}
          className="w-full h-48 cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      
      <div className="flex space-x-5 w-full justify-center">
        <button
          onClick={clearCanvas}
          className={`flex items-center px-5 py-2.5 rounded-md transition-colors ${
            theme === 'dark' 
              ? 'bg-red-900 text-red-300 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 focus:ring-offset-gray-900' 
              : 'bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
          } shadow-sm`}
        >
          <FaTrash className="mr-2 h-4 w-4" />
          <span className="font-medium">Clear</span>
        </button>
        
        <button
          onClick={saveSignature}
          className={`flex items-center px-5 py-2.5 text-white rounded-md transition-colors ${
            theme === 'dark' 
              ? 'bg-indigo-700 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900' 
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          } shadow-sm`}
        >
          <FaSave className="mr-2 h-4 w-4" />
          <span className="font-medium">Save Signature</span>
        </button>
      </div>
    </div>
  );
} 