import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { ResumeData } from '../types/resume'
import { ColorTheme } from '../components/ResumePreviewer'

interface ModernTemplateProps {
  data: ResumeData;
  colorTheme?: ColorTheme;
}

const defaultColorTheme: ColorTheme = {
  id: 'blue',
  name: 'Blue',
  primary: '#3b82f6',
  secondary: '#93c5fd',
};

export function ModernTemplate({ data, colorTheme = defaultColorTheme }: ModernTemplateProps) {
  // Create dynamic styles with the color theme
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: 'Helvetica',
    },
    header: {
      marginBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerContent: {
      flex: 1,
    },
    photo: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 15,
      border: `1px solid ${colorTheme.secondary}`,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
      color: colorTheme.primary,
    },
    contact: {
      fontSize: 10,
      color: '#666',
      flexDirection: 'row',
      gap: 10,
    },
    section: {
      marginTop: 15,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colorTheme.primary,
      borderBottomWidth: 1,
      borderBottomColor: colorTheme.secondary,
      paddingBottom: 3,
    },
    skillBadge: {
      backgroundColor: colorTheme.secondary,
      padding: '3 8',
      borderRadius: 4,
      marginBottom: 5,
      marginRight: 5
    }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          {data.personal?.photo && (
            <Image 
              src={data.personal.photo} 
              style={styles.photo} 
            />
          )}
          <View style={styles.headerContent}>
            <Text style={styles.name}>{`${data.personal?.firstName || ''} ${data.personal?.lastName || ''}`}</Text>
            <View style={styles.contact}>
              <Text>{data.personal?.email || ''}</Text>
              <Text>•</Text>
              <Text>{data.personal?.phone || ''}</Text>
              <Text>•</Text>
              <Text>{`${data.personal?.city || ''}, ${data.personal?.country || ''}`}</Text>
            </View>
          </View>
        </View>

        {/* Professional Summary */}
        {data.professionalSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={{ fontSize: 10, lineHeight: 1.5 }}>{data.professionalSummary}</Text>
          </View>
        )}

        {/* Experience Section */}
        {(data.experience ?? []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {data.experience.map((exp, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{exp.employer}</Text>
                <Text style={{ fontSize: 10, color: '#666' }}>
                  {exp.jobTitle} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </Text>
                <Text style={{ fontSize: 10, marginTop: 5 }}>{exp.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education Section */}
        {(data.education ?? []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{edu.school}</Text>
                <Text style={{ fontSize: 10, color: '#666' }}>
                  {edu.degree} | {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                </Text>
                {edu.description && (
                  <Text style={{ fontSize: 10, marginTop: 5 }}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills Section */}
        {(data.skills ?? []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
              {data.skills.map((skill, index) => (
                <View 
                  key={index} 
                  style={styles.skillBadge}
                >
                  <Text style={{ fontSize: 10 }}>{skill.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Social Links Section */}
        {(data.socialLinks ?? []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Social Links</Text>
            {data.socialLinks.map((link, index) => (
              <Text key={index} style={{ fontSize: 10, marginBottom: 3 }}>
                {link.platform}: {link.url}
              </Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
} 