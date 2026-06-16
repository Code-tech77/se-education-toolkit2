# 📘 Software Requirements Engineering Learning Platform

A modern Next.js-based educational platform designed to help students master **Software Requirements Engineering (SRE)** through interactive labs, adaptive assessments, and AI-powered learning support.

The platform combines structured learning, real-world scenarios, and intelligent feedback systems to simulate practical software engineering workflows.

---

## 🚀 Key Improvements & Features

### 1. 🎨 Modern UI/UX Overhaul
- Fully redesigned interface with a clean and modern layout
- Improved navigation across labs and topics
- Better responsiveness across all devices
- Enhanced user experience and consistency across components

<img width="1206" height="441" alt="Screenshot 2026-06-16 at 4 05 07 pm" src="https://github.com/user-attachments/assets/8a4ff6d0-f78a-44b8-aa17-b334aec7921f" />

---

### 2. 🧠 Adaptive Assessment System
A complete assessment engine with intelligent learning progression:

- Dynamic quizzes (5, 10, or 15 questions)
- Difficulty increases based on user performance
- Real-time feedback per question
- Detailed performance reports:
  - Topic understanding
  - Strengths and weaknesses
  - Progress tracking

---

### 3. 🤖 Simple AI Chatbot Integration
A built-in assistant that supports learning across the platform:

- Helps users navigate the system
- Explains complex requirements engineering concepts
- Provides learning resources
- Offers instant guidance across labs

<img width="1207" height="442" alt="Screenshot 2026-06-16 at 4 05 37 pm" src="https://github.com/user-attachments/assets/5c04594e-51bb-46cc-881f-e7e3c6f5ca6f" />


---

## 📌 Project Overview

This platform provides:

- Interactive lab-based exercises
- Structured learning paths
- Role-based learning modes (Tutor, Student, Professional)
- Case-study-driven scenarios
- AI-assisted learning support
- Performance-based feedback system
- URL-based filtering and navigation
- Downloadable lab sheets

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

---

### Installation

```bash
git clone https://github.com/yourusername/sse-site.git
cd sse-site
npm install
```

### Run Development Server

```bash
npm run dev 
```
###### Should See The Following Port 
```bash
http://localhost:3000
```

### 📁 Project Structure
```
/
├── app/              # Next.js routes
├── components/      # Reusable UI components
├── data/            # Lab definitions & config
│   ├── index.ts
│   └── lab-sheets/
├── lib/             # Utility functions
├── public/          # Static assets
│   └── files/
├── styles/          # Global styles
└── README.md
```

## Creating a New Lab

Labs are defined in `data/index.ts` following a structured format:

1. Create a new lab array with steps:

```typescript
const my_new_lab = [
  {
    title: "Part 1: Setup",
    time: 5,
    setup: ["Step 1", "Step 2"],
    prompt: `Your detailed prompt here...`,
  },
  {
    title: "Part 2: Game Interaction",
    time: 15,
    guidelines: ["Guideline 1", "Guideline 2"],
    details: [
      {
        heading: "Section heading",
        content: "Content details...",
      },
    ],
    // The prompt for Part 2 comes from the selected case study
    prompt: null,
  },
  // Add more steps as needed
];
```

2. Create case studies with prompts:

```typescript
const myCaseStudy: CaseStudy = {
  id: "unique-case-study-id",
  name: "Case Study Display Name",
  description: "Brief description of the case study scenario",
  prompt: `Detailed prompt for the case study that will be used in the second step of the lab...`,
};
```

3. Create a lab object:

```typescript
const my_new_lab_object: Lab = {
  id: "unique-lab-id",
  title: "Lab Title",
  description: "Brief description of the lab",
  steps: my_new_lab,
  downloadFile: "/files/lab-sheets/YourLabName.html", // Optional HTML lab sheet
};
```

4. Add your lab to the LABS array with appropriate area, topic, and case studies:

```typescript
export const LABS: LabCategory[] = [
  // Existing categories
  {
    area: "requirements engineering", // or "coding maintainers", etc.
    topic: "user_stories_and_acceptance_criteria", // or "use_cases"
    persona: "tutor", // e.g., "tutor", "student", "professional"
    labs: [my_new_lab_object],
    caseStudies: [myCaseStudy, anotherCaseStudy],
  },
];
```

### 🏁 Summary
This platform enhances software requirements engineering learning through:

* Interactive labs
* Adaptive assessments
* AI-powered chatbot support
* Modern UI/UX design

---------

**Mohammed Zuoriki**  
Cybersecurity Student | Aspiring Cloud Security Engineer | Self-Driven Technologist

LinkedIn: https://www.linkedin.com/in/mohammed-zuoriki-856133250/
