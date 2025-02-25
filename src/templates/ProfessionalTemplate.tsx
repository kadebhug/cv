import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { ResumeData } from '../types/resume'

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: '#1a365d',
    padding: 20,
    color: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 20,
    border: '2px solid white',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  contact: {
    fontSize: 10,
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a365d',
    borderBottomWidth: 2,
    borderBottomColor: '#1a365d',
    paddingBottom: 5,
    marginBottom: 10,
  },
  summary: {
    fontSize: 11,
    marginBottom: 20,
    lineHeight: 1.5,
  }
})

export function ProfessionalTemplate({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {data.personal?.photo && (
            <Image 
              src={data.personal.photo} 
              style={styles.photo} 
            />
          )}
          <View style={styles.headerContent}>
            <Text style={styles.name}>{`${data.personal?.firstName || ''} ${data.personal?.lastName || ''}`}</Text>
            <Text style={styles.jobTitle}>{data.personal?.jobTitle || ''}</Text>
            <View style={styles.contact}>
              <Text>{data.personal?.email || ''}</Text>
              <Text>|</Text>
              <Text>{data.personal?.phone || ''}</Text>
              <Text>|</Text>
              <Text>{`${data.personal?.city || ''}, ${data.personal?.country || ''}`}</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Professional Summary */}
          {data.professionalSummary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Summary</Text>
              <Text style={styles.summary}>{data.professionalSummary}</Text>
            </View>
          )}

          {/* Experience Section */}
          {(data.experience ?? []).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Experience</Text>
              {data.experience.map((exp, index) => (
                <View key={index} style={{ marginBottom: 15 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{exp.employer}</Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1a365d' }}>
                    {exp.jobTitle}
                  </Text>
                  <Text style={{ fontSize: 10, marginBottom: 5 }}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate} | {exp.city}, {exp.country}
                  </Text>
                  <Text style={{ fontSize: 10, lineHeight: 1.5 }}>{exp.description}</Text>
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
                  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{edu.school}</Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1a365d' }}>
                    {edu.degree}
                  </Text>
                  <Text style={{ fontSize: 10 }}>
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate} | {edu.city}, {edu.country}
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
                    style={{ 
                      backgroundColor: '#e2e8f0', 
                      padding: '3 8',
                      borderRadius: 4,
                      marginBottom: 5
                    }}
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
        </View>
      </Page>
    </Document>
  )
} 