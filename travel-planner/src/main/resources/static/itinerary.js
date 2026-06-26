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

function toggleTheme() {
    const isDark = html.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', toggleTheme);
initTheme();

// Data Storage
let travelData = {
    destination: '',
    duration: '',
    budget: '',
    interests: '',
    weather: '',
    itinerary: ''
};

// Initialize Dashboard
function initDashboard() {
    const data = sessionStorage.getItem('travelData');
    if (data) {
        travelData = JSON.parse(data);
        renderDashboard();
        sessionStorage.removeItem('travelData'); // Clear after loading
    } else {
        // Fallback or redirect
        showNotification('No itinerary data found. Redirecting...', 'error');
        setTimeout(() => window.location.href = '/', 2000);
    }
}

// Render Dashboard
function renderDashboard() {
    // Populate summary cards
    document.getElementById('summaryDestination').textContent = travelData.destination || '-';
    document.getElementById('summaryDuration').textContent = travelData.duration || '-';
    document.getElementById('summaryBudget').textContent = travelData.budget || '-';
    document.getElementById('summaryInterests').textContent = travelData.interests || '-';

    // Render weather
    renderWeather();

    // Convert markdown to HTML and render
    renderItinerary();

    // Parse and render specialized cards
    parseAndRenderCards();
}

// Render Weather
function renderWeather() {
    const weatherDisplay = document.getElementById('weatherDisplay');
    const weather = travelData.weather || 'Weather data unavailable';
    
    weatherDisplay.innerHTML = `
        <div class="weather-content">
            <p class="weather-city">${travelData.destination}</p>
            <p class="weather-description">${weather}</p>
        </div>
    `;
}

// Markdown to HTML Converter
function markdownToHtml(markdown) {
    if (!markdown) return '';

    let html = markdown
        // Headers
        .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
        .replace(/^#### (.+)$/gm, '<h4 class="md-h4">$1</h4>')
        .replace(/^##### (.+)$/gm, '<h5 class="md-h5">$1</h5>')
        
        // Bold text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.+?)__/g, '<strong>$1</strong>')
        
        // Italic text
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/_(.+?)_/g, '<em>$1</em>')
        
        // Lists - bullet points
        .replace(/^\- (.+)$/gm, '<li>$1</li>')
        .replace(/^\* (.+)$/gm, '<li>$1</li>')
        
        // Wrap consecutive list items in <ul>
        .replace(/(<li>.*<\/li>)/s, '<ul class="md-list">$1</ul>')
        
        // Numbered lists
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        
        // Line breaks for paragraphs
        .split('\n\n')
        .map(para => {
            // Skip if it's already a formatted element
            if (para.trim().startsWith('<')) {
                return para;
            }
            // Wrap in paragraph if not empty
            if (para.trim()) {
                return `<p>${para.trim()}</p>`;
            }
            return '';
        })
        .join('\n');

    // Fix multiple ul tags
    html = html.replace(/<\/ul>\s*<ul class="md-list">/g, '');

    return html;
}

// Render Itinerary
function renderItinerary() {
    const itineraryContent = document.getElementById('itineraryContent');
    const html = markdownToHtml(travelData.itinerary);
    itineraryContent.innerHTML = html;
}

// Parse and Render Specialized Cards
function parseAndRenderCards() {
    const itinerary = travelData.itinerary || '';
    const fallbackText = 'See full itinerary above for details.';

    // Extract accommodation info
    const accommodationMatch = itinerary.match(/(?:Accommodation|Hotel|Stay|Lodging|Where to Stay)[\s\S]*?(?=(?:###|####|$))/i);
    const accommodation = accommodationMatch 
        ? accommodationMatch[0].split('\n').slice(1, 8).join('\n') 
        : fallbackText;
    document.getElementById('accommodationContent').innerHTML = markdownToHtml(accommodation);

    // Extract transportation info
    const transportationMatch = itinerary.match(/(?:Transportation|Transport|Getting Around|How to Get|Travel Tips)[\s\S]*?(?=(?:###|####|$))/i);
    const transportation = transportationMatch 
        ? transportationMatch[0].split('\n').slice(1, 8).join('\n') 
        : fallbackText;
    document.getElementById('transportationContent').innerHTML = markdownToHtml(transportation);

    // Extract budget info
    const budgetMatch = itinerary.match(/(?:Budget|Cost|Price|Expense|Allocation|Breakdown)[\s\S]*?(?=(?:###|####|$))/i);
    const budget = budgetMatch 
        ? budgetMatch[0].split('\n').slice(1, 8).join('\n') 
        : fallbackText;
    document.getElementById('budgetContent').innerHTML = markdownToHtml(budget);

    // Extract emergency info
    const emergencyMatch = itinerary.match(/(?:Emergency|Safety|Important|Tips|Warning)[\s\S]*?(?=(?:###|####|$))/i);
    const emergency = emergencyMatch 
        ? emergencyMatch[0].split('\n').slice(1, 8).join('\n') 
        : fallbackText;
    document.getElementById('emergencyContent').innerHTML = markdownToHtml(emergency);
}

// Export to PDF
function exportToPdf() {
    const destination = travelData.destination;
    const itinerary = travelData.itinerary;

    if (!itinerary) {
        showNotification('No itinerary to export', 'error');
        return;
    }

    try {
        const doc = new window.jspdf.jsPDF();
        const title = `${destination} Travel Itinerary`;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        let yPosition = margin;

        // Title
        doc.setFontSize(20);
        doc.setTextColor(51, 102, 255);
        doc.text(title, margin, yPosition);
        yPosition += 10;

        // Metadata
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
        doc.text(`Duration: ${travelData.duration} | Budget: ${travelData.budget}`, margin, yPosition + 5);
        yPosition += 15;

        // Content
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        
        // Plain text version (remove markdown)
        const plainText = travelData.itinerary
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/\*(.+?)\*/g, '$1')
            .replace(/^### (.+)$/gm, '$1')
            .replace(/^#### (.+)$/gm, '$1');

        const lines = doc.splitTextToSize(plainText, pageWidth - 2 * margin);
        
        for (let i = 0; i < lines.length; i++) {
            if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }
            doc.text(lines[i], margin, yPosition);
            yPosition += 5;
        }

        doc.save(`${destination}-itinerary.pdf`);
        showNotification('PDF exported successfully!', 'success');
    } catch (error) {
        console.error('PDF export error:', error);
        showNotification('Failed to export PDF', 'error');
    }
}

// Event Listeners
document.getElementById('exportPdfBtn').addEventListener('click', exportToPdf);

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

// Initialize on page load
window.addEventListener('load', initDashboard);
