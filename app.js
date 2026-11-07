const UI = {
    elements: {
        loginView: document.getElementById('login-view'),
        dashboardView: document.getElementById('dashboard-view'),
        header: document.getElementById('app-header'),
        sidebar: document.getElementById('sidebar-nav'),
        mainContent: document.getElementById('main-content'),
        userNameDisplay: document.getElementById('user-display-name'),
        userRoleBadge: document.getElementById('user-role-badge'),
        modalOverlay: document.getElementById('modal-overlay'),
        modalBody: document.getElementById('modal-body'),
        modalTitle: document.getElementById('modal-title'),
        closeModalBtn: document.getElementById('close-modal')
    },

    init: function() {
        if(this.elements.closeModalBtn) {
            this.elements.closeModalBtn.onclick = () => this.closeModal();
        }
    },

    showLogin: function() {
        this.elements.loginView.classList.remove('hidden');
        this.elements.dashboardView.classList.add('hidden');
        this.elements.header.classList.add('hidden');
    },

    loadDashboard: function(user) {
        this.elements.loginView.classList.add('hidden');
        this.elements.dashboardView.classList.remove('hidden');
        this.elements.header.classList.remove('hidden');

        this.elements.userNameDisplay.textContent = user.name;
        this.elements.userRoleBadge.textContent = user.role.toUpperCase();

        this.renderSidebar(user.role);
        
        // Load default view
        if (user.role === 'teacher') this.renderTeacherHome();
        else if (user.role === 'student') this.renderStudentHome();
        else if (user.role === 'admin') AdminLogic.renderDashboard();
    },

    renderSidebar: function(role) {
        let html = '';
        if (role === 'teacher') {
            html += `<button class="nav-btn" onclick="UI.renderTeacherHome()"><i class="fa-solid fa-house"></i> Dashboard</button>`;
            html += `<button class="nav-btn" onclick="TeacherLogic.renderAttendanceView()"><i class="fa-solid fa-calendar-check"></i> Mark Attendance</button>`;
            html += `<button class="nav-btn" onclick="TeacherLogic.renderMarksView()"><i class="fa-solid fa-chart-line"></i> Upload Marks</button>`;
        } else if (role === 'student') {
            html += `<button class="nav-btn" onclick="UI.renderStudentHome()"><i class="fa-solid fa-house"></i> Dashboard</button>`;
            html += `<button class="nav-btn" onclick="StudentLogic.renderAttendanceView()"><i class="fa-solid fa-calendar-days"></i> Attendance Report</button>`;
            html += `<button class="nav-btn" onclick="StudentLogic.renderResultsView()"><i class="fa-solid fa-trophy"></i> Results & Grades</button>`;
        } else if (role === 'admin') {
            html += `<button class="nav-btn" onclick="AdminLogic.renderDashboard()"><i class="fa-solid fa-gauge"></i> Overview</button>`;
            html += `<button class="nav-btn" onclick="AdminLogic.renderUsers()"><i class="fa-solid fa-users"></i> Manage Users</button>`;
            html += `<button class="nav-btn" onclick="AdminLogic.renderCourses()"><i class="fa-solid fa-book"></i> Manage Courses</button>`;
        }
        this.elements.sidebar.innerHTML = html;
    },

    // --- Modal System ---
    showModal: function(title, content) {
        this.elements.modalTitle.textContent = title;
        this.elements.modalBody.innerHTML = content;
        this.elements.modalOverlay.classList.remove('hidden');
    },
    closeModal: function() {
        this.elements.modalOverlay.classList.add('hidden');
    },

    // --- Placeholder Homes ---
    renderTeacherHome: function() {
        this.elements.mainContent.innerHTML = `
            <h2><i class="fa-solid fa-chalkboard-user"></i> Teacher Dashboard</h2>
            <div class="stats-container">
                <div class="stat-card"><span class="stat-number">2</span><span class="stat-label">Active Courses</span></div>
                <div class="stat-card"><span class="stat-number">45</span><span class="stat-label">Total Students</span></div>
                <div class="stat-card"><span class="stat-number">12</span><span class="stat-label">Pending Reviews</span></div>
            </div>
            <p>Welcome back. Use the sidebar to manage your classes.</p>
        `;
    },
    renderStudentHome: function() {
        this.elements.mainContent.innerHTML = `
            <h2><i class="fa-solid fa-graduation-cap"></i> Student Portal</h2>
            <div class="stats-container">
                <div class="stat-card"><span class="stat-number">85%</span><span class="stat-label">Avg. Attendance</span></div>
                <div class="stat-card"><span class="stat-number">3.5</span><span class="stat-label">Current GPA</span></div>
            </div>
        `;
    }
};

