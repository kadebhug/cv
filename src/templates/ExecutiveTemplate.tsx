import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { ResumeData } from '../types/resume'
import { ColorTheme } from '../components/ResumePreviewer'

const createStyles = (theme: ColorTheme) => StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    color: '#333',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: theme.primary,
    paddingBottom: 15,
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    width: 80,
    alignItems: 'flex-end',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: theme.primary,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.primary,
    textTransform: 'uppercase',
  },
  jobTitle: {
    fontSize: 14,
    marginTop: 5,
    color: '#555',
    fontWeight: 'bold',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 15,
  },
  contactItem: {
    fontSize: 9,
    color: '#555',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactDot: {
    fontSize: 9,
    color: theme.primary,
    marginHorizontal: 5,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.primary,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 3,
    marginBottom: 10,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 15,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  jobTitleText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#555',
  },
  dateLocation: {
    fontSize: 9,
    color: '#777',
    textAlign: 'right',
  },
  description: {
    fontSize: 9,
    marginTop: 5,
    lineHeight: 1.4,
  },
  educationItem: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  educationLeft: {
    flex: 1,
  },
  educationRight: {
    width: '30%',
    textAlign: 'right',
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
    gap: 8,
    marginTop: 5,
  },
  skillItem: {
    fontSize: 9,
    backgroundColor: theme.secondary,
    color: '#333',
    padding: '3 8',
    borderRadius: 4,
  },
  socialLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 5,
  },
  socialLink: {
    fontSize: 9,
    color: theme.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 5,
  },
})

interface ExecutiveTemplateProps {
  data: ResumeData
  colorTheme: ColorTheme
}

export function ExecutiveTemplate({ data, colorTheme }: ExecutiveTemplateProps) {
  const styles = createStyles(colorTheme)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.name}>{`${data.personal?.firstName} ${data.personal?.lastName}`}</Text>
              <Text style={styles.jobTitle}>{data.personal?.jobTitle}</Text>
            </View>
            <View style={styles.headerRight}>
              {data.personal?.photo && (
                <Image 
                  src={data.personal.photo} 
                  style={styles.photo} 
                />
              )}
            </View>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>{data.personal?.email}</Text>
            <Text style={styles.contactDot}>•</Text>
            <Text style={styles.contactItem}>{data.personal?.phone}</Text>
            <Text style={styles.contactDot}>•</Text>
            <Text style={styles.contactItem}>{`${data.personal?.city}, ${data.personal?.country}`}</Text>
            {data.personal?.address && (
              <>
                <Text style={styles.contactDot}>•</Text>
                <Text style={styles.contactItem}>{data.personal.address}</Text>
              </>
            )}
          </View>
        </View>

        {/* Professional Summary */}
        {data.professionalSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Executive Summary</Text>
            <Text style={styles.summary}>{data.professionalSummary}</Text>
          </View>
        )}

        {/* Experience Section */}
        {(data.experience ?? []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {data.experience!.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <View>
                    <Text style={styles.companyName}>{exp.employer}</Text>
                    <Text style={styles.jobTitleText}>{exp.jobTitle}</Text>
                  </View>
                  <View>
                    <Text style={styles.dateLocation}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </Text>
                    <Text style={styles.dateLocation}>{`${exp.city}, ${exp.country}`}</Text>
                  </View>
                </View>
                <Text style={styles.description}>{exp.description}</Text>
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
                <View style={styles.educationLeft}>
                  <Text style={styles.schoolName}>{edu.school}</Text>
                  <Text style={styles.degree}>{edu.degree}</Text>
                </View>
                <View style={styles.educationRight}>
                  <Text style={styles.dateLocation}>
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </Text>
                  <Text style={styles.dateLocation}>{`${edu.city}, ${edu.country}`}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills Section */}
        {data.skills?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Core Competencies</Text>
            <View style={styles.skillsContainer}>
              {data.skills.map((skill, index) => (
                <Text key={index} style={styles.skillItem}>
                  {typeof skill === 'string' ? skill : skill.name}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Social Links */}
        {(data.socialLinks ?? []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Profiles</Text>
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
          {`${data.personal?.firstName} ${data.personal?.lastName} • Resume • ${new Date().getFullYear()}`}
        </Text>
      </Page>
    </Document>
  )
} 