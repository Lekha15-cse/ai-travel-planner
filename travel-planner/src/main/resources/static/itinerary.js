// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

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
    
    // Update chart colors if it exists
    if (window.budgetChartInstance) {
        window.budgetChartInstance.options.plugins.legend.labels.color = isDark ? '#B8B0A6' : '#5C5248';
        window.budgetChartInstance.update();
    }
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
    } else {
        showNotification('No itinerary data found. Redirecting...', 'error');
        setTimeout(() => window.location.href = '/', 2000);
    }
}

// Render Dashboard
function renderDashboard() {
    document.getElementById('summaryDestination').textContent = travelData.destination || '-';
    document.getElementById('summaryDuration').textContent = travelData.duration || '-';
    document.getElementById('summaryBudget').textContent = travelData.budget || '-';
    document.getElementById('summaryInterests').textContent = travelData.interests || '-';

    renderSnapshotCard();
    
    // Configure Marked.js options
    if (window.marked) {
        marked.setOptions({
            breaks: true,
            gfm: true
        });
    }

    renderItineraryAccordion();
    parseAndRenderCards();
    renderBudgetRecommendation();
    renderBudgetChart();
}

function renderSnapshotCard() {
    const locEl = document.getElementById('snapshotLocation');
    const weatherEl = document.getElementById('snapshotWeather');
    const styleEl = document.getElementById('snapshotStyle');
    const seasonEl = document.getElementById('snapshotSeason');
    const crowdEl = document.getElementById('snapshotCrowd');

    const dest = travelData.destination.split('(')[0].trim() || 'Unknown';
    if(locEl) locEl.textContent = dest;
    if(weatherEl) weatherEl.textContent = travelData.weather || 'Sunny, 24°C';
    
    // Derived values
    let style = 'Mixed';
    if(travelData.interests) {
        style = travelData.interests.split(',').slice(0, 2).join(' & ');
    }
    if(styleEl) styleEl.textContent = style;
    
    if(seasonEl) seasonEl.textContent = 'Peak Season'; // Mock AI derivation
    if(crowdEl) crowdEl.textContent = 'Moderate'; // Mock AI derivation
}

// Map link generator
function generateMapsLink(text) {
    const query = encodeURIComponent(`${text} ${travelData.destination.split('(')[0].trim()}`);
    return `<a href="https://www.google.com/maps/search/?api=1&query=${query}" target="_blank" class="maps-btn">📍 View on Maps</a>`;
}

// Process markdown to add map links and timeline structure
function enhanceMarkdown(text) {
    if (!text) return '';
    
    // Look for bold text that might be a place, and append a maps link
    let enhanced = text.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
        const lower = p1.toLowerCase();
        if (lower.includes('morning') || lower.includes('afternoon') || lower.includes('evening') || lower.includes('day') || lower.includes('cost') || lower.includes('budget') || lower.includes('time')) {
            return `**${p1}**`;
        }
        return `**${p1}** ${generateMapsLink(p1)}`;
    });

    // Replace typical time patterns with an icon for better presentation
    enhanced = enhanced.replace(/(Morning|Afternoon|Evening|Night):/ig, "🕒 **$1:**");
    
    return enhanced;
}

