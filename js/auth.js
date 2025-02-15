// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Get theme from localStorage or system preference
const getCurrentTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return prefersDarkScheme.matches ? 'dark' : 'light';
};

// Set initial theme
document.body.dataset.theme = getCurrentTheme();

// Handle theme toggle click
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.dataset.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
});

// Handle system theme change
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        document.body.dataset.theme = e.matches ? 'dark' : 'light';
    }
});

// Password Toggle Functionality
const passwordInputs = document.querySelectorAll('input[type="password"]');
passwordInputs.forEach(input => {
    const toggleBtn = input.parentElement.querySelector('.toggle-password');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
        });
    }
});

// Form Validation and Submission
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Helper function to show error
const showError = (input, message) => {
    const formGroup = input.closest('.form-group');
    const errorDiv = formGroup.querySelector('.error-message') || document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(errorDiv);
    }
    input.classList.add('error');
};

// Helper function to remove error
const removeError = (input) => {
    const formGroup = input.closest('.form-group');
    const errorDiv = formGroup.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    input.classList.remove('error');
};

// Validate email format
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validate password strength
const isValidPassword = (password) => {
    return password.length >= 8;
};

// Handle Login Form
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;

        // Get active login section
        const activeSection = document.querySelector('.login-section.active');
        const loginType = activeSection.id;

        if (loginType === 'passwordLogin') {
            const email = document.getElementById('email');
            const password = document.getElementById('password');

            // Clear previous errors
            removeError(email);
            removeError(password);

            // Validate email
            if (!email.value.trim()) {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email');
                isValid = false;
            }

            // Validate password
            if (!password.value) {
                showError(password, 'Password is required');
                isValid = false;
            }

            if (isValid) {
                try {
                    // Show loading state
                    const submitBtn = loginForm.querySelector('.auth-submit');
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;

                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    // Check if 2FA is enabled (simulate API response)
                    const has2FA = Math.random() > 0.5; // For demo purposes

                    if (has2FA) {
                        // Save email in session storage for 2FA verification
                        sessionStorage.setItem('pendingAuth', email.value);
                        window.location.href = 'verify-otp.html';
                    } else {
                        // Save last login time
                        localStorage.setItem('lastLogin', new Date().toISOString());
                        
                        // Handle "Remember this device"
                        if (document.getElementById('rememberDevice').checked) {
                            localStorage.setItem('rememberedDevice', 'true');
                        }
                        
                        window.location.href = 'dashboard.html';
                    }
                } catch (error) {
                    console.error('Login failed:', error);
                    showToast('Invalid credentials. Please try again.', 'error');
                } finally {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
            }
        } else if (loginType === 'otpLogin') {
            // Handle OTP login
            const otpEmail = document.getElementById('otpEmail');
            const otpInputs = document.querySelectorAll('#otpInputGroup .otp-input');
            const otp = Array.from(otpInputs).map(input => input.value).join('');

            if (!otpEmail.value.trim() || !isValidEmail(otpEmail.value)) {
                showError(otpEmail, 'Please enter a valid email');
                isValid = false;
            }

            if (otp.length !== 6) {
                showToast('Please enter a valid 6-digit code', 'error');
                isValid = false;
            }

            if (isValid) {
                try {
                    const submitBtn = loginForm.querySelector('.auth-submit');
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;

                    await new Promise(resolve => setTimeout(resolve, 1500));
                    window.location.href = 'dashboard.html';
                } catch (error) {
                    showToast('Invalid OTP. Please try again.', 'error');
                } finally {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
            }
        }
    });
}

// Handle Signup Form
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const terms = document.getElementById('terms');

        // Clear previous errors
        removeError(name);
        removeError(email);
        removeError(password);

        // Validate name
        if (!name.value.trim()) {
            showError(name, 'Name is required');
            isValid = false;
        }

        // Validate email
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email');
            isValid = false;
        }

        // Validate password
        if (!password.value) {
            showError(password, 'Password is required');
            isValid = false;
        } else if (!isValidPassword(password.value)) {
            showError(password, 'Password must be at least 8 characters long');
            isValid = false;
        }

        // Validate terms
        if (!terms.checked) {
            showError(terms, 'You must accept the Terms of Service');
            isValid = false;
        }

        if (isValid) {
            try {
                // Show loading state
                const submitBtn = signupForm.querySelector('.auth-submit');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span>Creating account...</span>';
                submitBtn.disabled = true;

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Here you would typically make an API call to your backend
                console.log('Signup successful');
                
                // Redirect to dashboard (replace with your actual dashboard URL)
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Signup failed:', error);
                // Show error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'form-error';
                errorDiv.textContent = 'Signup failed. Please try again.';
                signupForm.insertBefore(errorDiv, signupForm.firstChild);
            }
        }
    });
}

