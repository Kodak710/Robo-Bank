document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
        window.location.href = 'index.html';
        return;
    }

    // Add input validation
    function validateInputs() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (username.length < 3) {
            showError('Username must be at least 3 characters long');
            return false;
        }
        
        if (password.length < 6) {
            showError('Password must be at least 6 characters long');
            return false;
        }
        
        return true;
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    // Set loading state
    function setLoading(isLoading) {
        submitButton.disabled = isLoading;
        submitButton.innerHTML = isLoading 
            ? '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Signing in...'
            : '<i class="bi bi-box-arrow-in-right"></i> Sign In';
    }

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous error
        errorMessage.style.display = 'none';
        
        // Validate inputs
        if (!validateInputs()) {
            return;
        }

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        try {
            setLoading(true);
            
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Show success message
                submitButton.innerHTML = '<i class="bi bi-check-circle"></i> Success!';
                submitButton.classList.remove('btn-primary');
                submitButton.classList.add('btn-success');
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                showError(data.message || 'Login failed. Please check your credentials.');
                setLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Unable to connect to server. Please try again later.');
            setLoading(false);
        }
    });

    // Add input event listeners for real-time validation
    usernameInput.addEventListener('input', function() {
        if (this.value.trim().length < 3) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
        }
    });

    passwordInput.addEventListener('input', function() {
        if (this.value.trim().length < 6) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
        }
    });
}); 