function renderItineraryAccordion() {
    const container = document.getElementById('itineraryContent');
    const itinerary = travelData.itinerary || '';
    
    // Attempt to split by Day
    const dayRegex = /(?=^(?:### |## |\*\*|)Day \d+)/im;
    let parts = itinerary.split(dayRegex);
    
    // If splitting failed to find days, fallback to standard markdown rendering
    if (parts.length <= 1) {
        container.innerHTML = window.marked ? marked.parse(enhanceMarkdown(itinerary)) : itinerary;
        container.classList.remove('itinerary-accordion');
        container.classList.add('itinerary-content');
        return;
    }

    let html = '';
    
    // First part might be intro text
    if (parts[0] && !parts[0].toLowerCase().includes('day 1')) {
        html += `<div class="intro-text">${window.marked ? marked.parse(parts[0]) : parts[0]}</div>`;
        parts.shift();
    }

    parts.forEach((part, index) => {
        if (!part.trim()) return;
        
        // Extract title (first line)
        const lines = part.split('\n');
        let title = lines[0].replace(/[#*]/g, '').trim();
        if (!title) title = `Day ${index + 1}`;
        
        const content = lines.slice(1).join('\n').trim();
        const enhancedContent = enhanceMarkdown(content);
        const parsedContent = window.marked ? marked.parse(enhancedContent) : enhancedContent;

        // Wrap the parsed content inside a timeline container layout
        const timelineHtml = `
            <div class="timeline-container">
                <div class="timeline-item">
                    <div class="timeline-content">
                        ${parsedContent}
                    </div>
                </div>
            </div>
        `;

        html += `
            <div class="accordion-item">
                <div class="accordion-header" onclick="this.parentElement.classList.toggle('open')">
                    <span class="accordion-title">${title}</span>
                    <span class="accordion-icon">▼</span>
                </div>
                <div class="accordion-content itinerary-content">
                    ${timelineHtml}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function parseAndRenderCards() {
    const itinerary = travelData.itinerary || '';
    const fallbackText = 'Information not explicitly detailed. See main itinerary.';

    const sections = [
        { id: 'hiddenGemsContent', regex: /(?:Hidden Gems|Off the Beaten Path|Secrets)[\s\S]*?(?=(?:###|##|Day \d+|$))/i },
        { id: 'foodContent', regex: /(?:Local Food|Dining|Where to Eat|Cuisine|Food Guide)[\s\S]*?(?=(?:###|##|Day \d+|$))/i },
        { id: 'accommodationContent', regex: /(?:Accommodation|Hotel|Stay|Where to Stay|Lodging)[\s\S]*?(?=(?:###|##|Day \d+|$))/i },
        { id: 'transportationContent', regex: /(?:Transportation|Getting Around|Transport|Travel Tips)[\s\S]*?(?=(?:###|##|Day \d+|$))/i },
        { id: 'packingContent', regex: /(?:Packing|What to Bring|Checklist|Essentials)[\s\S]*?(?=(?:###|##|Day \d+|$))/i },
        { id: 'emergencyContent', regex: /(?:Emergency|Safety|Important Info|Warnings)[\s\S]*?(?=(?:###|##|Day \d+|$))/i }
    ];

    sections.forEach(sec => {
        const match = itinerary.match(sec.regex);
        let text = match ? match[0] : fallbackText;
        
        // Remove the section header from the extracted text so it doesn't duplicate the card title
        const lines = text.split('\n');
        if (lines.length > 0 && lines[0].match(/^(#|\*)/)) {
            lines.shift();
            text = lines.join('\n').trim();
        }

        const el = document.getElementById(sec.id);
        if (el) {
            el.innerHTML = window.marked ? marked.parse(enhanceMarkdown(text)) : text;
        }
    });
}

function renderBudgetRecommendation() {
    const budgetStr = travelData.budget || '';
    const budgetVal = parseInt(budgetStr.replace(/[^0-9]/g, '')) || 25000;
    
    // Mock calculations for AI heuristic
    const estimatedCost = Math.floor(budgetVal * 1.15); // Assume typical trip is 15% more
    const recommendedBudget = Math.floor(estimatedCost * 1.1); // Add a 10% buffer
    
    const entEl = document.getElementById('recEnteredBudget');
    const estEl = document.getElementById('recEstimatedCost');
    const recEl = document.getElementById('recRecommendedBudget');
    const comfEl = document.getElementById('recComfortRating');
    const barEl = document.getElementById('budgetProgressBar');

    if(entEl) entEl.textContent = `₹${budgetVal.toLocaleString()}`;
    if(estEl) estEl.textContent = `₹${estimatedCost.toLocaleString()}`;
    if(recEl) recEl.textContent = `₹${recommendedBudget.toLocaleString()}`;
    
    let comfort = 'Comfortable';
    let comfortClass = 'comfort-comfortable';
    let progress = 75; // percent

    if(budgetVal < estimatedCost) {
        comfort = 'Tight';
        comfortClass = 'comfort-tight';
        progress = 100;
    } else if (budgetVal > recommendedBudget * 1.2) {
        comfort = 'Luxurious';
        comfortClass = 'comfort-luxurious';
        progress = 40;
    }

    if(comfEl) {
        comfEl.textContent = comfort;
        comfEl.className = `comfort-badge ${comfortClass}`;
    }
    
    if(barEl) {
        setTimeout(() => {
            barEl.style.width = `${progress}%`;
            if(progress > 90) barEl.style.background = '#ef4444'; // turn red if tight
        }, 300);
    }
}

function renderBudgetChart() {
    const ctx = document.getElementById('budgetChart');
    if (!ctx) return;

    // Data based on mock analysis
    let data = [40, 30, 20, 10]; 

    const isDark = document.documentElement.classList.contains('dark-mode');
    const textColor = isDark ? '#B8B0A6' : '#5C5248';

    window.budgetChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Accommodation', 'Food & Dining', 'Activities', 'Transport'],
            datasets: [{
                data: data,
                backgroundColor: [
                    '#2A7A6A', // teal
                    '#E07A3A', // amber
                    '#1E4035', // forest
                    '#FDF0E6'  // amber-mist
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: textColor, font: { family: "'DM Sans', sans-serif" } }
                }
            },
            cutout: '70%'
        }
    });
}

// Export to Professional PDF
function exportToPdf() {
    const destination = travelData.destination.split('(')[0].trim();
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
        const margin = 20;
        let yPosition = margin;

        // Document Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(224, 122, 58); // Amber
        doc.text(title, margin, yPosition);
        yPosition += 12;

        // Metadata
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(92, 82, 72); // Slate
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
        doc.text(`Duration: ${travelData.duration} | Budget: ${travelData.budget}`, margin, yPosition + 6);
        
        // Line separator
        yPosition += 12;
        doc.setDrawColor(221, 213, 200); // Stroke
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 15;

        // Content Parsing
        let rawLines = travelData.itinerary.split('\n');
        
        for (let i = 0; i < rawLines.length; i++) {
            let line = rawLines[i].trim();
            if (!line) continue;
            
            // Page break handling
            if (yPosition > pageHeight - margin - 15) {
                // Add Footer to current page before breaking
                doc.setFontSize(9);
                doc.setTextColor(158, 149, 140);
                doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber} - AI Travel Planner`, pageWidth / 2, pageHeight - 10, { align: 'center' });
                
                doc.addPage();
                yPosition = margin;
            }
            
            // Heading formatting (e.g. ### Day 1)
            let isBoldLine = false;
            if (line.match(/^###? /)) {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(14);
                doc.setTextColor(30, 64, 53); // Forest
                line = line.replace(/^###? /, '');
                yPosition += 6;
                isBoldLine = true;
            } 
            // Bold line formatting (e.g. **Morning:**)
            else if (line.match(/^\*\*.*\*\*$/)) {
                 doc.setFont('helvetica', 'bold');
                 doc.setFontSize(11);
                 doc.setTextColor(26, 20, 16); 
                 line = line.replace(/\*\*/g, '');
                 isBoldLine = true;
            } 
            // Standard body text formatting
            else {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(11);
                doc.setTextColor(50, 50, 50); 
                line = line.replace(/\*\*(.*?)\*\*/g, '$1'); // strip inline bold markdown
                line = line.replace(/\*(.*?)\*/g, '$1'); // strip italic markdown
                line = line.replace(/- /g, '• '); // convert list dashes to nice bullets
            }
            
            // Wrap text
            const wrappedLines = doc.splitTextToSize(line, pageWidth - 2 * margin);
            doc.text(wrappedLines, margin, yPosition);
            yPosition += (wrappedLines.length * 6) + (isBoldLine ? 4 : 2);
        }

        // Add Footer to final page
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(158, 149, 140);
            doc.text(`Page ${i} of ${pageCount} - AI Travel Planner`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }

        doc.save(`${destination.replace(/\s+/g, '-')}-Professional-Itinerary.pdf`);
        showNotification('Professional Report exported successfully!', 'success');
    } catch (error) {
        console.error('PDF export error:', error);
        showNotification('Failed to export PDF', 'error');
    }
}

document.getElementById('exportPdfBtn').addEventListener('click', exportToPdf);

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#1E4035' : type === 'error' ? '#ef4444' : '#2A7A6A'};
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

window.addEventListener('load', initDashboard);
