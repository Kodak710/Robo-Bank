document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const updateForm = document.getElementById('update-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const toggleCurrentPassword = document.getElementById('toggleCurrentPassword');
    const toggleNewPassword = document.getElementById('toggleNewPassword');

    // Toggle password visibility
    toggleCurrentPassword.addEventListener('click', () => {
        const currentPassword = document.getElementById('current-password');
        togglePasswordVisibility(currentPassword, toggleCurrentPassword);
    });

    toggleNewPassword.addEventListener('click', () => {
        const newPassword = document.getElementById('new-password');
        togglePasswordVisibility(newPassword, toggleNewPassword);
    });

    function togglePasswordVisibility(input, button) {
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        button.querySelector('i').classList.toggle('bi-eye');
        button.querySelector('i').classList.toggle('bi-eye-slash');
    }

    // Handle form submission
    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!updateForm.checkValidity()) {
            e.stopPropagation();
            updateForm.classList.add('was-validated');
            return;
        }

        const currentPassword = document.getElementById('current-password').value;
        const newUsername = document.getElementById('new-username').value;
        const newPassword = document.getElementById('new-password').value;

        // Validate that at least one field is being updated
        if (!newUsername && !newPassword) {
            showError('Please provide either a new username or password');
            return;
        }

        try {
            const response = await fetch('https://robo-bank.onrender.com/api/auth/update-credentials', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newUsername,
                    newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update credentials');
            }

            // Update local storage with new username if changed
            if (newUsername) {
                const user = JSON.parse(localStorage.getItem('user'));
                user.username = newUsername;
                localStorage.setItem('user', JSON.stringify(user));
            }

            showSuccess('Credentials updated successfully');
            
            // Clear form
            updateForm.reset();
            updateForm.classList.remove('was-validated');

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);

        } catch (error) {
            showError(error.message);
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
    }

    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
    }
}); 