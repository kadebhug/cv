import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { ResumeData } from '../types/resume'
import { ColorTheme } from '../components/ResumePreviewer'

const createStyles = (theme: ColorTheme) => StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    fontFamily: 'Helvetica',
  },
  sidebar: {
    width: '30%',
    backgroundColor: '#f5f7fa',
    padding: 20,
    color: '#333',
  },
  main: {
    width: '70%',
    padding: 20,
  },
  nameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2c3e50',
  },
  jobTitle: {
    fontSize: 14,
    color: theme.primary,
    marginBottom: 10,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 15,
    color: '#555',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.primary,
    marginRight: 8,
  },
  contactText: {
    fontSize: 10,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 10,
    marginTop: 20,
    textTransform: 'uppercase',
    borderBottom: `1px solid ${theme.primary}`,
    paddingBottom: 3,
  },
  sidebarSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 10,
    marginTop: 20,
    textTransform: 'uppercase',
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
    fontSize: 12,
    fontWeight: 'bold',
  },
  jobTitleText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#555',
  },
  dateText: {
    fontSize: 10,
    color: '#777',
    textAlign: 'right',
  },
  locationText: {
    fontSize: 10,
    color: '#777',
    marginBottom: 5,
  },
  bulletPoint: {
    fontSize: 10,
    marginBottom: 3,
    lineHeight: 1.4,
    flexDirection: 'row',
  },
  bullet: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
  },
  skillsContainer: {
    flexDirection: 'column',
  },
  skillCategory: {
    marginBottom: 10,
  },
  skillCategoryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  skillList: {
    fontSize: 10,
    color: '#555',
    lineHeight: 1.4,
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
  projectItem: {
    marginBottom: 10,
  },
  projectTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectLink: {
    fontSize: 10,
    color: theme.primary,
    marginLeft: 5,
  },
  projectDescription: {
    fontSize: 10,
    color: '#555',
    lineHeight: 1.4,
  },
  certificateItem: {
    marginBottom: 8,
  },
  certificateTitle: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  certificateIssuer: {
    fontSize: 9,
    color: '#555',
    fontStyle: 'italic',
  },
});

interface TechTemplateProps {
  data: ResumeData;
  colorTheme: ColorTheme;
}

// Helper function to split description into bullet points
const splitIntoBullets = (description: string) => {
  if (!description) return [];
  return description.split('\n').filter(item => item.trim() !== '');
};

export function TechTemplate({ data, colorTheme }: TechTemplateProps) {
  const styles = createStyles(colorTheme);

  // Group skills by category for better organization
  const skillsByCategory = data.skills?.reduce((acc, skill) => {
    const skillName = typeof skill === 'string' ? skill : skill.name;
    const category = typeof skill === 'string' ? 'Technical Skills' : skill.level || 'Technical Skills';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push(skillName);
    return acc;
  }, {} as Record<string, string[]>) || {};
  
  const skillCategories = Object.keys(skillsByCategory);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Left Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.nameTitle}>{`${data.personal?.firstName || ''} ${data.personal?.lastName || ''}`}</Text>
          <Text style={styles.jobTitle}>{data.personal?.jobTitle || ''}</Text>
          
          {data.professionalSummary && (
            <Text style={styles.summary}>{data.professionalSummary}</Text>
          )}
          
          {/* Contact Information */}
          {data.personal?.email && (
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}></View>
              <Text style={styles.contactText}>{data.personal.email}</Text>
            </View>
          )}
          
          {data.personal?.phone && (
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}></View>
              <Text style={styles.contactText}>{data.personal.phone}</Text>
            </View>
          )}
          
          {data.personal?.city && data.personal?.country && (
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}></View>
              <Text style={styles.contactText}>{`${data.personal.city}, ${data.personal.country}`}</Text>
            </View>
          )}
          
          {/* Social Links */}
          {(data.socialLinks ?? []).length > 0 && (
            <>
              <Text style={styles.sidebarSectionTitle}>Links</Text>
              {data.socialLinks.map((link, index) => (
                <View key={index} style={styles.contactItem}>
                  <View style={styles.contactIcon}></View>
                  <Text style={styles.contactText}>{link.platform}: {link.url}</Text>
                </View>
              ))}
            </>
          )}
          
          {/* Technical Skills Section */}
          {data.skills?.length > 0 && (
            <>
              <Text style={styles.sidebarSectionTitle}>Technical Skills</Text>
              <View style={styles.skillsContainer}>
                {skillCategories.map((category, index) => (
                  <View key={index} style={styles.skillCategory}>
                    <Text style={styles.skillCategoryTitle}>
                      {category}
                    </Text>
                    <Text style={styles.skillList}>
                      {skillsByCategory[category].join(', ')}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
          
          {/* Certifications Section */}
          {(data.certifications ?? []).length > 0 && (
            <>
              <Text style={styles.sidebarSectionTitle}>Certificates</Text>
              {data.certifications?.map((cert, index) => (
                <View key={index} style={styles.certificateItem}>
                  <Text style={styles.certificateTitle}>{cert.name}</Text>
                  <Text style={styles.certificateIssuer}>{cert.issuer}</Text>
                </View>
              ))}
            </>
          )}
          
          {/* Education Section */}
          {(data.education ?? []).length > 0 && (
            <>
              <Text style={styles.sidebarSectionTitle}>Education</Text>
              {data.education.map((edu, index) => (
                <View key={index} style={styles.educationItem}>
                  <Text style={styles.schoolName}>{edu.degree}</Text>
                  <Text style={styles.degree}>{edu.school}</Text>
                  <Text style={styles.locationText}>
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>
        
        {/* Main Content */}
        <View style={styles.main}>
          {/* Work Experience Section */}
          {(data.experience ?? []).length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Work Experience</Text>
              {data.experience.map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.companyName}>{exp.employer}</Text>
                    <Text style={styles.dateText}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                  <Text style={styles.jobTitleText}>{exp.jobTitle}</Text>
                  <Text style={styles.locationText}>{`${exp.city}, ${exp.country}`}</Text>
                  
                  {/* Bullet points for description */}
                  {splitIntoBullets(exp.description).map((bullet, i) => (
                    <View key={i} style={styles.bulletPoint}>
                      <Text style={styles.bullet}>• </Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </>
          )}
          
          {/* Projects Section */}
          {(data.projects ?? []).length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Notable Projects & Research</Text>
              {data.projects?.map((project, index) => (
                <View key={index} style={styles.projectItem}>
                  <View style={styles.projectTitle}>
                    <Text>{project.name}</Text>
                    {project.url && <Text style={styles.projectLink}>{project.url}</Text>}
                  </View>
                  
                  {/* Bullet points for description */}
                  {splitIntoBullets(project.description).map((bullet, i) => (
                    <View key={i} style={styles.bulletPoint}>
                      <Text style={styles.bullet}>• </Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </>
          )}
          
          {/* Organizations/Affiliations Section */}
          {(data.organizations ?? []).length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Organizations</Text>
              {data.organizations?.map((org, index) => (
                <View key={index} style={styles.projectItem}>
                  <Text style={styles.certificateTitle}>{org.name}</Text>
                  <Text style={styles.certificateIssuer}>{org.role}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </Page>
    </Document>
  );
} 