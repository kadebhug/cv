import React from 'react';
import { Document, Page, Text, View, StyleSheet, DocumentProps } from '@react-pdf/renderer';
import { ResumeData } from '../types/resume';
import { ColorTheme } from './ResumePreviewer';

interface ResumeDocumentProps extends DocumentProps {
  resumeData: ResumeData;
  templateId: string;
  colorTheme: ColorTheme;
}

export const ResumeDocument: React.FC<ResumeDocumentProps> = ({ 
  resumeData, 
  templateId, 
  colorTheme,
  ...documentProps
}) => {
  // Create a default empty resumeData if it's undefined
  const safeResumeData: ResumeData = resumeData || {
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
    },
    experience: [],
    education: [],
    skills: [],
  };

  // Create styles based on the selected color theme
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 30,
      fontFamily: 'Helvetica',
    },
    header: {
      marginBottom: 20,
      borderBottomWidth: 2,
      borderBottomColor: colorTheme.primary,
      paddingBottom: 10,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colorTheme.primary,
    },
    jobTitle: {
      fontSize: 14,
      marginBottom: 5,
      color: '#666',
    },
    contactInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      fontSize: 10,
      color: '#444',
    },
    contactItem: {
      marginRight: 15,
      marginBottom: 5,
    },
    section: {
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5,
      color: colorTheme.primary,
      borderBottomWidth: 1,
      borderBottomColor: '#EEE',
      paddingBottom: 3,
    },
    item: {
      marginBottom: 10,
    },
    itemTitle: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    itemSubtitle: {
      fontSize: 10,
      color: '#666',
      marginBottom: 3,
    },
    itemDate: {
      fontSize: 10,
      color: '#888',
    },
    itemDescription: {
      fontSize: 10,
      marginTop: 3,
      lineHeight: 1.4,
    },
    skills: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    skill: {
      fontSize: 10,
      backgroundColor: colorTheme.secondary,
      color: '#333',
      padding: '3 6',
      borderRadius: 3,
      marginRight: 5,
      marginBottom: 5,
    },
    summary: {
      fontSize: 10,
      lineHeight: 1.4,
      marginBottom: 15,
    },
    twoColumns: {
      flexDirection: 'row',
    },
    column: {
      flex: 1,
      paddingRight: 10,
    },
  });

  // Render different templates based on templateId
  const renderTemplate = () => {
    switch (templateId) {
      case 'modern':
        return renderModernTemplate();
      case 'professional':
        return renderProfessionalTemplate();
      case 'minimalist':
        return renderMinimalistTemplate();
      default:
        return renderModernTemplate(); // Default to modern template
    }
  };

  // Modern template layout
  const renderModernTemplate = () => (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>
          {safeResumeData?.personal?.firstName || ''} {safeResumeData?.personal?.lastName || ''}
        </Text>
        {safeResumeData?.personal?.jobTitle && (
          <Text style={styles.jobTitle}>{safeResumeData.personal.jobTitle}</Text>
        )}
        <View style={styles.contactInfo}>
          {safeResumeData?.personal?.email && (
            <Text style={styles.contactItem}>{safeResumeData.personal.email}</Text>
          )}
          {safeResumeData?.personal?.phone && (
            <Text style={styles.contactItem}>{safeResumeData.personal.phone}</Text>
          )}
          {safeResumeData?.personal?.city && safeResumeData?.personal?.country && (
            <Text style={styles.contactItem}>
              {safeResumeData.personal.city}, {safeResumeData.personal.country}
            </Text>
          )}
        </View>
      </View>

      {/* Summary */}
      {safeResumeData?.professionalSummary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summary}>{safeResumeData.professionalSummary}</Text>
        </View>
      )}

      {/* Experience */}
      {safeResumeData?.experience && safeResumeData.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {safeResumeData.experience.map((exp, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemTitle}>{exp.jobTitle}</Text>
              <Text style={styles.itemSubtitle}>{exp.employer}</Text>
              <Text style={styles.itemDate}>
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </Text>
              <Text style={styles.itemDescription}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {safeResumeData?.education && safeResumeData.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {safeResumeData.education.map((edu, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemTitle}>{edu.degree}</Text>
              <Text style={styles.itemSubtitle}>{edu.school}</Text>
              <Text style={styles.itemDate}>
                {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
              </Text>
              {edu.description && (
                <Text style={styles.itemDescription}>{edu.description}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {safeResumeData?.skills && safeResumeData.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skills}>
            {safeResumeData.skills.map((skill, index) => (
              <Text key={index} style={styles.skill}>
                {skill.name}
              </Text>
            ))}
          </View>
        </View>
      )}
    </Page>
  );

  // Professional template layout
  const renderProfessionalTemplate = () => (
    <Page size="A4" style={styles.page}>
      {/* Header with name and contact info */}
      <View style={styles.header}>
        <Text style={styles.name}>
          {safeResumeData.personal.firstName} {safeResumeData.personal.lastName}
        </Text>
        <Text style={styles.jobTitle}>{safeResumeData.personal.jobTitle}</Text>
        <View style={styles.contactInfo}>
          {safeResumeData.personal.email && (
            <Text style={styles.contactItem}>Email: {safeResumeData.personal.email}</Text>
          )}
          {safeResumeData.personal.phone && (
            <Text style={styles.contactItem}>Phone: {safeResumeData.personal.phone}</Text>
          )}
          {safeResumeData.personal.city && safeResumeData.personal.country && (
            <Text style={styles.contactItem}>
              Location: {safeResumeData.personal.city}, {safeResumeData.personal.country}
            </Text>
          )}
        </View>
      </View>

      {/* Professional Summary */}
      {safeResumeData.professionalSummary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summary}>{safeResumeData.professionalSummary}</Text>
        </View>
      )}

      {/* Work Experience */}
      {safeResumeData.experience && safeResumeData.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {safeResumeData.experience.map((exp, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemTitle}>{exp.jobTitle}</Text>
              <Text style={styles.itemSubtitle}>{exp.employer}</Text>
              <Text style={styles.itemDate}>
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </Text>
              <Text style={styles.itemDescription}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {safeResumeData.education && safeResumeData.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {safeResumeData.education.map((edu, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemTitle}>{edu.degree}</Text>
              <Text style={styles.itemSubtitle}>{edu.school}</Text>
              <Text style={styles.itemDate}>
                {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
              </Text>
              {edu.description && (
                <Text style={styles.itemDescription}>{edu.description}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {safeResumeData.skills && safeResumeData.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skills}>
            {safeResumeData.skills.map((skill, index) => (
              <Text key={index} style={styles.skill}>
                {skill.name}
              </Text>
            ))}
          </View>
        </View>
      )}
    </Page>
  );

  // Minimalist template layout
  const renderMinimalistTemplate = () => (
    <Page size="A4" style={styles.page}>
      {/* Header with name and contact info */}
      <View style={styles.header}>
        <Text style={styles.name}>
          {safeResumeData.personal.firstName} {safeResumeData.personal.lastName}
        </Text>
        <Text style={styles.jobTitle}>{safeResumeData.personal.jobTitle}</Text>
        <View style={styles.contactInfo}>
          {safeResumeData.personal.email && (
            <Text style={styles.contactItem}>{safeResumeData.personal.email}</Text>
          )}
          {safeResumeData.personal.phone && (
            <Text style={styles.contactItem}>{safeResumeData.personal.phone}</Text>
          )}
          {safeResumeData.personal.city && safeResumeData.personal.country && (
            <Text style={styles.contactItem}>
              {safeResumeData.personal.city}, {safeResumeData.personal.country}
            </Text>
          )}
        </View>
      </View>

      {/* Professional Summary */}
      {safeResumeData.professionalSummary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summary}>{safeResumeData.professionalSummary}</Text>
        </View>
      )}

      {/* Work Experience */}
      {safeResumeData.experience && safeResumeData.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {safeResumeData.experience.map((exp, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemTitle}>{exp.jobTitle} | {exp.employer}</Text>
              <Text style={styles.itemDate}>
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </Text>
              <Text style={styles.itemDescription}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {safeResumeData.education && safeResumeData.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {safeResumeData.education.map((edu, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemTitle}>{edu.degree} | {edu.school}</Text>
              <Text style={styles.itemDate}>
                {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {safeResumeData.skills && safeResumeData.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.itemDescription}>
            {safeResumeData.skills.map(skill => skill.name).join(', ')}
          </Text>
        </View>
      )}
    </Page>
  );

  return <Document>{renderTemplate()}</Document>;
}; 