SprintDesk
Agile Project Management Dashboard
SprintDesk is a modern and responsive Agile Project Management Dashboard built with React and TypeScript. It helps
users manage sprints, organize tasks using a Kanban board, track project progress, view analytics, receive notifications,
and manage tasks through an intuitive interface.
n Project Links
Live Demo: https://sprintdesk-plum.vercel.app
GitHub: https://github.com/Shivchran/sprintdesk
YouTube Demo: https://youtu.be/3xgJdI9mImA
n Features
• Authentication: User login, protected routes, token-based authentication, and logout.
• Dashboard: Sprint selector, overview cards, task statistics, and progress tracking.
• Kanban Board: Backlog, In Progress, Review, and Done with drag-and-drop.
• Task Management: Add/delete tasks, task details, priorities, assignees, and comments.
• Search & Filters: Search and filter by priority, status, and assignee.
• Notifications: Notification bell, unread counter, polling, read controls, and toast notifications.
• Analytics: Status, priority, sprint, and completion-trend charts.
• Dark Mode: Light and dark themes.
• Responsive Design: Desktop, tablet, and mobile support.
nn Tech Stack
React • TypeScript • Vite • Tailwind CSS • Zustand • React Router • dnd-kit • Recharts • REST API • Git • GitHub •
Vercel
n Project Structure
sprintdesk/
nnn public/
nnn src/
n nnn components/
n n nnn layout/
n n nnn ui/
n nnn data/mock-data.json
n nnn hooks/
n nnn pages/
n n nnn DashboardPage.tsx
n n nnn AnalyticsPage.tsx
n n nnn LoginPage.tsx
n nnn services/api/
n nnn stores/
n nnn types/
n nnn App.tsx
n nnn main.tsx
nnn package.json
nnn vite.config.ts
nnn tsconfig.json
nnn README.md
n Getting Started
Clone the repository:
git clone https://github.com/Shivchran/sprintdesk.git
cd sprintdesk
npm install
npm run dev
The development server will normally run at http://localhost:5173
nn Production Build
npm run build
npm run preview
n Application Flow
Login
↓
Authentication
↓
Dashboard
nnn Sprint Selection
nnn Task Board
n nnn Backlog
n nnn In Progress
n nnn Review
n nnn Done
nnn Task Management
nnn Search & Filters
nnn Notifications
nnn Analytics
n Analytics
• Task Status chart
• Priority Breakdown chart
• Tasks by Sprint chart
• Completion Trend chart
• Overall completion progress
• Task summary table
n Notification System
SprintDesk periodically requests notification data, checks for new notifications, stores them with Zustand, and exposes
them through the notification bell, notification panel, and toast UI.
n Security Considerations
For production, use HTTPS, secure HttpOnly cookies where appropriate, token expiration and rotation, server-side
validation, environment variables for secrets, and never commit secrets to GitHub.
n Deployment
SprintDesk is deployed using Vercel. Workflow: Local Development → Git → GitHub → Vercel → Production.
n Project Objectives
• Build a modern React application
• Practice TypeScript and reusable components
• Implement Zustand state management
• Implement drag-and-drop task management
• Work with REST APIs
• Create data visualizations
• Build responsive interfaces
• Implement authentication and protected routes
• Deploy a production frontend application
n What I Learned
React architecture, TypeScript, React Router, Zustand, REST APIs, drag-and-drop interfaces, Recharts, Tailwind CSS,
responsive design, authentication, protected routes, notification polling, Git/GitHub, and Vercel deployment.
n Future Improvements
Real backend API, PostgreSQL/MongoDB database, WebSocket notifications, team management, role-based access
control, invitations, file attachments, sprint/project creation, real-time collaboration, and automated testing.
nnn Author
Sachin Upamanyu
Frontend Developer | Software Engineer
CODE • BUILD • LEARN • GROW
n If you find this project useful or interesting, consider giving the repository a star on GitHub.
