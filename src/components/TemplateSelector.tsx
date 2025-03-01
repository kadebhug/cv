import { useState } from 'react'
import { FaTimes, FaSearch, FaStar } from 'react-icons/fa'
import { TemplateThumbnail } from './TemplateThumbnail'
import { ColorTheme } from './ResumePreviewer'

// Template type definition
interface Template {
  id: string
  name: string
  description: string
  category: string
  popular: boolean
}

interface Category {
  id: string
  name: string
}

interface TemplateSelectorProps {
  templates: Template[]
  categories: Category[]
  selectedTemplate: string
  onSelectTemplate: (templateId: string) => void
  onClose: () => void
  colorTheme?: ColorTheme
}

export function TemplateSelector({
  templates,
  categories,
  selectedTemplate,
  onSelectTemplate,
  onClose,
  colorTheme
}: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Filter templates based on search query and selected category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold text-gray-800">Choose a Template</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Search and Filter */}
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No templates match your search criteria
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <div 
                  key={template.id}
                  onClick={() => onSelectTemplate(template.id)}
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Template Thumbnail */}
                  <div className="h-40 bg-gray-50 relative">
                    <TemplateThumbnail 
                      templateId={template.id} 
                      colorTheme={colorTheme}
                    />
                    
                    {/* Popular badge */}
                    {template.popular && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <FaStar className="mr-1" size={10} />
                        Popular
                      </div>
                    )}
                  </div>
                  
                  {/* Template Info */}
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{template.description}</p>
                    
                    {/* Category Tag */}
                    <div className="mt-2">
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {categories.find(c => c.id === template.category)?.name || template.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t p-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Apply Template
          </button>
        </div>
      </div>
    </div>
  )
} 