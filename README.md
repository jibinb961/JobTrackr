# JobTrackr - Job Application Tracker

JobTrackr is a modern, visually appealing web application for tracking your job applications. It features a dark-themed UI with interactive animations and a user-friendly interface.

## Features

- **Dashboard**: Get an overview of your job application statistics
- **Application Management**: Add, edit, and delete job applications
- **Filtering & Sorting**: Easily find applications by company, title, status, or source
- **Analytics**: View insights about your job search process
- **Local Storage**: All data is stored locally in your browser
- **Export/Import**: Backup your data to prevent loss

## Technologies Used

- React 18
- TypeScript
- Material UI
- Framer Motion for animations
- React Router for navigation
- Local Storage for data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Start the development server:

```bash
npm start
# or
yarn start
```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

### Adding a Job Application

1. Click on "Add New" in the sidebar or "Add New Application" button on the dashboard
2. Fill in the application details:
   - Company name
   - Job title
   - Job description
   - Application portal URL
   - Application date
   - Status
   - Source
   - Notes
3. Click "Save" to add the application

### Managing Applications

- View all applications on the Applications page
- Filter applications by status, source, or search term
- Sort applications by date, company name, or last updated
- Click on a job card to expand and see more details
- Use the edit and delete buttons to manage applications

### Analytics

The Analytics page provides insights about your job search:
- Application status breakdown
- Application source breakdown
- Key metrics like interview rate and offer rate
- Applications by month

### Settings

- Export your data as JSON
- Import previously exported data
- Delete all data (with confirmation)

## Data Storage

All data is stored locally in your browser using localStorage. To prevent data loss:
- Export your data regularly
- Use the same browser and device to access your applications
- Don't clear your browser data without exporting first

## License

This project is open source and available under the MIT License.

## Acknowledgements

- Material UI for the component library
- Framer Motion for the animations
- React Router for navigation
- Create React App for the project setup
