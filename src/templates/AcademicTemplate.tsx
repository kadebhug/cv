import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { ResumeData } from '../types/resume';
import { ColorTheme } from '../components/ResumePreviewer';

interface AcademicTemplateProps {
  data: ResumeData;
  colorTheme?: ColorTheme;
}

// Register fonts
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 700 },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-800.ttf', fontWeight: 800 },
  ],
});

Font.register({
  family: 'Merriweather',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/merriweather/v22/u-4n0qyriQwlOrhSvowK_l52_wFZWMf6.ttf' },
    { src: 'https://fonts.gstatic.com/s/merriweather/v22/u-4m0qyriQwlOrhSvowK_l5-eRZOf-c.ttf', fontWeight: 700 },
  ],
});

export function AcademicTemplate({ data, colorTheme }: AcademicTemplateProps) {
  // Use provided color theme or default to blue
  const themeColor = colorTheme?.primary || '#3b82f6';
  const secondaryColor = colorTheme?.secondary || '#93c5fd';

  // Create styles
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 30,
      fontFamily: 'Open Sans',
      fontSize: 10,
      color: '#333333',
    },
    header: {
      marginBottom: 20,
      borderBottom: `2pt solid ${themeColor}`,
      paddingBottom: 10,
    },
    name: {
      fontSize: 24,
      fontFamily: 'Merriweather',
      fontWeight: 700,
      marginBottom: 5,
      color: '#111827',
    },
    jobTitle: {
      fontSize: 14,
      color: themeColor,
      marginBottom: 10,
      fontWeight: 600,
    },
    contactInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 5,
      fontSize: 9,
    },
    contactItem: {
      marginRight: 15,
      marginBottom: 5,
    },
    sectionTitle: {
      fontSize: 14,
      fontFamily: 'Merriweather',
      fontWeight: 700,
      marginBottom: 8,
      marginTop: 15,
      color: themeColor,
      borderBottom: `1pt solid ${secondaryColor}`,
      paddingBottom: 3,
    },
    entryTitle: {
      fontSize: 11,
      fontWeight: 700,
      marginBottom: 3,
    },
    entrySubtitle: {
      fontSize: 10,
      fontWeight: 600,
      marginBottom: 3,
    },
    entryDate: {
      fontSize: 9,
      fontStyle: 'italic',
      marginBottom: 5,
    },
    entryDescription: {
      fontSize: 9,
      lineHeight: 1.5,
      marginBottom: 10,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 5,
    },
    skillItem: {
      backgroundColor: secondaryColor,
      borderRadius: 3,
      padding: '3 6',
      marginRight: 5,
      marginBottom: 5,
      fontSize: 9,
    },
    publicationsContainer: {
      marginTop: 5,
    },
    publicationItem: {
      marginBottom: 8,
      fontSize: 9,
      lineHeight: 1.5,
    },
    column: {
      flexDirection: 'column',
      width: '100%',
    },
    twoColumns: {
      flexDirection: 'row',
      marginTop: 10,
    },
    leftColumn: {
      width: '65%',
      paddingRight: 10,
    },
    rightColumn: {
      width: '35%',
      paddingLeft: 10,
      borderLeft: `1pt solid ${secondaryColor}`,
    },
    summary: {
      marginBottom: 15,
      lineHeight: 1.5,
      fontSize: 10,
    },
  });

  // Format date range
  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate) return 'Present';
    if (!endDate) return `${startDate} - Present`;
    return `${startDate} - ${endDate}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {data.personal?.firstName} {data.personal?.lastName}
          </Text>
          {data.personal?.jobTitle && (
            <Text style={styles.jobTitle}>{data.personal.jobTitle}</Text>
          )}
          <View style={styles.contactInfo}>
            {data.personal?.email && (
              <Text style={styles.contactItem}>Email: {data.personal.email}</Text>
            )}
            {data.personal?.phone && (
              <Text style={styles.contactItem}>Phone: {data.personal.phone}</Text>
            )}
            {data.personal?.address && (
              <Text style={styles.contactItem}>Address: {data.personal.address}</Text>
            )}
            {data.personal?.city && data.personal?.country && (
              <Text style={styles.contactItem}>
                {data.personal.city}, {data.personal.country}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.twoColumns}>
          <View style={styles.leftColumn}>
            {/* Professional Summary */}
            {data.professionalSummary && (
              <View>
                <Text style={styles.sectionTitle}>Research Interests & Summary</Text>
                <Text style={styles.summary}>{data.professionalSummary}</Text>
              </View>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.map((edu, index) => (
                  <View key={`edu-${index}`} style={{ marginBottom: 10 }}>
                    <Text style={styles.entryTitle}>
                      {edu.degree}
                    </Text>
                    <Text style={styles.entrySubtitle}>{edu.school}</Text>
                    <Text style={styles.entryDate}>
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </Text>
                    {edu.description && (
                      <Text style={styles.entryDescription}>{edu.description}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Publications (using custom sections) */}
            {data.customSections && data.customSections.some(section => section.title === 'Publications') && (
              <View>
                <Text style={styles.sectionTitle}>Publications</Text>
                <View style={styles.publicationsContainer}>
                  {data.customSections
                    .find(section => section.title === 'Publications')
                    ?.items.map((item, index) => (
                      <Text key={`pub-${index}`} style={styles.publicationItem}>
                        • {item.title} {item.subtitle && `(${item.subtitle})`}
                      </Text>
                    ))}
                </View>
              </View>
            )}

            {/* Research Experience (using work experience) */}
            {data.experience && data.experience.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Research Experience</Text>
                {data.experience.map((exp, index) => (
                  <View key={`exp-${index}`} style={{ marginBottom: 10 }}>
                    <Text style={styles.entryTitle}>{exp.jobTitle}</Text>
                    <Text style={styles.entrySubtitle}>{exp.employer}</Text>
                    <Text style={styles.entryDate}>
                      {formatDateRange(exp.startDate, exp.endDate)}
                    </Text>
                    {exp.description && (
                      <Text style={styles.entryDescription}>{exp.description}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.rightColumn}>
            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Skills & Expertise</Text>
                <View style={styles.skillsContainer}>
                  {data.skills.map((skill, index) => (
                    <Text key={`skill-${index}`} style={styles.skillItem}>
                      {typeof skill === 'string' ? skill : skill.name}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {data.certifications.map((cert, index) => (
                  <View key={`cert-${index}`} style={{ marginBottom: 8 }}>
                    <Text style={styles.entryTitle}>{cert.name}</Text>
                    <Text style={styles.entryDate}>{cert.date}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Courses */}
            {data.courses && data.courses.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Relevant Coursework</Text>
                {data.courses.map((course, index) => (
                  <View key={`course-${index}`} style={{ marginBottom: 8 }}>
                    <Text style={styles.entryTitle}>{course.name}</Text>
                    <Text style={styles.entryDate}>{course.institution}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Languages (using custom sections) */}
            {data.customSections && data.customSections.some(section => section.title === 'Languages') && (
              <View>
                <Text style={styles.sectionTitle}>Languages</Text>
                <View style={styles.skillsContainer}>
                  {data.customSections
                    .find(section => section.title === 'Languages')
                    ?.items.map((item, index) => (
                      <Text key={`lang-${index}`} style={styles.skillItem}>
                        {item.title} {item.subtitle && `(${item.subtitle})`}
                      </Text>
                    ))}
                </View>
              </View>
            )}

            {/* References (using custom sections) */}
            {data.customSections && data.customSections.some(section => section.title === 'References') && (
              <View>
                <Text style={styles.sectionTitle}>References</Text>
                {data.customSections
                  .find(section => section.title === 'References')
                  ?.items.map((item, index) => (
                    <View key={`ref-${index}`} style={{ marginBottom: 8 }}>
                      <Text style={styles.entryTitle}>{item.title}</Text>
                      <Text style={styles.entryDescription}>{item.description}</Text>
                    </View>
                  ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
} 