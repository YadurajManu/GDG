// Initialize AOS with enhanced settings
document.addEventListener('DOMContentLoaded', function() {
    //nitialize AOS
    AOS.init({
        duration: 800,
        once: false,
        offset: 100,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        mirror: true
    });

    // Scroll Progress Indicator
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight);
        scrollProgress.style.transform = `scaleX(${scrolled})`;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ROI Calculator
    const monthlyInvestment = document.getElementById('monthlyInvestment');
    const timePeriod = document.getElementById('timePeriod');
    const yearDisplay = document.getElementById('yearDisplay');
    const totalInvestment = document.getElementById('totalInvestment');
    const expectedReturns = document.getElementById('expectedReturns');

    function calculateReturns() {
        const principal = parseFloat(monthlyInvestment.value);
        const years = parseInt(timePeriod.value);
        const rateOfReturn = 0.12; // 12% annual returns

        // Calculate total investment
        const totalInvested = principal * 12 * years;
        
        // Calculate returns using compound interest formula for monthly SIP
        const monthlyRate = rateOfReturn / 12;
        const months = years * 12;
        const futureValue = principal * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);

        // Update display
        totalInvestment.textContent = `₹${Math.round(totalInvested).toLocaleString('en-IN')}`;
        expectedReturns.textContent = `₹${Math.round(futureValue).toLocaleString('en-IN')}`;
        yearDisplay.textContent = `${years} Years`;
    }

    // Add event listeners
    monthlyInvestment.addEventListener('input', calculateReturns);
    timePeriod.addEventListener('input', calculateReturns);

    // Initial calculation
    calculateReturns();

    // Add number formatting to investment input
    monthlyInvestment.addEventListener('blur', function() {
        const value = parseFloat(this.value);
        if (!isNaN(value)) {
            this.value = Math.max(500, Math.round(value / 500) * 500);
        } else {
            this.value = 500;
        }
        calculateReturns();
    });

    // Animate stats when they come into view
    const stats = document.querySelectorAll('.stat-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        stat.style.transform = 'translateY(20px)';
        stat.style.opacity = '0';
        stat.style.transition = 'all 0.6s ease';
        observer.observe(stat);
    });
});

// Chat functionality
const chatMessages = document.querySelector('.chat-messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Sample responses with emojis
const responses = {
    en: {
        'how to invest': '📈 Start with a SIP (Systematic Investment Plan) of ₹500 in a low-risk mutual fund. I can help you choose one!',
        'what is sip': '💡 SIP (Systematic Investment Plan) lets you invest a fixed amount regularly in mutual funds. It\'s like a recurring deposit but with better returns!',
        'tax saving': '💰 You can save tax under Section 80C by investing in ELSS funds up to ₹1.5L per year. Want to know more?',
        'how to start': '🚀 Let\'s begin your investment journey! First, tell me your monthly savings capacity and risk appetite.',
        default: '🤔 I can help you with investing, SIPs, or tax saving. What would you like to know?'
    },
    hi: {
        'how to invest': '📈 कम जोखिम वाले म्यूचुअल फंड में ₹500 का SIP शुरू करें। मैं आपको चुनने में मदद कर सकता हूं!',
        'what is sip': '💡 SIP से आप म्यूचुअल फंड में नियमित रूप से एक निश्चित राशि निवेश कर सकते हैं।',
        'tax saving': '💰 ELSS फंड में प्रति वर्ष ₹1.5L तक निवेश करके धारा 80C के तहत टैक्स बचा सकते हैं।',
        'how to start': '🚀 चलिए निवेश शुरू करते हैं! पहले मुझे बताएं आप कितना निवेश कर सकते हैं।',
        default: '🤔 मैं आपकी निवेश, SIP, या टैक्स बचत में मदद कर सकता हूं। क्या जानना चाहेंगे?'
    }
};

// Current language
let currentLang = localStorage.getItem('language') || 'en';

// Add a message to the chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = 'Just now';

    if (!isUser) {
        // Add typing indicator first
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai typing';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // After a delay, remove typing indicator and show message
        setTimeout(() => {
            typingDiv.remove();
            contentDiv.textContent = text;
            messageDiv.appendChild(contentDiv);
            messageDiv.appendChild(timeDiv);
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1500);
    } else {
        contentDiv.textContent = text;
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Handle send button click
function handleSend() {
    const text = userInput.value.trim().toLowerCase();
    if (text) {
        addMessage(text, true);
        const response = responses[currentLang][text] || responses[currentLang].default;
        setTimeout(() => addMessage(response), 500);
        userInput.value = '';
    }
}

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSend();
    }
});

// Focus input when clicking anywhere on the chat widget
document.querySelector('.chat-widget').addEventListener('click', () => {
    userInput.focus();
});

// Add input animations
userInput.addEventListener('focus', () => {
    document.querySelector('.input-wrapper').classList.add('focused');
});

userInput.addEventListener('blur', () => {
    document.querySelector('.input-wrapper').classList.remove('focused');
});

// Language toggle
const langToggle = document.getElementById('langToggle');
langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    localStorage.setItem('language', currentLang);
    
    // Update UI elements based on language
    if (currentLang === 'hi') {
        document.querySelector('.hero-title').textContent = 'हिंदी, तमिल या अंग्रेजी में स्मार्ट निवेश करें। ₹500/माह से शुरू करें!';
        document.querySelector('.hero-subtitle').textContent = 'भारत के लिए SEBI-अनुपालन AI मार्गदर्शन। कोई जटिल शब्द नहीं, कोई घोटाला नहीं।';
        document.querySelector('.cta-button').textContent = 'मुफ्त डेमो देखें →';
    } else {
        document.querySelector('.hero-title').textContent = 'Invest Smart in Hindi, Tamil, or English. Start with ₹500/month!';
        document.querySelector('.hero-subtitle').textContent = 'SEBI-compliant AI guidance for Bharat. No jargon, no scams.';
        document.querySelector('.cta-button').textContent = 'Try Free Demo →';
    }
});

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or use system preference
const currentTheme = localStorage.getItem('theme') || 
    (prefersDarkScheme.matches ? 'dark' : 'light');

// Set initial theme
document.body.dataset.theme = currentTheme;

// Theme toggle handler
themeToggle.addEventListener('click', () => {
    const newTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    document.body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    
    // Add theme change animation
    document.body.style.animation = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.animation = null;
});

// Listen for system theme changes
prefersDarkScheme.addListener((e) => {
    if (!localStorage.getItem('theme')) {
        document.body.dataset.theme = e.matches ? 'dark' : 'light';
    }
}); 