/**
 * ADMIN LOGIC
 */
const AdminLogic = {
    renderDashboard: function() {
        const db = DataStore.get();
        UI.elements.mainContent.innerHTML = `
            <h2><i class="fa-solid fa-lock"></i> Admin Dashboard</h2>
            <div class="stats-container">
                <div class="stat-card"><span class="stat-number">${db.users.length}</span><span class="stat-label">Total Users</span></div>
                <div class="stat-card"><span class="stat-number">${db.courses.length}</span><span class="stat-label">Courses</span></div>
                <div class="stat-card"><span class="stat-number">Active</span><span class="stat-label">System Status</span></div>
            </div>
            <p>Select "Manage Users" or "Manage Courses" to configure the system.</p>
        `;
    },

    renderUsers: function() {
        const db = DataStore.get();
        let html = `<div class="flex-between">
            <h2>User Management</h2>
            <button class="btn-primary" onclick="AdminLogic.showAddUserModal()">+ Add New User</button>
        </div>`;
        
        html += `<table><thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Actions</th></tr></thead><tbody>`;
        db.users.forEach(u => {
            html += `<tr>
                <td>${u.name}</td>
                <td><span class="role-badge">${u.role}</span></td>
                <td>${u.email}</td>
                <td>
                    ${u.role !== 'admin' ? `<button class="icon-btn text-danger" onclick="AdminLogic.deleteUser(${u.id})"><i class="fa-solid fa-trash"></i></button>` : ''}
                </td>
            </tr>`;
        });
        html += `</tbody></table>`;
        UI.elements.mainContent.innerHTML = html;
    },

    showAddUserModal: function() {
        const html = `
            <form onsubmit="AdminLogic.handleAddUserSubmit(event)">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="new_name" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="new_email" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="text" id="new_pass" value="123456" required>
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <select id="new_role">
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary full-width">Create User</button>
            </form>
        `;
        UI.showModal("Add New User", html);
    },

    handleAddUserSubmit: function(e) {
        e.preventDefault();
        const newUser = {
            name: document.getElementById('new_name').value,
            email: document.getElementById('new_email').value,
            password: document.getElementById('new_pass').value,
            role: document.getElementById('new_role').value,
            courses: [] // Empty init
        };
        DataStore.addUser(newUser);
        UI.closeModal();
        this.renderUsers(); // Refresh list
    },

    deleteUser: function(id) {
        if(confirm("Are you sure you want to delete this user?")) {
            DataStore.deleteUser(id);
            this.renderUsers();
        }
    },

    renderCourses: function() {
        const db = DataStore.get();
        let html = `<div class="flex-between">
            <h2>Course Management</h2>
            <button class="btn-primary" onclick="AdminLogic.showAddCourseModal()">+ Add Course</button>
        </div>`;
        
        html += `<table><thead><tr><th>Code</th><th>Course Name</th><th>Teacher ID</th><th>Actions</th></tr></thead><tbody>`;
        db.courses.forEach(c => {
            html += `<tr>
                <td>${c.code}</td>
                <td>${c.name}</td>
                <td>${c.teacherId}</td>
                <td><button class="icon-btn text-danger" onclick="AdminLogic.deleteCourse(${c.id})"><i class="fa-solid fa-trash"></i></button></td>
            </tr>`;
        });
        html += `</tbody></table>`;
        UI.elements.mainContent.innerHTML = html;
    },

    showAddCourseModal: function() {
        const db = DataStore.get();
        const teachers = db.users.filter(u => u.role === 'teacher');
        
        const html = `
            <form onsubmit="AdminLogic.handleAddCourseSubmit(event)">
                <div class="form-group">
                    <label>Course Name</label>
                    <input type="text" id="course_name" required>
                </div>
                <div class="form-group">
                    <label>Course Code</label>
                    <input type="text" id="course_code" required>
                </div>
                <div class="form-group">
                    <label>Assign Teacher</label>
                    <select id="course_teacher" required>
                        <option value="">Select Teacher...</option>
                        ${teachers.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                    </select>
                </div>
                <button type="submit" class="btn-primary full-width">Create Course</button>
            </form>
        `;
        UI.showModal("Add New Course", html);
    },

    handleAddCourseSubmit: function(e) {
        e.preventDefault();
        const newCourse = {
            name: document.getElementById('course_name').value,
            code: document.getElementById('course_code').value,
            teacherId: parseInt(document.getElementById('course_teacher').value)
        };
        DataStore.addCourse(newCourse);
        UI.closeModal();
        this.renderCourses();
    },

    deleteCourse: function(id) {
        if(confirm("Delete this course?")) {
            DataStore.deleteCourse(id);
            this.renderCourses();
        }
    }
};