// Social Authentication
const socialButtons = document.querySelectorAll('.social-btn');
socialButtons.forEach(button => {
    button.addEventListener('click', async () => {
        let provider;
        if (button.classList.contains('google')) provider = 'Google';
        else if (button.classList.contains('apple')) provider = 'Apple';
        else if (button.classList.contains('linkedin')) provider = 'LinkedIn';
        
        try {
            // Show loading state
            const originalText = button.innerHTML;
            button.innerHTML = `<span>Connecting to ${provider}...</span>`;
            button.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Here you would typically handle OAuth flow
            console.log(`${provider} auth successful`);
            
            // Save last login time
            localStorage.setItem('lastLogin', new Date().toISOString());
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error(`${provider} auth failed:`, error);
            button.innerHTML = originalText;
            button.disabled = false;
            showToast(`${provider} authentication failed`, 'error');
        }
    });
});

// Login Tabs
const loginTabs = document.querySelectorAll('.login-tab');
const loginSections = document.querySelectorAll('.login-section');

loginTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        loginTabs.forEach(t => t.classList.remove('active'));
        loginSections.forEach(s => s.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(`${targetTab}Login`).classList.add('active');
    });
});

// Password Visibility Toggle
const togglePassword = document.querySelector('.toggle-password');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.classList.toggle('show');
});

// Password Strength Meter
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-text');

function checkPasswordStrength(password) {
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };

    const strength = Object.values(checks).filter(Boolean).length;
    const strengthLevels = {
        0: { width: '0%', text: 'Not entered', color: 'var(--text-secondary)' },
        1: { width: '20%', text: 'Very weak', color: '#ef4444' },
        2: { width: '40%', text: 'Weak', color: '#f97316' },
        3: { width: '60%', text: 'Medium', color: '#eab308' },
        4: { width: '80%', text: 'Strong', color: '#22c55e' },
        5: { width: '100%', text: 'Very strong', color: '#15803d' }
    };

    const requirements = [
        { text: 'At least 8 characters', met: checks.length },
        { text: 'Contains lowercase letter', met: checks.lowercase },
        { text: 'Contains uppercase letter', met: checks.uppercase },
        { text: 'Contains number', met: checks.numbers },
        { text: 'Contains special character', met: checks.special }
    ];

    return { level: strengthLevels[strength], requirements };
}

// Update password strength indicator
document.getElementById('password')?.addEventListener('input', (e) => {
    const result = checkPasswordStrength(e.target.value);
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    if (strengthBar && strengthText) {
        strengthBar.style.width = result.level.width;
        strengthBar.style.background = result.level.color;
        strengthText.textContent = `Password strength: ${result.level.text}`;
        
        // Update requirements list if it exists
        const requirementsList = document.querySelector('.password-requirements');
        if (requirementsList) {
            requirementsList.innerHTML = result.requirements
                .map(req => `
                    <li class="${req.met ? 'met' : ''}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20 6L9 17l-5-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        ${req.text}
                    </li>
                `).join('');
        }
    }
});

// OTP Functionality
const sendOtpBtn = document.getElementById('sendOtpBtn');
const otpInputGroup = document.getElementById('otpInputGroup');
const otpInputs = document.querySelectorAll('.otp-input');
const otpTimer = document.getElementById('otpTimer');
let otpTimerInterval;

sendOtpBtn?.addEventListener('click', async () => {
    const email = document.getElementById('otpEmail').value;
    if (!email || !isValidEmail(email)) {
        showToast('Please enter a valid email', 'error');
        return;
    }

    try {
        sendOtpBtn.classList.add('loading');
        sendOtpBtn.disabled = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        otpInputGroup.classList.remove('hidden');
        startOtpTimer();
        showToast('OTP sent successfully!');
        
        // Focus first input
        otpInputs[0].focus();
    } catch (err) {
        showToast('Failed to send OTP', 'error');
    } finally {
        sendOtpBtn.classList.remove('loading');
        sendOtpBtn.disabled = false;
    }
});

