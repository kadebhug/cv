import { FaPalette, FaCheck } from 'react-icons/fa';
import { colorThemes } from '../../utils/themeUtils';
import { useResumeContext } from './ResumeContext';

export function ColorThemeSelector() {
  const { selectedColorTheme, handleColorThemeChange } = useResumeContext();

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
        <FaPalette className="mr-2" size={20} />
        Color Theme
      </h2>
      <div className="grid grid-cols-5 sm:grid-cols-8 gap-3">
        {colorThemes.map(theme => (
          <button
            key={theme.id}
            onClick={() => handleColorThemeChange(theme)}
            className={`relative rounded-full w-10 h-10 flex items-center justify-center border-2 transition-all duration-200 ${
              selectedColorTheme.id === theme.id
                ? 'border-gray-800 dark:border-white scale-110'
                : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:scale-105'
            }`}
            style={{ backgroundColor: theme.primary }}
            title={theme.name}
          >
            {selectedColorTheme.id === theme.id && (
              <FaCheck className="text-white text-xs" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
} 