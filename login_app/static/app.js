document.addEventListener('DOMContentLoaded', () => {
    console.log('app.js loaded');

    const form = document.querySelector('form');
    const errorMessage = document.getElementById('error-message');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('password-confirm');
    const showPassword = document.getElementById('show-password');
    const hidePassword = document.getElementById('hide-password');

    // Show/hide password
    showPassword.addEventListener('click', (event) => {
        event.preventDefault();

            password.type = 'text';
            if (form.id === 'register-form') {
                confirmPassword.type = 'text';
            }
            hidePassword.style.display = 'block';
            showPassword.style.display = 'none';
        }); 
        hidePassword.addEventListener('click', (event) => {
            event.preventDefault();
            password.type = 'password';
            if (form.id === 'register-form') {
                confirmPassword.type = 'password';
            }
            hidePassword.style.display = 'none';
            showPassword.style.display = 'block';
        });

    // Function to add the animation class and glow effect
    function animateErrorMessage() {
        if (errorMessage) {
            // Clear any existing timeouts and remove previous styles to restart the animation
            clearTimeout(errorMessage.timeoutId);
            errorMessage.style.animation = '';
            errorMessage.style.opacity = '';
            errorMessage.style.display = 'block';
    
            // Restart the entrance animation
            // Restart the entrance animation
        errorMessage.style.animation = 'fadeInUp 1s forwards';

        // Set a timeout to fade out the message after a certain duration
        errorMessage.timeoutId = setTimeout(() => {
            errorMessage.style.animation = 'fadeOut 0.5s forwards';
            // Listen for the end of the fadeOut animation
            errorMessage.addEventListener('animationend', function handler() {
                errorMessage.style.display = 'none';
                errorMessage.removeEventListener('animationend', handler);
            });
        }, 5000); // Adjust the duration as needed
        
        }
    }

    // Password validation function
    function validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    // Handle form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const usernameValue = username.value.trim();
        const passwordValue = password.value.trim();
        let confirmPasswordValue = ''; // Initialize outside the if block
        if (form.id === 'register-form') { // Check if the form's ID is 'register-form'
            confirmPasswordValue = confirmPassword.value.trim();
        }
        // Step-by-step validation
        if (!usernameValue || !passwordValue || (form.id === 'register-form' && !confirmPasswordValue)) {
            errorMessage.textContent = 'All fields are required';
            animateErrorMessage();
            return;
        }

        if (!validatePassword(passwordValue) && form.id === 'register-form') {
            errorMessage.textContent = 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
            animateErrorMessage();
            return;
        }

        if (passwordValue !== confirmPasswordValue && form.id === 'register-form') {
            errorMessage.textContent = 'Passwords do not match';
            animateErrorMessage();
            return;
        }

        // Determine the correct endpoint for the form submission
        const endpoint = form.id === 'register-form' ? '/register' : '/login';

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: usernameValue,
                password: passwordValue,
                confirmPassword: confirmPasswordValue,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                errorMessage.textContent = data.error;
                animateErrorMessage();
            } else {
                window.location.href = '/home';
            }
        })
        .catch((error) => {
            errorMessage.textContent = 'An error occurred. Please try again.';
            animateErrorMessage();
        });
    });
});