function startOtpTimer(duration = 120) {
    let timeLeft = duration;
    clearInterval(otpTimerInterval);

    const updateTimer = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (otpTimer) {
            if (otpTimer.querySelector('span')) {
                otpTimer.querySelector('span').textContent = display;
            } else {
                otpTimer.textContent = `Resend OTP in ${display}`;
            }
        }

        if (timeLeft === 0) {
            clearInterval(otpTimerInterval);
            if (otpTimer) {
                otpTimer.innerHTML = '<button class="resend-otp">Resend OTP</button>';
                const resendBtn = otpTimer.querySelector('.resend-otp');
                if (resendBtn) {
                    resendBtn.addEventListener('click', () => {
                        sendOtpBtn.click();
                    });
                }
            }
        }
        timeLeft--;
    };

    updateTimer();
    otpTimerInterval = setInterval(updateTimer, 1000);
}

// Handle OTP input fields
otpInputs.forEach((input, index) => {
    input.addEventListener('keyup', (e) => {
        if (e.key >= '0' && e.key <= '9') {
            input.value = e.key;
            if (index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        } else if (e.key === 'Backspace') {
            input.value = '';
            if (index > 0) {
                otpInputs[index - 1].focus();
            }
        }
    });

    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text');
        const digits = paste.match(/\d/g);
        if (digits) {
            digits.forEach((digit, i) => {
                if (otpInputs[i]) {
                    otpInputs[i].value = digit;
                }
            });
            // Focus last filled input or next empty one
            const lastFilledIndex = digits.length - 1;
            if (otpInputs[lastFilledIndex + 1]) {
                otpInputs[lastFilledIndex + 1].focus();
            } else {
                otpInputs[lastFilledIndex].focus();
            }
        }
    });

    // Select all on focus
    input.addEventListener('focus', () => {
        input.select();
    });
});

// Verify OTP Page Functions
document.addEventListener('DOMContentLoaded', () => {
    const otpContainer = document.querySelector('.otp-container');
    const backupForm = document.querySelector('.backup-code-form');
    const timerElement = document.getElementById('timer');
    let timerInterval;
    
    // Start timer when page loads
    if (timerElement) {
        startTimer();
    }
    
    function startTimer() {
        let timeLeft = 30;
        timerElement.textContent = timeLeft;
        
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                document.querySelector('.verify-otp-btn').disabled = true;
                showToast('Code expired. Please request a new one.', 'error');
            }
        }, 1000);
    }
    
    // Handle OTP verification
    document.querySelector('.verify-otp-btn')?.addEventListener('click', async () => {
        const button = document.querySelector('.verify-otp-btn');
        const inputs = document.querySelectorAll('.otp-input');
        const code = Array.from(inputs).map(input => input.value).join('');
        
        if (code.length !== 6) {
            showToast('Please enter all 6 digits', 'error');
            return;
        }
        
        try {
            button.classList.add('loading');
            button.disabled = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            showToast('Verification successful!');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (err) {
            showToast('Invalid code. Please try again.', 'error');
            inputs.forEach(input => input.value = '');
            inputs[0].focus();
        } finally {
            button.classList.remove('loading');
            button.disabled = false;
        }
    });
    
    // Handle backup code verification
    document.querySelector('.verify-backup-btn')?.addEventListener('click', async () => {
        const button = document.querySelector('.verify-backup-btn');
        const input = document.getElementById('backupCode');
        const code = input.value.trim();
        
        if (!code) {
            showToast('Please enter a backup code', 'error');
            return;
        }
        
        if (!code.match(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i)) {
            showToast('Invalid backup code format', 'error');
            return;
        }
        
        try {
            button.classList.add('loading');
            button.disabled = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            showToast('Verification successful!');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (err) {
            showToast('Invalid backup code', 'error');
            input.value = '';
            input.focus();
        } finally {
            button.classList.remove('loading');
            button.disabled = false;
        }
    });
    
    // Handle resend code
    document.getElementById('resendCode')?.addEventListener('click', async () => {
        const button = document.getElementById('resendCode');
        
        try {
            button.disabled = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Reset inputs
            document.querySelectorAll('.otp-input').forEach(input => input.value = '');
            document.querySelector('.otp-input').focus();
            
            // Reset timer
            startTimer();
            
            // Enable verify button if it was disabled
            document.querySelector('.verify-otp-btn').disabled = false;
            
            showToast('New code sent!');
        } catch (err) {
            showToast('Failed to send new code', 'error');
        } finally {
            // Re-enable after 30 seconds
            setTimeout(() => {
                button.disabled = false;
            }, 30000);
        }
    });
    
    // Toggle between OTP and backup code forms
    document.getElementById('useBackupCode')?.addEventListener('click', () => {
        otpContainer.style.display = 'none';
        backupForm.style.display = 'block';
    });
    
    document.getElementById('backToOTP')?.addEventListener('click', () => {
        backupForm.style.display = 'none';
        otpContainer.style.display = 'block';
    });
    
    // Format backup code input
    document.getElementById('backupCode')?.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
        
        if (value.length > 12) {
            value = value.slice(0, 12);
        }
        
        if (value.length > 8) {
            value = value.slice(0, 8) + '-' + value.slice(8);
        }
        
        if (value.length > 4) {
            value = value.slice(0, 4) + '-' + value.slice(4);
        }
        
        e.target.value = value;
    });
});

