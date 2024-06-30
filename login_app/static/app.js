console.log('app.js loaded');

const errorMessage = document.getElementById('error-message');
const form = document.querySelector('form');
const username = document.getElementById('username');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('password-confirm');

// Function to add the animation class

// Function to add the animation class
function animateErrorMessage() {
    if (errorMessage) {
        errorMessage.style.animation = 'fadeInUp 1s forwards';
        
        // Add glow effect when error message remains the same
        errorMessage.classList.add('glow');
        setTimeout(() => {
            errorMessage.classList.remove('glow');
        }, 1000); // Adjust timing as needed
    }
}

// Prevent form submission if error message is displayed
form.addEventListener('submit', (event) => {
    if (username.value.trim() === '' || password.value.trim() === '' || confirmPassword.value.trim() === '') {
        event.preventDefault();
        errorMessage.textContent = 'All fields are required';
        animateErrorMessage();
    } else if (password.value !== confirmPassword.value) {
        event.preventDefault();
        errorMessage.textContent = 'Passwords do not match';
        animateErrorMessage();
    }
});

// Mutation Observer to detect changes in the error message element
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
            animateErrorMessage();
            console.log('Error message changed');
        }
    });
});

// Start observing
const config = { childList: true, characterData: true, subtree: true };
if (errorMessage) {
    observer.observe(errorMessage, config);
}
