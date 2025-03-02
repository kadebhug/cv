# Resume Builder

A modern, feature-rich resume builder application built with React, TypeScript, and Vite. Create professional resumes with multiple templates, customization options, and intelligent feedback.

## Features

- **Multiple Resume Templates**: Choose from various professional templates to showcase your experience.
- **Real-time Preview**: See changes to your resume in real-time as you edit.
- **Customizable Sections**: Add, edit, and arrange different sections of your resume.
- **Color Themes**: Personalize your resume with different color schemes.
- **Resume Feedback**: Get instant feedback on your resume content and formatting to improve quality.
- **ATS Optimization**: Ensure your resume is compatible with Applicant Tracking Systems (ATS) and optimize for relevant keywords.
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

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/resume-builder.git
cd resume-builder
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Technologies Used

- React
- TypeScript
- Vite
- React Hook Form
- Zod (for form validation)
- React PDF (for PDF generation)
- Tailwind CSS (for styling)
- Firebase (for authentication, database, and storage)

## Firebase Setup

This project uses Firebase for authentication, database, and storage. To set up Firebase:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Register a new web app in your Firebase project
3. Enable the services you need (Authentication, Firestore, Storage)
4. Copy your Firebase configuration from the Firebase Console
5. Create a `.env` file in the root directory based on the `.env.example` template
6. Fill in your Firebase configuration values in the `.env` file

Example:
```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

