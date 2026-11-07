# SARMS – Student Attendance and Result Management System

SARMS is a browser-based student management portal built with HTML, CSS, and JavaScript. It provides separate dashboards for administrators, teachers, and students, with features for managing users and courses, recording attendance, and viewing assessment results.

## Features

### Admin
- View an overview of the system, including total users and courses.
- Add users with Student, Teacher, or Admin roles.
- View the user list and delete non-admin users.
- Add courses and assign them to teachers.
- View and delete courses.

### Teacher
- View a teacher dashboard.
- Select an assigned course and date to record student attendance.
- Mark students as Present or Absent and save the records.
- Select a course and assessment type to enter marks.
- Record marks for Assignments, Quizzes, Midterms, and Finals.

### Student
- View a student dashboard.
- View attendance percentages by course.
- Open an attendance history showing dates and attendance status.
- View assessment marks, total marks, and calculated grades.

## Technology Stack

- **HTML5** – page structure
- **CSS3** – interface styling (the project references `styles.css`)
- **JavaScript** – application logic and interactive dashboards
- **Browser Local Storage** – stores users, courses, attendance, and results
- **Browser Session Storage** – keeps the current login session
- **Font Awesome** – interface icons
- **Google Fonts** – Plus Jakarta Sans typeface

## Project Structure

```text
SARMS/
├── index.html
├── styles.css
├── app.js
├── auth.js
├── data.js
└── README.md
```

> `styles.css` is referenced by `index.html`, but it was not included among the files provided for this README. Add the stylesheet to the repository if it is part of your project.

## Getting Started

### Requirements
- A modern web browser
- The project files, including `index.html`, `app.js`, `auth.js`, `data.js`, and the referenced `styles.css`

### Run the project
1. Download or clone the repository.
2. Keep the JavaScript files and `index.html` in the same folder.
3. Make sure `styles.css` is also present in that folder.
4. Open `index.html` in a web browser.

No package installation or build step is shown in the provided project files.

## Demo Login Accounts

The initial data in `data.js` defines these demo accounts:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@sarms.edu` | `admin123` |
| Teacher | `teacher@sarms.edu` | `teacher123` |
| Student | `student@sarms.edu` | `student123` |

These are hard-coded demonstration credentials. Do not use real or sensitive passwords.

## Data Storage

The application stores its data in the browser:
- `localStorage` holds the application database.
- `sessionStorage` holds the currently logged-in user for the active browser session.

Data is therefore browser-specific and is not synchronized to a server or shared between different users' devices. Clearing the browser's site data can remove the saved application data.

## Important Notes

- This project is a front-end demonstration. The provided files do not show a server-side API or database.
- Login credentials are checked in client-side JavaScript, and the demo passwords are stored in browser data. This is not suitable for production authentication.
- The supplied files do not include `styles.css`; the page references it, so the interface may not display its intended styling until that file is added.
- The default data starts with three demo users and no courses, attendance records, or results.

## Possible Future Improvements

- Add a secure backend with server-side authentication and authorization.
- Use a database for persistent, centralized records.
- Add course enrollment so attendance and results can be limited to students in each course.
- Add validation for marks and improve error handling.
- Add reporting and export options for attendance and results.

## License

No license information was included in the provided project files. Add a license file if you intend to publish or distribute this project.
