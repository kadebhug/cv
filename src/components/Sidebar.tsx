import { useState } from 'react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

export type Section = {
  id: string
  title: string
  isCompleted: boolean
}

interface SidebarProps {
  sections: Section[]
  currentSection: string
  onSectionChange: (sectionId: string) => void
}

export function Sidebar({ sections, currentSection, onSectionChange }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div 
      className={`bg-white shadow-lg transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-16'
      } min-h-screen fixed left-0 top-0 pt-16`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute right-0 top-20 transform translate-x-1/2 bg-white rounded-full p-1 shadow-lg"
      >
        {isExpanded ? <IoChevronBack /> : <IoChevronForward />}
      </button>
      
      <div className="mt-8">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors
              ${currentSection === section.id ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'}
              ${!isExpanded && 'justify-center'}
            `}
          >
            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-sm
              ${section.isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}
            `}>
              {index + 1}
            </div>
            {isExpanded && (
              <span className="truncate">{section.title}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
} 