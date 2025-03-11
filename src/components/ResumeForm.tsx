import { PersonalSection } from './sections/PersonalSection'
import { ProfessionalSummarySection } from './sections/ProfessionalSummarySection'
import { ExperienceSection } from './sections/ExperienceSection'
import { EducationSection } from './sections/EducationSection'
import { SkillsSection } from './sections/SkillsSection'
import { SocialLinksSection } from './sections/SocialLinksSection'
import { CertificationsSection } from './sections/CertificationsSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { AchievementsSection } from './sections/AchievementsSection'
import { HobbiesSection } from './sections/HobbiesSection'

const sectionComponents = {
  personal: PersonalSection,
  summary: ProfessionalSummarySection,
  experience: ExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  social: SocialLinksSection,
  certifications: CertificationsSection,
  projects: ProjectsSection,
  achievements: AchievementsSection,
  hobbies: HobbiesSection,
} as const

interface ResumeFormProps {
  section: string
}

export function ResumeForm({ section }: ResumeFormProps) {
  const SectionComponent = sectionComponents[section as keyof typeof sectionComponents]

  if (!SectionComponent) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <p className="text-gray-500">Section under development</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <SectionComponent />
    </div>
  )
} 