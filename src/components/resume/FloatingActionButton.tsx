import { FaEye } from 'react-icons/fa';
import { useResumeContext } from './ResumeContext';

export function FloatingActionButton() {
  const { isLargeScreen, togglePreviewDialog } = useResumeContext();

  if (isLargeScreen) return null;

  return (
    <button
      onClick={togglePreviewDialog}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center z-40 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      aria-label="Preview Resume"
    >
      <FaEye size={24} />
    </button>
  );
} 