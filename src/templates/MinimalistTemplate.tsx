import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { ResumeData } from '../types/resume'
import { ColorTheme } from '../components/ResumePreviewer'

const createStyles = (theme: ColorTheme) => StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    color: '#333',
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 30,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 12,
    color: theme.primary,
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    fontSize: 9,
    color: '#666',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginVertical: 15,
  },
  thinDivider: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    marginVertical: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#555',
  },
  experienceItem: {
    marginBottom: 15,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  companyName: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  jobTitleText: {
    fontSize: 10,
    color: '#555',
  },
  dateText: {
    fontSize: 9,
    color: '#888',
    textAlign: 'right',
  },
  locationText: {
    fontSize: 9,
    color: '#888',
    marginBottom: 5,
  },
  description: {
    fontSize: 9,
    lineHeight: 1.4,
    color: '#555',
  },
  educationItem: {
    marginBottom: 10,
  },
  schoolName: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  degree: {
    fontSize: 10,
    color: '#555',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  skillCategory: {
    width: '45%',
    marginBottom: 10,
  },
  skillCategoryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  skillList: {
    fontSize: 9,
    color: '#666',
    lineHeight: 1.4,
  },
  socialLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  socialLink: {
    fontSize: 9,
    color: theme.primary,
  },
  photoContainer: {
    position: 'absolute',
    top: 40,
    right: 40,
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: '#aaa',
  },
})

interface MinimalistTemplateProps {
  data: ResumeData
  colorTheme: ColorTheme
}

export function MinimalistTemplate({ data, colorTheme }: MinimalistTemplateProps) {
  const styles = createStyles(colorTheme)
  
  // Group skills by level for better organization
  const skillsByLevel = data.skills?.reduce((acc, skill) => {
    const skillName = typeof skill === 'string' ? skill : skill.name
    const level = typeof skill === 'string' ? 'Other' : skill.level
    
    if (!acc[level]) {
      acc[level] = []
    }
    
    acc[level].push(skillName)
    return acc
  }, {} as Record<string, string[]>) || {}
  
  const skillLevels = Object.keys(skillsByLevel)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Photo (if available) */}
        {data.personal?.photo && (
          <View style={styles.photoContainer}>
            <Image 
              src={data.personal.photo} 
              style={styles.photo} 
            />
          </View>
        )}
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{`${data.personal?.firstName} ${data.personal?.lastName}`}</Text>
          <Text style={styles.jobTitle}>{data.personal?.jobTitle}</Text>
          
          <View style={styles.contactRow}>
            <Text>{data.personal?.email}</Text>
            <Text>{data.personal?.phone}</Text>
            <Text>{`${data.personal?.city}, ${data.personal?.country}`}</Text>
            {data.personal?.address && <Text>{data.personal.address}</Text>}
          </View>
        </View>
        
        <View style={styles.divider} />
        
        {/* Professional Summary */}
        {data.professionalSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.summary}>{data.professionalSummary}</Text>
          </View>
        )}
        
        {/* Experience Section */}
        {(data.experience ?? []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experience!.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.companyName}>{exp.employer}</Text>
                  <Text style={styles.dateText}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </Text>
                </View>
                <Text style={styles.jobTitleText}>{exp.jobTitle}</Text>
                <Text style={styles.locationText}>{`${exp.city}, ${exp.country}`}</Text>
                <Text style={styles.description}>{exp.description}</Text>
                {index < data.experience!.length - 1 && <View style={styles.thinDivider} />}
              </View>
            ))}
          </View>
        )}
        
        {/* Education Section */}
        {(data.education ?? []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {(data.education ?? []).map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.schoolName}>{edu.school}</Text>
                  <Text style={styles.dateText}>
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </Text>
                </View>
                <Text style={styles.degree}>{edu.degree}</Text>
                <Text style={styles.locationText}>{`${edu.city}, ${edu.country}`}</Text>
                {edu.description && <Text style={styles.description}>{edu.description}</Text>}
                {index < data.education!.length - 1 && <View style={styles.thinDivider} />}
              </View>
            ))}
          </View>
        )}
        
        {/* Skills Section */}
        {data.skills?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {skillLevels.map((level, index) => (
                <View key={index} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryTitle}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                  <Text style={styles.skillList}>
                    {skillsByLevel[level].join(', ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Social Links */}
        {(data.socialLinks ?? []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connect</Text>
            <View style={styles.socialLinks}>
              {data.socialLinks.map((link, index) => (
                <Text key={index} style={styles.socialLink}>
                  {link.platform}: {link.url}
                </Text>
              ))}
            </View>
          </View>
        )}
        
        {/* Footer */}
        <Text style={styles.footer}>
          {`${data.personal?.firstName} ${data.personal?.lastName} • ${new Date().toLocaleDateString()}`}
        </Text>
      </Page>
    </Document>
  )
} 