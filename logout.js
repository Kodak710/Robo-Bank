document.addEventListener('DOMContentLoaded', function() {
    const logoutLink = document.querySelector('a[href="#"]:has(i.bi-box-arrow-right)');
    
    if (logoutLink) {
        logoutLink.addEventListener('click', async function(e) {
            e.preventDefault();
            
            try {
                const token = localStorage.getItem('token');
                
                // Call logout endpoint
                await fetch('http://localhost:3000/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Clear local storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                // Redirect to login page
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Logout failed:', error);
                // Still clear local storage and redirect even if the API call fails
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'login.html';
            }
        });
    }
}); 