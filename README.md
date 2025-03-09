# Resume Builder

A modern, feature-rich resume builder application built with React, TypeScript, and Vite. Create professional resumes with multiple templates, customization options, and intelligent feedback. Also includes cover letter creation and job search tools.

## Features

- **Multiple Resume Templates**: Choose from various professional templates to showcase your experience.
- **Real-time Preview**: See changes to your resume in real-time as you edit.
- **Customizable Sections**: Add, edit, and arrange different sections of your resume.
- **Color Themes**: Personalize your resume with different color schemes.
- **Resume Feedback**: Get instant feedback on your resume content and formatting to improve quality.
- **ATS Optimization**: Ensure your resume is compatible with Applicant Tracking Systems (ATS) and optimize for relevant keywords.
- **Cover Letter Builder**: Create customized cover letters for your job applications.
- **Job Search Integration**: Search and apply for jobs directly from the dashboard.
- **Export Options**: Download your resume as PDF.
- **Responsive Design**: Works on desktop and mobile devices.

## Resume Feedback Feature

The Resume Feedback feature provides instant analysis of your resume content, highlighting:

- Missing or incomplete sections
- Content quality issues
- Formatting suggestions
- Overall resume score
- Section-by-section improvement recommendations

## ATS Optimization Feature

The ATS Optimization feature helps ensure your resume passes through Applicant Tracking Systems:

- Analyze job descriptions to extract relevant keywords
- Check keyword match rate between your resume and job descriptions
- Identify missing keywords to add to your resume
- Provide ATS compatibility tips
- Highlight potential formatting issues that could affect ATS parsing

## Cover Letter Builder

The Cover Letter Builder helps you create professional cover letters:

- Easy-to-use form with section guidance
- Customizable recipient information
- Structured format with introduction, body, and conclusion sections
- Save and manage multiple cover letters for different applications
- Integration with your resume data

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account (for authentication and data storage)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/resume-builder.git
cd resume-builder
```

2. Set up environment variables
   Create a `.env` file with your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

3. Install dependencies
```bash
npm install
# or
yarn
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Firebase Setup

1. Create a new Firebase project
2. Enable Authentication (Email/Password and Google)
3. Set up Firestore Database 
4. Deploy Firestore security rules:
```bash
npm run deploy:firebase:rules
```

## Technologies Used

- React
- TypeScript
- Vite
- Firebase (Authentication, Firestore)
- React Hook Form
- Zod (for form validation)
- React PDF (for PDF generation)
- Tailwind CSS (for styling)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