// Biometric Authentication
const biometricBtn = document.getElementById('biometricBtn');

async function checkBiometricAvailability() {
    if (!window.PublicKeyCredential) {
        document.getElementById('biometricTab').style.display = 'none';
        return;
    }

    try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (!available) {
            document.getElementById('biometricTab').style.display = 'none';
        }
    } catch (error) {
        document.getElementById('biometricTab').style.display = 'none';
    }
}

checkBiometricAvailability();

biometricBtn.addEventListener('click', async () => {
    try {
        biometricBtn.classList.add('loading');
        // Simulate biometric authentication
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Handle successful authentication
        window.location.href = 'dashboard.html';
    } catch (error) {
        showError('Biometric authentication failed. Please try again.');
    } finally {
        biometricBtn.classList.remove('loading');
    }
});

// Login Form Submission
const maxLoginAttempts = 3;
let loginAttempts = parseInt(localStorage.getItem('loginAttempts') || '0');
let lockoutEndTime = localStorage.getItem('lockoutEndTime');

function checkLockout() {
    if (lockoutEndTime && new Date().getTime() < parseInt(lockoutEndTime)) {
        showLockoutMessage();
        return true;
    }
    if (lockoutEndTime) {
        clearLockout();
    }
    return false;
}

function showLockoutMessage() {
    const timeLeft = Math.ceil((parseInt(lockoutEndTime) - new Date().getTime()) / 1000 / 60);
    const lockoutDiv = document.createElement('div');
    lockoutDiv.className = 'account-lockout';
    lockoutDiv.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 15v2m0 0v2m0-2h2m-2 0H9" stroke-width="2" stroke-linecap="round"/>
            <path d="M5 13a7 7 0 1114 0v3a4 4 0 01-4 4H9a4 4 0 01-4-4v-3z" stroke-width="2"/>
        </svg>
        <div>
            <p class="lockout-message">Account temporarily locked</p>
            <p class="lockout-timer">Try again in ${timeLeft} minutes</p>
        </div>
    `;
    loginForm.insertBefore(lockoutDiv, loginForm.firstChild);
}

function clearLockout() {
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockoutEndTime');
    loginAttempts = 0;
    const lockoutDiv = document.querySelector('.account-lockout');
    if (lockoutDiv) lockoutDiv.remove();
}

function handleFailedLogin() {
    loginAttempts++;
    localStorage.setItem('loginAttempts', loginAttempts);

    if (loginAttempts >= maxLoginAttempts) {
        const lockoutDuration = 15 * 60 * 1000; // 15 minutes
        lockoutEndTime = new Date().getTime() + lockoutDuration;
        localStorage.setItem('lockoutEndTime', lockoutEndTime);
        showLockoutMessage();
    }
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (checkLockout()) return;

    const activeSection = document.querySelector('.login-section.active');
    const submitBtn = document.querySelector('.auth-submit');
    
    try {
        submitBtn.classList.add('loading');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo purposes, always succeed with password "demo123"
        if (activeSection.id === 'passwordLogin' && passwordInput.value !== 'demo123') {
            throw new Error('Invalid credentials');
        }
        
        // Save last login time
        localStorage.setItem('lastLogin', new Date().toISOString());
        
        // Handle "Remember this device"
        if (document.getElementById('rememberDevice').checked) {
            localStorage.setItem('rememberedDevice', 'true');
        }
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        handleFailedLogin();
        showError(error.message);
    } finally {
        submitBtn.classList.remove('loading');
    }
});

// Show Last Login
const lastLoginInfo = document.getElementById('lastLoginInfo');
const lastLogin = localStorage.getItem('lastLogin');

if (lastLoginInfo && lastLogin) {
    const lastLoginDate = new Date(lastLogin);
    const timeAgo = getTimeAgo(lastLoginDate);
    lastLoginInfo.querySelector('span').textContent = `Last login: ${timeAgo}`;
    lastLoginInfo.style.display = 'flex';
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }
    
    return 'Just now';
}

// Error Handling
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const activeSection = document.querySelector('.login-section.active');
    const existingError = activeSection.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    activeSection.appendChild(errorDiv);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkLockout();
    
    // Check if device is remembered
    if (localStorage.getItem('rememberedDevice')) {
        document.getElementById('rememberDevice').checked = true;
    }
});

// 2FA Setup Page Functions
function showStep(stepId) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show the requested step
    document.getElementById(stepId).classList.add('active');
}

// Copy backup key
document.querySelector('.copy-key')?.addEventListener('click', async () => {
    const key = document.querySelector('.key-display code').textContent;
    try {
        await navigator.clipboard.writeText(key);
        showToast('Key copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy key', 'error');
    }
});

// Download backup codes
document.querySelector('.download-codes')?.addEventListener('click', () => {
    const codes = Array.from(document.querySelectorAll('.backup-codes code'))
        .map(code => code.textContent)
        .join('\n');
    
    const blob = new Blob([codes], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '2fa-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    showToast('Backup codes downloaded!');
});

// Print backup codes
document.querySelector('.print-codes')?.addEventListener('click', () => {
    const printWindow = window.open('', '', 'width=600,height=600');
    const codes = Array.from(document.querySelectorAll('.backup-codes code'))
        .map(code => code.textContent)
        .join('\n');
    
    printWindow.document.write(`
        <html>
            <head>
                <title>2FA Backup Codes</title>
                <style>
                    body {
                        font-family: monospace;
                        padding: 2rem;
                        line-height: 2;
                    }
                    h1 {
                        margin-bottom: 2rem;
                    }
                    .warning {
                        color: #d32f2f;
                        margin-bottom: 2rem;
                    }
                </style>
            </head>
            <body>
                <h1>2FA Backup Codes</h1>
                <p class="warning">Keep these codes safe and secure. Each code can only be used once.</p>
                <pre>${codes}</pre>
            </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
});

