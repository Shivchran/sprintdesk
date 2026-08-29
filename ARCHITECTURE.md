# SprintDesk — System Architecture

## 1. Project Overview

SprintDesk is a React-based sprint management dashboard designed for software
development teams.

The application provides a central workspace for managing sprint tasks,
tracking progress, analyzing sprint data, and receiving notifications.

The main application features are:

- User authentication
- Protected routes
- Sprint overview dashboard
- Kanban sprint board
- Drag and drop task management
- Task creation and deletion
- Task details drawer
- Task comments
- Task filtering
- Analytics and charts
- Real-time notification simulation
- Toast notifications
- Persistent client state
- Responsive UI
- Accessibility-focused interactions
- Unit testing
- Performance optimization


---

## 2. Technology Stack

| Area | Technology |
|------|------------|
| Framework | React 18+ |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6+ |
| Server State | TanStack Query v5 |
| Client State | Zustand |
| Charts | Recharts |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Testing | Vitest |
| Component Testing | React Testing Library |
| Authentication API | DummyJSON |
| Notification API | JSONPlaceholder |
| Initial Application Data | mock-data.json |
| Code Splitting | React.lazy + Suspense |


---

## 3. High-Level Architecture

The application follows a layered frontend architecture.

```text
                    ┌──────────────────────┐
                    │        User          │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     React Pages      │
                    │                      │
                    │ Login                 │
                    │ Dashboard             │
                    │ Analytics             │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Reusable Components  │
                    │                      │
                    │ Board                 │
                    │ Task Drawer           │
                    │ Notification Bell     │
                    │ Modals                │
                    │ Filters               │
                    └──────────┬───────────┘
                               │
                  ┌────────────┴────────────┐
                  │                         │
                  ▼                         ▼
        ┌───────────────────┐     ┌───────────────────┐
        │   Query / Hooks   │     │  Zustand Stores   │
        │                   │     │                   │
        │ API requests      │     │ Authentication    │
        │ Server state      │     │ Board state       │
        │ Polling           │     │ Notifications     │
        │ Request lifecycle │     │ Toast state       │
        └─────────┬─────────┘     └───────────────────┘
                  │
                  ▼
        ┌───────────────────────┐
        │    Service Layer      │
        │                       │
        │ Authentication API    │
        │ Notification API      │
        │ Mock Data API         │
        └───────────┬───────────┘
                    │
                    ▼
        ┌────────────────────────────┐
        │ External / Mock Data Source│
        │                            │
        │ DummyJSON                 │
        │ JSONPlaceholder           │
        │ mock-data.json             │
        └────────────────────────────┘
        4. Application Layers
Presentation Layer

The presentation layer contains React pages and reusable UI components.

Examples:

DashboardPage
AnalyticsPage
LoginPage
NotificationBell
TaskDrawer
AddTaskModal
TaskFilter
BoardColumn

The presentation layer should focus on displaying data and handling user
interaction.

API implementation details should not be placed directly inside reusable UI
components.

Hook / Query Layer

Custom hooks are used to connect components with application state and API
operations.

Examples include:

Notification polling hook
Toast hook
Authentication-related hooks
Query hooks

TanStack Query is intended for server/API state such as:

API requests
Loading states
Error states
Caching
Refetching
Request lifecycle
Polling
State Management Layer

Zustand manages shared client-side application state.

The main stores include:

stores/
├── authStore.ts
├── boardStore.ts
├── notificationStore.ts
└── toastStore.ts
Service Layer

API communication is centralized in service modules.

Example:

services/
└── api/
    ├── authApi.ts
    ├── notificationApi.ts
    └── mockApi.ts

This prevents React components from being tightly coupled to API endpoints.

For example, components should not directly contain:

fetch("https://jsonplaceholder.typicode.com/posts")

Instead, API requests should be handled by the service layer.
5. Folder Structure

The project follows the following structure:

src/
│
├── components/
│   ├── ProtectedRoute.tsx
│   └── ui/
│       ├── AddTaskModal.tsx
│       ├── BoardColumn.tsx
│       ├── NotificationBell.tsx
│       ├── TaskDrawer.tsx
│       ├── TaskFilter.tsx
│       └── ...
│
├── hooks/
│   ├── useNotifications.ts
│   ├── useToast.ts
│   └── ...
│
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   └── AnalyticsPage.tsx
│
├── services/
│   └── api/
│       ├── authApi.ts
│       ├── notificationApi.ts
│       └── mockApi.ts
│
├── stores/
│   ├── authStore.ts
│   ├── boardStore.ts
│   ├── notificationStore.ts
│   └── toastStore.ts
│
├── types/
│   └── index.ts
│
├── App.tsx
└── main.tsx
6. Routing Architecture

The application uses React Router.

Current application routes:

/login
/dashboard
/board
/analytics
Public Route
/login

The login page is accessible to unauthenticated users.

Authenticated users should be redirected away from the login page.

Protected Routes
/dashboard
/board
/analytics

Protected routes are wrapped with:

ProtectedRoute

The protected route checks the authentication state.

If the user is authenticated:

User
 ↓
ProtectedRoute
 ↓
Requested Page

If the user is not authenticated:

User
 ↓
ProtectedRoute
 ↓
/login
7. Authentication Architecture

Authentication uses the DummyJSON authentication API.

Authentication flow:

                    Login Page
                        │
                        ▼
                 Login Request
                        │
                        ▼
                DummyJSON Auth API
                        │
                 ┌──────┴──────┐
                 │             │
              Success        Failure
                 │             │
                 ▼             ▼
          Access Token      Show Error
          Refresh Token
                 │
        ┌────────┴─────────┐
        │                  │
        ▼                  ▼
Access Token          Refresh Token
In Memory             localStorage
        │                  │
        └────────┬─────────┘
                 ▼
          Authenticated App

The access token is used for authenticated API requests.

The refresh token is persisted according to the assignment's local-storage
simulation.

8. Token Refresh Architecture

The application supports simulated token expiration and token refresh.

Request flow:

API Request
     │
     ▼
Attach Bearer Access Token
     │
     ▼
Send Request
     │
     ▼
Request Successful?
     │
 ┌───┴────┐
 │        │
Yes       No
 │        │
 ▼        ▼
Return   Token Expired
Response     │
             ▼
       Refresh Token Request
             │
       ┌─────┴─────┐
       │           │
    Success       Failure
       │           │
       ▼           ▼
Update Token    Logout User
       │
       ▼
Retry Original Request

This keeps authentication logic separated from UI components.

9. Kanban Board Architecture

The sprint board contains four columns:

Backlog
   │
   ▼
In Progress
   │
   ▼
Review
   │
   ▼
Done

Tasks are managed using Zustand.

Each task contains information such as:

ID
Title
Description
Status
Priority
Assignee
Due date
Sprint
Order
Completion information
10. Drag and Drop Architecture

The Kanban board uses:

@dnd-kit/core
@dnd-kit/sortable

The drag and drop flow is:

User starts dragging task
          │
          ▼
       DndContext
          │
          ▼
   Detect dragged item
          │
          ▼
 Detect destination task
      or column
          │
          ▼
     moveTask()
          │
          ▼
     Zustand Store
          │
          ▼
   Update task status
   Update task order
          │
          ▼
       React UI
          │
          ▼
 Persist board state

Tasks can be:

Reordered inside the same column
Moved between columns
Dropped directly into an empty column

The task order is maintained using an order property.

11. Board State Management

The board store is responsible for:

setTasks()
addTask()
updateTask()
updateTaskStatus()
moveTask()
deleteTask()

The store prevents duplicate task IDs and persists board state using Zustand
persistence.

The board state is stored locally so that the user's board arrangement remains
available after refreshing the page.

12. Task Details

Selecting a task opens the task details drawer.

The drawer allows users to:

View task information
Change task status
View comments
Add comments
Delete the task

The selected task is maintained as local UI state because only the current
dashboard needs this selection.

13. Task Filtering

The dashboard supports filtering by:

Search text
Priority
Status
Assignee

Filtering is derived from the current board state.

The application uses useMemo where appropriate so derived task lists are not
unnecessarily recalculated.

14. Notification Architecture

Notifications use JSONPlaceholder as a simulated real-time API.

Endpoint:

GET https://jsonplaceholder.typicode.com/posts?_limit=5

Notification flow:

JSONPlaceholder
      │
      ▼
Notification API Service
      │
      ▼
useNotifications()
      │
      ▼
Polling every 5 seconds
      │
      ▼
Check notification ID
      │
      ▼
Is ID already known?
   ┌──┴───┐
  Yes     No
   │       │
   ▼       ▼
 Ignore   Add Notification
             │
             ▼
      Zustand Notification Store
             │
       ┌─────┴──────┐
       │            │
    Panel Open   Panel Closed
       │            │
       ▼            ▼
   Show in       Show Toast
   panel

The application treats new post IDs as new notifications.

15. Notification Persistence

Notifications are stored using Zustand with persistence.

The notification store supports:

addNotification()
markAsRead()
markAllAsRead()
clearNotifications()
setPanelOpen()

The application keeps the latest 20 notifications.

Each notification contains:

{
  id: number;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}
16. Notification Polling

The notification polling interval is:

5 seconds

Polling is paused when the browser tab becomes hidden.

Browser Visible
      │
      ▼
Polling Active
      │
      ▼
Browser Hidden
      │
      ▼
Polling Stopped
      │
      ▼
Browser Visible Again
      │
      ▼
Polling Resumes

This reduces unnecessary network requests while the application is not visible.

17. Notification Toast

When a new notification is received while the notification panel is closed,
the application dispatches a notification toast event.

Flow:

New Notification
      │
      ▼
Is Notification Panel Open?
      │
   ┌──┴───┐
  Yes     No
   │       │
   ▼       ▼
No Toast  Show Toast

This allows users to notice new notifications without continuously opening the
notification panel.

18. Analytics Architecture

The Analytics page uses Recharts.

Charts are derived from the current application board data rather than being
hardcoded.

The analytics include:

Sprint Velocity

Displays the number of completed tasks per sprint.

Task Status

Displays task distribution across:

Backlog
In Progress
Review
Done
Priority Breakdown

Displays task priorities across board columns.

Completion Trend

Displays task completion over time.

19. Analytics Data Flow
Zustand Board Store
        │
        ▼
Current Tasks
        │
        ▼
Derived Analytics Data
        │
        ▼
Recharts
        │
        ▼
Responsive Charts

When board data changes, derived analytics data changes as well.

20. Design System

The application uses reusable UI components built using Tailwind CSS.

The component system includes components such as:

Button
Input
Select / Dropdown
Modal
Toast
DataTable
Loading / Skeleton
Task Card
Board Column
Notification Bell

The project does not use external UI component libraries such as:

Material UI
Ant Design
Chakra UI
Shadcn UI
21. Component Design Principles

Reusable components should:

Have a clear responsibility
Avoid unnecessary business logic
Accept data through props where appropriate
Support keyboard interaction
Provide meaningful ARIA attributes
Work across responsive layouts
Avoid duplicating UI implementation

Business logic belongs in hooks, stores, or service layers where appropriate.

22. State Management Strategy

The application separates state into three categories.

Server State

Managed using TanStack Query.

Examples:

API responses
Loading state
Error state
Cache
Refetching
Polling
Client / Application State

Managed using Zustand.

Examples:

Authentication state
Board tasks
Notifications
Toast state
Theme state
Local UI State

Managed using React component state.

Examples:

Modal open/close state
Drawer open/close state
Selected task
Search input
Current filters
Selected sprint

This separation prevents Zustand from being used for every piece of application
state.

23. API / Data Access Architecture

The UI does not directly depend on individual backend implementations.

The intended architecture is:

React Component
      │
      ▼
Custom Hook / Query
      │
      ▼
API Service
      │
      ▼
Data Source

Current data sources include:

DummyJSON
    └── Authentication

JSONPlaceholder
    └── Notifications

mock-data.json
    └── Application mock data

This approach makes it easier to replace mock APIs with a real backend later.

24. Error Handling

The application handles common failure cases such as:

Invalid login credentials
Authentication failure
Token refresh failure
API request failure
Notification polling failure
Empty task columns
Empty notification list
Invalid routes
Loading states

Notification polling errors are logged without crashing the entire application.

Authentication failures result in appropriate authentication state cleanup and
navigation to the login page where required.

25. Loading States

The application displays loading states while required application data is
being initialized.

Examples include:

Initial application loading
Authentication validation
API request loading
Empty board states

Route-level lazy loading uses React Suspense.

26. Code Splitting

Route-level code splitting is implemented using:

React.lazy()

and:

Suspense

The goal is to avoid loading every application page at initial startup.

The intended structure is:

Application
    │
    ├── Login Chunk
    │
    ├── Dashboard Chunk
    │
    └── Analytics Chunk
27. Performance Optimization

The application uses React optimization techniques where appropriate.

Examples:

React.memo
useMemo
useCallback
React.lazy
Suspense

Optimization is applied only where it provides a meaningful benefit.

The application avoids unnecessary global state and unnecessary component
re-renders.

28. Accessibility

Accessibility is considered throughout the application.

Implemented practices include:

Semantic HTML
Accessible form labels
Meaningful button labels
Keyboard-accessible interactions
ARIA attributes where required
Focusable interactive elements
Meaningful image alt text
Visible focus states
Accessible notification controls
Keyboard interaction for task cards
29. Responsive Design

The application uses Tailwind CSS responsive utilities.

The interface is designed to work across:

Mobile
Tablet
Desktop
Large Desktop

The Analytics page and Kanban board are designed to remain usable on smaller
viewports, including approximately 375px wide mobile screens.

30. Testing Strategy

Testing uses:

Vitest
React Testing Library

Required test coverage includes:

Toast Hook

Tests should verify:

Toast can be displayed
Toast can be removed
Board Store

Tests should verify:

addTask()
moveTask()
deleteTask()

Expected behavior includes:

Tasks are added correctly
Tasks can move between columns
Task order is updated
Deleted tasks are removed
Authentication Interceptor

Tests should verify:

Request
   ↓
Access Token
   ↓
Request Failure
   ↓
Refresh Token
   ↓
Retry Request

The refresh flow should successfully retry the failed request when a valid
refresh token is available.

31. Testing Command

The project should support:

npm run test

All tests should pass before submission.

32. Security Considerations

The project does not commit:

Passwords
API keys
Private credentials
Sensitive authentication data

Environment variables should be used for configurable secrets where required.

Authentication tokens should be handled according to the assignment's
simulation requirements.

33. Persistence

Zustand persistence is used for application state that needs to survive a page
refresh.

Persisted state includes:

Authentication refresh-token simulation
Board state
Notification state

Transient UI state remains local to React components.

34. Main Application Data Flow

The overall application data flow is:

                    API / Mock Data
                           │
                           ▼
                    Service Layer
                           │
                           ▼
                 Hooks / Query Layer
                           │
                           ▼
                React Application
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
       User Interaction             Derived Data
             │                           │
             ▼                           ▼
       Zustand Store                 Analytics
             │                           │
             └─────────────┬─────────────┘
                           ▼
                       React UI
                           │
                           ▼
                       Persisted
                         State
35. Key Technical Decisions
Why Zustand?

Zustand provides lightweight global client-state management without requiring
large amounts of boilerplate.

It is used for state that needs to be shared across multiple components.

Why TanStack Query?

TanStack Query is designed for server state and provides:

Caching
Loading state
Error state
Refetching
Request lifecycle management
Why dnd-kit?

dnd-kit provides flexible drag-and-drop primitives and supports sortable
interfaces and accessible interaction patterns.

Why Tailwind CSS?

Tailwind provides a consistent utility-based styling system without requiring
an external component library.

Why a Service Layer?

Centralizing API communication keeps UI components independent from backend
implementation details and makes future backend replacement easier.

36. Trade-offs

The assignment uses mock APIs rather than a production backend.

Therefore:

Authentication is simulated through DummyJSON.
Notifications are simulated through JSONPlaceholder polling.
Application data is initially loaded from mock data.
Persistence uses browser local storage where required by the assignment.

A production application would replace these implementations with a real
backend, secure token storage strategy, WebSocket/SSE notification system, and
server-side persistence.

37. Future Improvements

If additional development time were available, the following improvements could
be made:

Real backend integration
WebSocket or Server-Sent Events notifications
Server-side task persistence
Advanced authentication/session management
More comprehensive automated tests
Storybook component documentation
Automated accessibility testing with axe-core
Analytics export
Advanced drag-and-drop keyboard interactions
More detailed error recovery and retry strategies
38. Architecture Summary

SprintDesk uses a layered React architecture with clear separation between:

UI
 ↓
Hooks / Query Layer
 ↓
State Management
 ↓
Service Layer
 ↓
Data Sources

The application separates server state from client state and local UI state.

The architecture is designed to be:

Maintainable
Scalable
Testable
Responsive
Accessible
Performance-conscious
Easy to migrate from mock APIs to a real backend
39. Assignment Compliance

SprintDesk is structured around the assignment requirements:

React 18+
TypeScript strict mode
Vite
TanStack Query v5
Zustand
Tailwind CSS
React Router
Recharts
@dnd-kit
Vitest
React Testing Library
DummyJSON authentication
JSONPlaceholder notification polling
Protected routes
Kanban task management
Analytics
Notification system
Responsive design
Accessibility
Performance optimization
Automated testing