document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        // If not authenticated, redirect to login page
        window.location.href = 'login.html';
        return;
    }

    try {
        // Verify token with backend
        const response = await fetch('http://localhost:3000/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Authentication failed');
        }

        const data = await response.json();
        
        // Update UI with user data
        const userName = document.getElementById('user-name');
        const lastLogin = document.getElementById('last-login');
        
        if (userName) {
            userName.textContent = data.user.username;
        }
        
        if (lastLogin) {
            const loginDate = new Date(data.user.lastLogin);
            lastLogin.textContent = loginDate.toLocaleString();
        }

        // Get DOM elements - These will only be accessed if logged in
        // const unlockButton = document.getElementById('unlock-button'); // Removed as it now links to a new page
        const accountLockNotice = document.getElementById('account-lock-notice');
        const transferForm = document.getElementById('transfer-form');
        const transferButton = document.getElementById('transfer-button');
        const formInputs = transferForm ? transferForm.querySelectorAll('input') : []; // Add check
        const refreshBalancesButton = document.getElementById('refresh-balances');
        const balanceElements = document.querySelectorAll('.balance');

        // Initialize form state
        // Check if transferForm exists before accessing its properties
        if (transferForm) {
            transferForm.classList.remove('active');
            transferButton.disabled = true;
            formInputs.forEach(input => input.disabled = true);
        }

        // Format currency
        function formatCurrency(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        }

        // Update last login time
        function updateLastLogin() {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            if (lastLogin) { // Add check for lastLogin element
                lastLogin.textContent = now.toLocaleDateString('en-US', options);
            }
        }

        // Simulate balance refresh
        function refreshBalances() {
            if (refreshBalancesButton) { // Add check for refreshBalancesButton
                refreshBalancesButton.disabled = true;
                refreshBalancesButton.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Refreshing...';
            }

            // Simulate API call
            setTimeout(() => {
                if (balanceElements) { // Add check for balanceElements
                    balanceElements.forEach(balance => {
                        const currentAmount = parseFloat(balance.textContent.replace(/[^0-9.-]+/g, ''));
                        const randomChange = (Math.random() - 0.5) * 1000;
                        const newAmount = currentAmount + randomChange;
                        balance.textContent = formatCurrency(newAmount);
                    });
                }

                if (refreshBalancesButton) { // Add check for refreshBalancesButton
                    refreshBalancesButton.disabled = false;
                    refreshBalancesButton.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Refresh';
                }

                // Show success message
                const cardBody = document.querySelector('.card-body');
                const balanceItem = document.querySelector('.balance-item');
                if (cardBody && balanceItem) { // Add checks for elements
                    const successAlert = document.createElement('div');
                    successAlert.className = 'alert alert-success';
                    successAlert.innerHTML = '<i class="bi bi-check-circle"></i> Balances updated successfully!';
                    cardBody.insertBefore(successAlert, balanceItem);

                    setTimeout(() => {
                        successAlert.remove();
                    }, 3000);
                }
            }, 1500);
        }

        // Handle refresh button click
        if (refreshBalancesButton) { // Add check for refreshBalancesButton
            refreshBalancesButton.addEventListener('click', refreshBalances);
        }

        // Helper: create and show a modal - REMOVED as we are navigating to a new page
        // function showPaymentModal(onConfirm) { ... }

        // Handle unlock button click - REMOVED as it now links to a new page
        // if (unlockButton) { ... }
        // else { console.error('Unlock button with ID "unlock-button" not found.'); }

        // Handle form submission
        // Check if transferForm exists before adding event listener
        if (transferForm) {
            transferForm.addEventListener('submit', function(e) {
                e.preventDefault();

                // Get form values
                const recipientName = document.getElementById('recipient-name').value;
                const accountNumber = document.getElementById('account-number').value;
                const routingNumber = document.getElementById('routing-number').value;
                const amount = document.getElementById('transfer-amount').value;
                const note = document.getElementById('transfer-note').value;

                // Validate form
                if (!recipientName || !accountNumber || !routingNumber || !amount) {
                    alert('Please fill in all required fields');
                    return;
                }

                // Validate amount
                const transferAmount = parseFloat(amount);
                if (isNaN(transferAmount) || transferAmount <= 0) {
                    alert('Please enter a valid amount');
                    return;
                }

                // Simulate transfer processing
                if (transferButton) { // Add check for transferButton
                    transferButton.disabled = true;
                    transferButton.innerHTML = '<i class="bi bi-hourglass-split"></i> Processing Transfer...';
                }

                setTimeout(() => {
                    // Update balance
                    if (balanceElements && balanceElements[0]) { // Add checks for elements
                        const currentBalance = parseFloat(balanceElements[0].textContent.replace(/[^0-9.-]+/g, ''));
                        const newBalance = currentBalance - transferAmount;
                        balanceElements[0].textContent = formatCurrency(newBalance);
                    }

                    // Add transaction to list
                    const transactionList = document.querySelector('.transaction-list');
                    if (transactionList) { // Add check for transactionList
                        const newTransaction = document.createElement('div');
                        newTransaction.className = 'transaction-item';
                        newTransaction.innerHTML = `
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4>Transfer to ${recipientName}</h4>
                                    <p class="text-muted">${new Date().toLocaleString()}</p>
                                </div>
                                <span class="amount negative">-${formatCurrency(transferAmount)}</span>
                            </div>
                        `;
                        transactionList.insertBefore(newTransaction, transactionList.firstChild);
                    }

                    // Show success message
                    if (transferForm && transferButton) { // Add checks for elements
                        const successAlert = document.createElement('div');
                        successAlert.className = 'alert alert-success';
                        successAlert.innerHTML = '<i class="bi bi-check-circle"></i> Transfer completed successfully!';
                        transferForm.insertBefore(successAlert, transferButton);
                    }

                    // Reset form
                    transferForm.reset();

                    // Remove success message and re-enable button after 3 seconds
                    setTimeout(() => {
                        if (successAlert && successAlert.remove) { // Add check before removing
                            successAlert.remove();
                        }
                        if (transferButton) { // Add check for transferButton
                            transferButton.disabled = false;
                            transferButton.innerHTML = '<i class="bi bi-send"></i> Make Transfer';
                        }
                    }, 3000);
                }, 2000);
            });

            // Add input validation
            formInputs.forEach(input => {
                input.addEventListener('input', function() {
                    if (this.value.trim() === '') {
                        this.classList.add('is-invalid');
                    } else {
                        this.classList.remove('is-invalid');
                    }
                });
            });
        } else {
            console.error('Transfer form with ID "transfer-form" not found.');
        }

        // Initialize
        updateLastLogin();
    } catch (error) {
        console.error('Authentication error:', error);
        // Clear invalid session data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login
        window.location.href = 'login.html';
    }
});

// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }

    // Update user information in the dashboard
    document.querySelector('.user-avatar').alt = `${user.username}'s Profile Picture`;
    // You can add more user information updates here
}

// Call checkAuth when the page loads
document.addEventListener('DOMContentLoaded', checkAuth);

// Handle logout
document.querySelector('a[href="#"]:last-child').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    // Toggle sidebar on mobile
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !mobileMenuBtn.contains(e.target) && 
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
        }
    });

    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }

    // Update user information in the dashboard
    document.querySelector('.user-avatar').alt = `${user.username}'s Profile Picture`;

    // Handle logout
    document.getElementById('logout-link').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });

    // Rest of your existing dashboard functionality...
}); 