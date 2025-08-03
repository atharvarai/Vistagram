import React, { useState, useRef, useEffect } from 'react';

interface CameraCaptureProps {
  onImageCapture: (file: File) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCapture, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const initCamera = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API not supported in this browser');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        });

        streamRef.current = stream;
        
        const waitForVideo = () => {
          const video = videoRef.current;
          
          if (video) {
            video.srcObject = stream;
            
            video.play().then(() => {
              setCameraReady(true);
              setIsLoading(false);
            }).catch(err => {
              console.error('Error playing video:', err);
              setError('Failed to start video playback');
              setIsLoading(false);
            });
          } else {
            setTimeout(waitForVideo, 100);
          }
        };

        waitForVideo();
      } catch (err) {
        console.error('Camera error:', err);
        setError(err instanceof Error ? err.message : 'Failed to start camera');
        setIsLoading(false);
      }
    };

    const timer = setTimeout(initCamera, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) {
      console.error('Video or canvas not available');
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      console.error('Canvas context not available');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      } else {
        console.error('Failed to create blob from canvas');
      }
    }, 'image/jpeg', 0.8);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCameraReady(false);
    
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play();
          setCameraReady(true);
        }
      } catch (err) {
        setError('Failed to restart camera');
      }
    };
    initCamera();
  };

  const usePhoto = () => {
    if (capturedImage) {
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `photo_${Date.now()}.jpg`, {
            type: 'image/jpeg'
          });
          onImageCapture(file);
        });
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 text-center max-w-md shadow-2xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Camera Error</h3>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="flex space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 font-medium transition-all duration-200"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-medium transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl overflow-hidden max-w-md w-full shadow-2xl">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900">
            {capturedImage ? 'Review Photo' : 'Take Photo'}
          </h3>
        </div>

        <div className="relative">
          {capturedImage ? (
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-64 object-cover"
              />
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
                onError={(e) => console.error('Video error:', e)}
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-4"></div>
                    <p className="text-white text-sm font-medium">Starting camera...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          {capturedImage ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={retakePhoto}
                className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-medium transition-all duration-200"
              >
                Retake
              </button>
              <button
                onClick={usePhoto}
                className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 font-medium transition-all duration-200"
              >
                Use Photo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onClose}
                className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={capturePhoto}
                className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!cameraReady}
              >
                Capture
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraCapture; 