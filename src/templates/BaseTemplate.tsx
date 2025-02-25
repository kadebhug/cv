import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { ResumeData } from '../types/resume'

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
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
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 3,
  },
})

interface BaseTemplateProps {
  data: ResumeData
}

export function BaseTemplate({ data }: BaseTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{`${data.personal?.firstName} ${data.personal?.lastName}`}</Text>
          <View style={styles.contact}>
            <Text>{data.personal?.email}</Text>
            <Text>•</Text>
            <Text>{data.personal?.phone}</Text>
            <Text>•</Text>
            <Text>{`${data.personal?.city}, ${data.personal?.country}`}</Text>
          </View>
        </View>

        {/* Experience Section */}
        {(data.experience ?? []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {data.experience!.map((exp, index) => (
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
            {(data.education ?? []).map((edu, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{edu.school}</Text>
                <Text style={{ fontSize: 10, color: '#666' }}>
                  {edu.degree} | {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills Section */}
        {data.skills?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={{ fontSize: 10 }}>{data.skills.join(', ')}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
} 