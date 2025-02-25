import { useState } from 'react'

const templates = [
  { id: 'modern', name: 'Modern', thumbnail: '/templates/modern.png' },
  { id: 'professional', name: 'Professional', thumbnail: '/templates/professional.png' },
  { id: 'creative', name: 'Creative', thumbnail: '/templates/creative.png' },
]

interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateSelect: (templateId: string) => void
}

export function TemplateSelector({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
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
            className="w-full h-40 object-cover rounded mb-2"
          />
          <p className="text-sm font-medium text-gray-900">{template.name}</p>
        </button>
      ))}
    </div>
  )
} 