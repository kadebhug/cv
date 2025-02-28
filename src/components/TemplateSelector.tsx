import { useState } from 'react'

const templates = [
  { id: 'modern', name: 'Modern', thumbnail: '/templates/modern.png' },
  { id: 'professional', name: 'Professional', thumbnail: '/templates/professional.png' },
  { id: 'creative', name: 'Creative', thumbnail: '/templates/creative.png' },
  { id: 'executive', name: 'Executive', thumbnail: '/templates/executive.png' },
  { id: 'minimalist', name: 'Minimalist', thumbnail: '/templates/minimalist.png' },
]

interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateSelect: (templateId: string) => void
}

export function TemplateSelector({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onTemplateSelect(template.id)}
          className={`p-4 border rounded-lg transition-all ${
            selectedTemplate === template.id
              ? 'border-indigo-500 ring-2 ring-indigo-500 ring-opacity-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <img
            src={template.thumbnail}
            alt={template.name}
            className="w-full h-32 object-cover rounded mb-2"
          />
          <p className="text-sm font-medium text-gray-900">{template.name}</p>
        </button>
      ))}
    </div>
  )
} 