// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Initialize theme from localStorage
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        html.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    } else {
        html.classList.remove('dark-mode');
        themeToggle.textContent = '🌙';
    }
}

// Toggle theme
function toggleTheme() {
    const isDark = html.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', toggleTheme);

// Initialize theme on page load
initTheme();

// Generate Plan Function
async function generatePlan() {
    const destination = document.getElementById('destination').value.trim();
    const duration = document.getElementById('duration').value.trim();
    const budget = document.getElementById('budget').value;
    const interests = document.getElementById('interests').value.trim();
    const planBtn = document.getElementById('planBtn');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const weatherCard = document.getElementById('weatherCard');
    const itineraryOutput = document.getElementById('itineraryOutput');

    if (!destination || !duration || !budget || !interests) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    planBtn.disabled = true;
    const originalText = planBtn.innerHTML;
    planBtn.innerHTML = '<span class="button-text">Planning...</span><span class="button-icon">⏳</span>';
    loading.style.display = 'block';
    results.style.display = 'none';

    try {
        const response = await fetch('/api/plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ destination, duration, budget, interests })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        loading.style.display = 'none';
        
        // Store data in sessionStorage for itinerary page
        const travelData = {
            destination: destination,
            duration: duration,
            budget: budget,
            interests: interests,
            weather: data.weather,
            itinerary: data.itinerary
        };
        
        sessionStorage.setItem('travelData', JSON.stringify(travelData));
        
        // Navigate to itinerary dashboard
        window.location.href = '/itinerary.html';
        
    } catch (error) {
        console.error('Error:', error);
        loading.style.display = 'none';
        showNotification('Failed to generate travel plan. Please try again.', 'error');
    } finally {
        planBtn.disabled = false;
        planBtn.innerHTML = originalText;
    }
}

// Export to PDF
function exportPDF() {
    const destination = document.getElementById('destination').value.trim();
    const itineraryText = document.getElementById('itineraryOutput').innerText.trim();

    if (!itineraryText) {
        showNotification('No itinerary to export', 'error');
        return;
    }

    try {
        const doc = new window.jspdf.jsPDF();
        const title = destination ? `${destination} Travel Itinerary` : 'Travel Itinerary';

        // Add title
        doc.setFontSize(18);
        doc.setTextColor(51, 102, 255);
        doc.text(title, 15, 15);

        // Add metadata
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 25);

        // Add content
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        const lines = doc.splitTextToSize(itineraryText, 180);
        doc.text(lines, 15, 35);

        doc.save('travel-itinerary.pdf');
        showNotification('PDF exported successfully!', 'success');
    } catch (error) {
        console.error('PDF export error:', error);
        showNotification('Failed to export PDF', 'error');
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3366ff'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Allow Enter key to submit form
document.getElementById('travelForm').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        generatePlan();
    }
});


