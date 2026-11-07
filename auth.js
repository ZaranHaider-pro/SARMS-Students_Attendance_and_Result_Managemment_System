const Auth = {
    currentUser: null,

    init: function() {
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleLogin(e));
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    },

    handleLogin: function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const user = DataStore.findUser(email);

        if (user && user.password === password) {
            this.currentUser = user;
            sessionStorage.setItem('sarms_user', JSON.stringify(user));
            UI.loadDashboard(user);
        } else {
            alert("Invalid credentials! Please try again.");
        }
    },

    checkSession: function() {
        const storedUser = sessionStorage.getItem('sarms_user');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
            UI.loadDashboard(this.currentUser);
        } else {
            UI.showLogin();
        }
    },

    logout: function() {
        this.currentUser = null;
        sessionStorage.removeItem('sarms_user');
        UI.showLogin();
    }
};