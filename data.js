const DataStore = {
    // Changed key to force a reset of LocalStorage
    DB_KEY: 'sarms_db_v5_clean',

    initialData: {
        users: [
            { id: 1, name: "Admin User", email: "admin@sarms.edu", password: "admin123", role: "admin" },
            { id: 2, name: "Mr. Talha Dar", email: "teacher@sarms.edu", password: "teacher123", role: "teacher" },
            { id: 3, name: "Ali Khan", email: "student@sarms.edu", password: "student123", role: "student", courses: [] }
        ],
        // Clean state: No courses, attendance, or results initially
        courses: [],
        attendance: {},
        results: {}
    },

    init: function() {
        if (!localStorage.getItem(this.DB_KEY)) {
            localStorage.setItem(this.DB_KEY, JSON.stringify(this.initialData));
            console.log("SARMS: Clean Database Initialized.");
        }
    },

    get: function() {
        return JSON.parse(localStorage.getItem(this.DB_KEY));
    },

    save: function(data) {
        localStorage.setItem(this.DB_KEY, JSON.stringify(data));
    },

    // --- Helpers for Dynamic Data ---
    
    addUser: function(user) {
        const db = this.get();
        // Generate Simple ID
        user.id = Date.now(); 
        db.users.push(user);
        this.save(db);
        return user;
    },

    deleteUser: function(id) {
        const db = this.get();
        db.users = db.users.filter(u => u.id !== id);
        this.save(db);
    },

    addCourse: function(course) {
        const db = this.get();
        course.id = Date.now();
        db.courses.push(course);
        this.save(db);
        return course;
    },
    
    deleteCourse: function(id) {
        const db = this.get();
        db.courses = db.courses.filter(c => c.id !== id);
        this.save(db);
    },

    findUser: function(email) {
        return this.get().users.find(u => u.email === email);
    }
};

DataStore.init();