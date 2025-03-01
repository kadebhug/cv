import React from 'react';
import { FaUser, FaBuilding, FaGraduationCap, FaTools, FaFileAlt, FaColumns, FaLayerGroup } from 'react-icons/fa';

interface TemplateThumbnailProps {
  templateId: string;
  colorTheme?: {
    primary: string;
    secondary: string;
  };
}

export function TemplateThumbnail({ templateId, colorTheme }: TemplateThumbnailProps) {
  const primary = colorTheme?.primary || '#3b82f6';
  const secondary = colorTheme?.secondary || '#93c5fd';
  
  // Common styles
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    overflow: 'hidden',
    position: 'relative',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
  };
  
  // Render different thumbnail layouts based on template ID
  switch (templateId) {
    case 'modern':
      return (
        <div style={containerStyle}>
          <div style={{ height: '15%', backgroundColor: primary, position: 'relative' }}>
            <div style={{ 
              position: 'absolute', 
              width: '20%', 
              height: '40%', 
              backgroundColor: '#fff', 
              borderRadius: '50%',
              border: `2px solid ${primary}`,
              bottom: '-20%',
              left: '5%'
            }} />
          </div>
          <div style={{ marginTop: '10%', padding: '0 5%' }}>
            <div style={{ height: '4px', width: '70%', backgroundColor: '#000', marginBottom: '10%' }} />
            <div style={{ height: '2px', width: '90%', backgroundColor: '#e5e7eb', marginBottom: '5%' }} />
            <div style={{ height: '2px', width: '80%', backgroundColor: '#e5e7eb', marginBottom: '10%' }} />
            
            <div style={{ height: '3px', width: '40%', backgroundColor: primary, marginBottom: '5%' }} />
            <div style={{ height: '2px', width: '90%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
            <div style={{ height: '2px', width: '85%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
            <div style={{ height: '2px', width: '80%', backgroundColor: '#e5e7eb', marginBottom: '10%' }} />
            
            <div style={{ height: '3px', width: '40%', backgroundColor: primary, marginBottom: '5%' }} />
            <div style={{ height: '2px', width: '90%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
            <div style={{ height: '2px', width: '85%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
          </div>
        </div>
      );
      
    case 'professional':
      return (
        <div style={containerStyle}>
          <div style={{ padding: '8%' }}>
            <div style={{ height: '5px', width: '60%', backgroundColor: '#000', marginBottom: '5%' }} />
            <div style={{ height: '3px', width: '40%', backgroundColor: '#666', marginBottom: '10%' }} />
            
            <div style={{ 
              display: 'flex', 
              marginBottom: '10%',
              justifyContent: 'space-between'
            }}>
              <div style={{ width: '48%' }}>
                <div style={{ height: '3px', width: '100%', backgroundColor: primary, marginBottom: '5%' }} />
                <div style={{ height: '2px', width: '100%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
                <div style={{ height: '2px', width: '100%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
              </div>
              <div style={{ width: '48%' }}>
                <div style={{ height: '3px', width: '100%', backgroundColor: primary, marginBottom: '5%' }} />
                <div style={{ height: '2px', width: '100%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
                <div style={{ height: '2px', width: '100%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
              </div>
            </div>
            
            <div style={{ height: '3px', width: '40%', backgroundColor: primary, marginBottom: '5%' }} />
            <div style={{ height: '2px', width: '90%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
            <div style={{ height: '2px', width: '85%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
            <div style={{ height: '2px', width: '80%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
          </div>
        </div>
      );
      
    case 'creative':
      return (
        <div style={containerStyle}>
          <div style={{ 
            height: '100%',
            display: 'flex'
          }}>
            <div style={{ 
              width: '35%', 
              height: '100%', 
              backgroundColor: primary,
              padding: '8%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{ 
                width: '60%', 
                height: '20%', 
                backgroundColor: '#fff', 
                borderRadius: '50%',
                marginBottom: '20%'
              }} />
              <div style={{ height: '2px', width: '80%', backgroundColor: '#fff', marginBottom: '10%' }} />
              <div style={{ height: '2px', width: '80%', backgroundColor: '#fff', marginBottom: '10%' }} />
              <div style={{ height: '2px', width: '80%', backgroundColor: '#fff', marginBottom: '10%' }} />
            </div>
            <div style={{ 
              width: '65%', 
              padding: '8%'
            }}>
              <div style={{ height: '4px', width: '70%', backgroundColor: '#000', marginBottom: '8%' }} />
              <div style={{ height: '2px', width: '90%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
              <div style={{ height: '2px', width: '80%', backgroundColor: '#e5e7eb', marginBottom: '10%' }} />
              
              <div style={{ height: '3px', width: '40%', backgroundColor: primary, marginBottom: '5%' }} />
              <div style={{ height: '2px', width: '90%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
              <div style={{ height: '2px', width: '85%', backgroundColor: '#e5e7eb', marginBottom: '10%' }} />
            </div>
          </div>
        </div>
      );
      
    case 'executive':
      return (
        <div style={containerStyle}>
          <div style={{ 
            borderBottom: `3px solid ${primary}`,
            padding: '5%',
            marginBottom: '5%'
          }}>
            <div style={{ height: '5px', width: '60%', backgroundColor: '#000', marginBottom: '3%' }} />
            <div style={{ height: '3px', width: '90%', backgroundColor: '#666', marginBottom: '3%' }} />
          </div>
          <div style={{ padding: '0 5%' }}>
            <div style={{ height: '3px', width: '30%', backgroundColor: primary, marginBottom: '5%' }} />
            <div style={{ height: '2px', width: '90%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
            <div style={{ height: '2px', width: '85%', backgroundColor: '#e5e7eb', marginBottom: '8%' }} />
            
            <div style={{ height: '3px', width: '30%', backgroundColor: primary, marginBottom: '5%' }} />
            <div style={{ height: '2px', width: '90%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
            <div style={{ height: '2px', width: '85%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
            <div style={{ height: '2px', width: '80%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
          </div>
        </div>
      );
      
    case 'minimalist':
      return (
        <div style={containerStyle}>
          <div style={{ padding: '8%' }}>
            <div style={{ height: '5px', width: '50%', backgroundColor: '#000', marginBottom: '10%' }} />
            
            <div style={{ height: '3px', width: '25%', backgroundColor: '#000', marginBottom: '5%' }} />
            <div style={{ height: '1px', width: '100%', backgroundColor: '#e5e7eb', marginBottom: '5%' }} />
            <div style={{ height: '2px', width: '90%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
            <div style={{ height: '2px', width: '85%', backgroundColor: '#e5e7eb', marginBottom: '10%' }} />
            
            <div style={{ height: '3px', width: '25%', backgroundColor: '#000', marginBottom: '5%' }} />
            <div style={{ height: '1px', width: '100%', backgroundColor: '#e5e7eb', marginBottom: '5%' }} />
            <div style={{ height: '2px', width: '90%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
            <div style={{ height: '2px', width: '85%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
          </div>
        </div>
      );
      
    case 'tech':
      return (
        <div style={containerStyle}>
          <div style={{ 
            height: '100%',
            display: 'flex'
          }}>
            <div style={{ 
              width: '40%', 
              height: '100%', 
              backgroundColor: '#f3f4f6',
              padding: '8%'
            }}>
              <div style={{ 
                width: '70%', 
                height: '25%', 
                backgroundColor: '#fff', 
                borderRadius: '50%',
                border: `2px solid ${primary}`,
                marginBottom: '15%'
              }} />
              <div style={{ height: '3px', width: '80%', backgroundColor: primary, marginBottom: '10%' }} />
              <div style={{ height: '2px', width: '90%', backgroundColor: '#d1d5db', marginBottom: '5%' }} />
              <div style={{ height: '2px', width: '90%', backgroundColor: '#d1d5db', marginBottom: '5%' }} />
              <div style={{ height: '2px', width: '90%', backgroundColor: '#d1d5db', marginBottom: '5%' }} />
            </div>
            <div style={{ 
              width: '60%', 
              padding: '8%'
            }}>
              <div style={{ height: '4px', width: '70%', backgroundColor: '#000', marginBottom: '5%' }} />
              <div style={{ height: '2px', width: '90%', backgroundColor: '#e5e7eb', marginBottom: '10%' }} />
              
              <div style={{ height: '3px', width: '40%', backgroundColor: primary, marginBottom: '5%' }} />
              <div style={{ height: '2px', width: '90%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
              <div style={{ height: '2px', width: '85%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
            </div>
          </div>
        </div>
      );
      
    case 'academic':
      return (
        <div style={containerStyle}>
          <div style={{ 
            borderBottom: `3px solid ${primary}`,
            padding: '5%',
            marginBottom: '5%'
          }}>
            <div style={{ height: '5px', width: '70%', backgroundColor: '#000', marginBottom: '3%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ height: '2px', width: '30%', backgroundColor: '#666' }} />
              <div style={{ height: '2px', width: '30%', backgroundColor: '#666' }} />
            </div>
          </div>
          <div style={{ 
            display: 'flex',
            height: 'calc(100% - 15%)'
          }}>
            <div style={{ 
              width: '65%', 
              padding: '0 5%',
              borderRight: `1px solid ${secondary}`
            }}>
              <div style={{ height: '3px', width: '50%', backgroundColor: primary, marginBottom: '5%' }} />
              <div style={{ height: '2px', width: '90%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
              <div style={{ height: '2px', width: '85%', backgroundColor: '#e5e7eb', marginBottom: '8%' }} />
              
              <div style={{ height: '3px', width: '50%', backgroundColor: primary, marginBottom: '5%' }} />
              <div style={{ height: '2px', width: '90%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
            </div>
            <div style={{ 
              width: '35%', 
              padding: '0 5%'
            }}>
              <div style={{ height: '3px', width: '70%', backgroundColor: primary, marginBottom: '5%' }} />
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '3px',
                marginBottom: '8%'
              }}>
                <div style={{ height: '8px', width: '25%', backgroundColor: secondary, borderRadius: '2px' }} />
                <div style={{ height: '8px', width: '30%', backgroundColor: secondary, borderRadius: '2px' }} />
                <div style={{ height: '8px', width: '20%', backgroundColor: secondary, borderRadius: '2px' }} />
              </div>
              
              <div style={{ height: '3px', width: '70%', backgroundColor: primary, marginBottom: '5%' }} />
              <div style={{ height: '2px', width: '90%', backgroundColor: '#e5e7eb', marginBottom: '3%' }} />
            </div>
          </div>
        </div>
      );
      
    // For other templates, use a generic layout with an icon
    default:
      let icon = <FaFileAlt size={24} />;
      let bgColor = '#fff';
      
      if (templateId === 'medical') {
        icon = <FaUser size={24} />;
        bgColor = '#f0fdf4';
      } else if (templateId === 'legal') {
        icon = <FaBuilding size={24} />;
        bgColor = '#f8fafc';
      } else if (templateId === 'engineering') {
        icon = <FaTools size={24} />;
        bgColor = '#f7fee7';
      } else if (templateId === 'finance') {
        icon = <FaColumns size={24} />;
        bgColor = '#f0f9ff';
      } else if (templateId === 'sales') {
        icon = <FaLayerGroup size={24} />;
        bgColor = '#fff7ed';
      }
      
      return (
        <div style={{...containerStyle, backgroundColor: bgColor}}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '10%'
          }}>
            <div style={{ 
              color: primary,
              marginBottom: '10%'
            }}>
              {icon}
            </div>
            
            <div style={{ height: '3px', width: '70%', backgroundColor: primary, marginBottom: '8%' }} />
            <div style={{ height: '2px', width: '90%', backgroundColor: '#e5e7eb', marginBottom: '5%' }} />
            <div style={{ height: '2px', width: '80%', backgroundColor: '#e5e7eb', marginBottom: '5%' }} />
            <div style={{ height: '2px', width: '85%', backgroundColor: '#e5e7eb', marginBottom: '10%' }} />
            
            <div style={{ height: '3px', width: '50%', backgroundColor: primary, marginBottom: '8%' }} />
            <div style={{ height: '2px', width: '90%', backgroundColor: '#e5e7eb', marginBottom: '5%' }} />
            <div style={{ height: '2px', width: '85%', backgroundColor: '#e5e7eb', marginBottom: '5%' }} />
          </div>
        </div>
      );
  }
} 