// Refresh QR Code
document.querySelector('.refresh-qr')?.addEventListener('click', async () => {
    const qrCode = document.querySelector('.qr-code');
    const keyDisplay = document.querySelector('.key-display code');
    
    // Show loading state
    qrCode.style.opacity = '0.5';
    
    try {
        // In a real app, this would make an API call to generate new secrets
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update QR code and secret key
        // This is just a simulation - in a real app, these would come from the server
        const timestamp = new Date().getTime();
        qrCode.src = `assets/images/sample-qr.png?t=${timestamp}`;
        keyDisplay.textContent = generateRandomKey();
        
        showToast('QR code refreshed!');
    } catch (err) {
        showToast('Failed to refresh QR code', 'error');
    } finally {
        qrCode.style.opacity = '1';
    }
});

// Helper function to generate a random key (for demo purposes)
function generateRandomKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let key = '';
    for (let i = 0; i < 16; i++) {
        key += chars[Math.floor(Math.random() * chars.length)];
        if (i % 4 === 3 && i < 15) key += '-';
    }
    return key;
}

// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Trigger reflow to enable animation
    toast.offsetHeight;
    
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Add toast styles if not already present
if (!document.querySelector('#toastStyles')) {
    const style = document.createElement('style');
    style.id = 'toastStyles';
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            background: var(--bg-secondary);
            color: var(--text-primary);
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .toast.success {
            background: var(--success-color);
            color: white;
        }
        
        .toast.error {
            background: var(--error-color);
            color: white;
        }
    `;
    document.head.appendChild(style);
} 