import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { ResumeData } from '../types/resume'
import { ColorTheme } from '../components/ResumePreviewer'

interface CreativeTemplateProps {
  data: ResumeData;
  colorTheme?: ColorTheme;
}

const defaultColorTheme: ColorTheme = {
  id: 'blue',
  name: 'Blue',
  primary: '#3b82f6',
  secondary: '#93c5fd',
};

export function CreativeTemplate({ data, colorTheme = defaultColorTheme }: CreativeTemplateProps) {
  // Create dynamic styles with the color theme
  const styles = StyleSheet.create({
    page: {
      padding: 0,
      fontFamily: 'Helvetica',
      flexDirection: 'row',
    },
    sidebar: {
      width: '30%',
      backgroundColor: colorTheme.primary,
      padding: 20,
      color: 'white',
    },
    main: {
      width: '70%',
      padding: 30,
    },
    photo: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 15,
      alignSelf: 'center',
      border: '3px solid white',
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    jobTitle: {
      fontSize: 14,
      marginBottom: 20,
      color: 'white',
      opacity: 0.9,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 10,
      textTransform: 'uppercase',
    },
    mainSectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 15,
      color: colorTheme.primary,
      textTransform: 'uppercase',
      borderBottomWidth: 2,
      borderBottomColor: colorTheme.primary,
      paddingBottom: 5,
    },
    skillLevel: {
      height: 4,
      marginTop: 4,
      marginBottom: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 2,
    },
    skillLevelFill: {
      height: '100%',
      backgroundColor: 'white',
      borderRadius: 2,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      fontSize: 10,
    },
    summary: {
      fontSize: 11,
      lineHeight: 1.5,
      marginBottom: 20,
    },
    employerText: {
      fontSize: 12, 
      color: colorTheme.primary, 
      marginBottom: 3
    }
  });

  // Helper function to get skill level percentage
  const getSkillLevelPercentage = (level: string): number => {
    switch (level) {
      case 'beginner': return 25;
      case 'intermediate': return 50;
      case 'advanced': return 75;
      case 'expert': return 100;
      default: return 50;
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          {data.personal?.photo && (
            <Image 
              src={data.personal.photo} 
              style={styles.photo} 
            />
          )}
          <Text style={styles.name}>{`${data.personal?.firstName || ''} ${data.personal?.lastName || ''}`}</Text>
          <Text style={styles.jobTitle}>{data.personal?.jobTitle || ''}</Text>
          
          {/* Contact Info */}
          <View style={{ marginBottom: 25 }}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <Text style={{ fontSize: 10, marginBottom: 5 }}>{data.personal?.email || ''}</Text>
            <Text style={{ fontSize: 10, marginBottom: 5 }}>{data.personal?.phone || ''}</Text>
            <Text style={{ fontSize: 10, marginBottom: 5 }}>{`${data.personal?.city || ''}, ${data.personal?.country || ''}`}</Text>
            <Text style={{ fontSize: 10 }}>{data.personal?.address || ''}</Text>
          </View>
          
          {/* Skills in sidebar */}
          {(data.skills ?? []).length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.sectionTitle}>Skills</Text>
              {data.skills.map((skill, index) => (
                <View key={index} style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 10 }}>{skill.name}</Text>
                  <View style={styles.skillLevel}>
                    <View 
                      style={[
                        styles.skillLevelFill, 
                        { width: `${getSkillLevelPercentage(skill.level)}%` }
                      ]} 
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
          
          {/* Social Links */}
          {(data.socialLinks ?? []).length > 0 && (
            <View style={{ marginTop: 25 }}>
              <Text style={styles.sectionTitle}>Social</Text>
              {data.socialLinks.map((link, index) => (
                <Text key={index} style={{ fontSize: 10, marginBottom: 5 }}>
                  {link.platform}: {link.url}
                </Text>
              ))}
            </View>
          )}
        </View>

        <View style={styles.main}>
          {/* Professional Summary */}
          {data.professionalSummary && (
            <View style={{ marginBottom: 25 }}>
              <Text style={styles.mainSectionTitle}>Profile</Text>
              <Text style={styles.summary}>{data.professionalSummary}</Text>
            </View>
          )}
          
          {/* Experience Section */}
          {(data.experience ?? []).length > 0 && (
            <View style={{ marginBottom: 25 }}>
              <Text style={styles.mainSectionTitle}>Experience</Text>
              {data.experience.map((exp, index) => (
                <View key={index} style={{ marginBottom: 15 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{exp.jobTitle}</Text>
                  <Text style={styles.employerText}>
                    {exp.employer} | {exp.city}, {exp.country}
                  </Text>
                  <Text style={{ fontSize: 10, marginBottom: 5, fontStyle: 'italic' }}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </Text>
                  <Text style={{ fontSize: 10, lineHeight: 1.5 }}>{exp.description}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Education Section */}
          {(data.education ?? []).length > 0 && (
            <View style={{ marginBottom: 25 }}>
              <Text style={styles.mainSectionTitle}>Education</Text>
              {data.education.map((edu, index) => (
                <View key={index} style={{ marginBottom: 15 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{edu.degree}</Text>
                  <Text style={styles.employerText}>
                    {edu.school} | {edu.city}, {edu.country}
                  </Text>
                  <Text style={{ fontSize: 10, marginBottom: 5, fontStyle: 'italic' }}>
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </Text>
                  {edu.description && (
                    <Text style={{ fontSize: 10, lineHeight: 1.5 }}>{edu.description}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
          
          {/* Hobbies Section */}
          {(data.hobbies ?? []).length > 0 && (
            <View>
              <Text style={styles.mainSectionTitle}>Interests</Text>
              <Text style={{ fontSize: 10, lineHeight: 1.5 }}>
                {(data.hobbies || []).join(', ')}
              </Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
} 