/**
 * TEACHER LOGIC (Attendance & Marks)
 */
const TeacherLogic = {
    renderAttendanceView: function() {
        const db = DataStore.get();
        const courses = db.courses.filter(c => c.teacherId === Auth.currentUser.id);
        
        const today = new Date().toISOString().split('T')[0];

        let html = `<h2>Mark Attendance</h2>
        <div class="form-group"><label>Select Course</label>
            <select id="courseSelect">
                <option value="">-- Choose Course --</option>
                ${courses.map(c => `<option value="${c.id}">${c.code} - ${c.name}</option>`).join('')}
            </select>
        </div>
        <div class="form-group"><label>Date</label>
            <input type="date" id="attendanceDate" value="${today}">
        </div>
        <button class="btn-primary" onclick="TeacherLogic.loadStudents()">Load Students</button>
        <div id="student-list" class="mt-2"></div>`;
        
        UI.elements.mainContent.innerHTML = html;
    },

    loadStudents: function() {
        const courseId = document.getElementById('courseSelect').value;
        const date = document.getElementById('attendanceDate').value;
        if (!courseId || !date) return alert("Select course and date.");

        const db = DataStore.get();
        const students = db.users.filter(u => u.role === 'student');
        const courseAtt = db.attendance[courseId] || {};

        let html = `<table><thead><tr><th>Student</th><th>Status</th></tr></thead><tbody>`;
        students.forEach(s => {
            const status = courseAtt[s.id]?.[date] || 'Present';
            html += `<tr><td>${s.name}</td><td>
                <label><input type="radio" name="att_${s.id}" value="Present" ${status === 'Present'?'checked':''}> Present</label>
                <label class="ml-2"><input type="radio" name="att_${s.id}" value="Absent" ${status === 'Absent'?'checked':''}> Absent</label>
            </td></tr>`;
        });
        html += `</tbody></table><button class="btn-primary mt-2" onclick="TeacherLogic.saveAttendance(${courseId}, '${date}')">Save</button>`;
        document.getElementById('student-list').innerHTML = html;
    },

    saveAttendance: function(courseId, date) {
        const db = DataStore.get();
        const students = db.users.filter(u => u.role === 'student');
        
        if (!db.attendance[courseId]) db.attendance[courseId] = {};
        
        students.forEach(s => {
            const radios = document.getElementsByName(`att_${s.id}`);
            let val = 'Present';
            for(let r of radios) if(r.checked) val = r.value;
            
            if(!db.attendance[courseId][s.id]) db.attendance[courseId][s.id] = {};
            db.attendance[courseId][s.id][date] = val;
        });
        
        DataStore.save(db);
        alert("Saved!");
    },
    
    // --- MARKS LOGIC UPDATED FOR DROPDOWN ---
    renderMarksView: function() {
        const db = DataStore.get();
        const courses = db.courses.filter(c => c.teacherId === Auth.currentUser.id);
        
        let html = `<h2>Upload Marks</h2>
        <div class="form-group">
            <label>Select Course</label>
            <select id="courseSelectMarks" onchange="TeacherLogic.loadMarksList()">
                <option value="">-- Choose Course --</option>
                ${courses.map(c => `<option value="${c.id}">${c.code} - ${c.name}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Select Assessment Type</label>
            <select id="assessmentType" onchange="TeacherLogic.loadMarksList()">
                <option value="">-- Choose Assessment --</option>
                <option value="Assignment">Assignment</option>
                <option value="Quiz">Quiz</option>
                <option value="Midterm">Midterm</option>
                <option value="Final">Final</option>
            </select>
        </div>
        <div id="marks-list" class="mt-2"></div>`;
        
        UI.elements.mainContent.innerHTML = html;
    },

    loadMarksList: function() {
        const courseId = document.getElementById('courseSelectMarks').value;
        const type = document.getElementById('assessmentType').value;

        // Only load if both are selected
        if (!courseId || !type) {
            document.getElementById('marks-list').innerHTML = '';
            return;
        }

        const db = DataStore.get();
        const students = db.users.filter(u => u.role === 'student');
        
        let maxMarks = 100;
        if(type === 'Quiz' || type === 'Assignment') maxMarks = 20;
        else if(type === 'Midterm') maxMarks = 30;
        else if(type === 'Final') maxMarks = 50;

        let html = `<div class="alert alert-warning">Entering marks for: <strong>${type}</strong> (Max: ${maxMarks})</div>`;
        html += `<table><thead><tr><th>Student</th><th>Score</th></tr></thead><tbody>`;
        
        students.forEach(s => {
             // Fetch existing mark for this specific type
             const currentMarks = db.results[courseId]?.[s.id]?.[type] || '';
             
             html += `<tr>
                <td>${s.name}</td>
                <td><input type="number" id="mark_${s.id}" value="${currentMarks}" max="${maxMarks}" style="width:80px"></td>
             </tr>`;
        });
        html += `</tbody></table><button class="btn-primary mt-2" onclick="TeacherLogic.saveMarks(${courseId}, '${type}')">Save ${type} Marks</button>`;
        document.getElementById('marks-list').innerHTML = html;
    },

    saveMarks: function(courseId, type) {
        const db = DataStore.get();
        const students = db.users.filter(u => u.role === 'student');
        
        if (!db.results[courseId]) db.results[courseId] = {};
        
        students.forEach(s => {
            const val = document.getElementById(`mark_${s.id}`).value;
            if(!db.results[courseId][s.id]) db.results[courseId][s.id] = {};
            
            // Save specifically to the assessment type
            db.results[courseId][s.id][type] = val;
        });
        
        DataStore.save(db);
        alert(`${type} Marks Updated Successfully!`);
    }
};

const StudentLogic = {
    renderAttendanceView: function() {
        const db = DataStore.get();
        const courses = db.courses; 
        let html = `<h2>Attendance Report</h2><table><thead><tr><th>Course</th><th>%</th><th>Action</th></tr></thead><tbody>`;
        
        courses.forEach(c => {
            const record = db.attendance[c.id]?.[Auth.currentUser.id] || {};
            const total = Object.keys(record).length;
            const present = Object.values(record).filter(v => v === 'Present').length;
            const pct = total ? Math.round((present/total)*100) : 0;
            
            html += `<tr>
                <td>${c.code}</td>
                <td class="${pct < 75 ? 'text-danger' : 'text-success'}">${pct}%</td>
                <td><button class="icon-btn" onclick="StudentLogic.showAttendanceDetails(${c.id}, '${c.code}')"><i class="fa-solid fa-eye"></i></button></td>
            </tr>`;
        });
        html += `</tbody></table>`;
        UI.elements.mainContent.innerHTML = html;
    },

    showAttendanceDetails: function(courseId, courseCode) {
        const db = DataStore.get();
        const record = db.attendance[courseId]?.[Auth.currentUser.id] || {};
        const dates = Object.keys(record).sort();

        let html = `<h3>${courseCode} - History</h3>`;
        if (dates.length === 0) {
            html += `<p>No records found.</p>`;
        } else {
            html += `<table style="width:100%"><thead><tr><th>Date</th><th>Status</th></tr></thead><tbody>`;
            dates.forEach(date => {
                const status = record[date];
                html += `<tr><td>${date}</td><td style="color:${status==='Present'?'var(--success)':'var(--danger)'}">${status}</td></tr>`;
            });
            html += `</tbody></table>`;
        }
        UI.showModal("Attendance History", html);
    },
    
    // --- RESULTS VIEW UPDATED FOR BREAKDOWN ---
    renderResultsView: function() {
        const db = DataStore.get();
        const courses = db.courses;
        let html = `<h2>My Results</h2>
        <table>
            <thead>
                <tr>
                    <th>Course</th>
                    <th>Assignment</th>
                    <th>Quiz</th>
                    <th>Midterm</th>
                    <th>Final</th>
                    <th>Total</th>
                    <th>Grade</th>
                </tr>
            </thead>
            <tbody>`;
        
        courses.forEach(c => {
            const r = db.results[c.id]?.[Auth.currentUser.id] || {};
            
            // Safe parsing of marks
            const assign = parseInt(r['Assignment'] || 0);
            const quiz = parseInt(r['Quiz'] || 0);
            const mid = parseInt(r['Midterm'] || 0);
            const final = parseInt(r['Final'] || 0);
            
            const total = assign + quiz + mid + final;
            let grade = total >= 90 ? 'A' : total >= 80 ? 'B' : total >= 60 ? 'C' : 'F';
            
            html += `<tr>
                <td>${c.code}</td>
                <td>${r['Assignment'] || '-'}</td>
                <td>${r['Quiz'] || '-'}</td>
                <td>${r['Midterm'] || '-'}</td>
                <td>${r['Final'] || '-'}</td>
                <td><strong>${total}</strong></td>
                <td><strong>${grade}</strong></td>
            </tr>`;
        });
        html += `</tbody></table>`;
        UI.elements.mainContent.innerHTML = html;
    }
};

window.onload = function() {
    UI.init();
    Auth.init();
    Auth.checkSession();
};