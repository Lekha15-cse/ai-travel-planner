# ✈️ AI Travel Planner

An intelligent travel assistant that generates personalized end-to-end 
itineraries using LLaMA 3.3 70B (via Groq API), with real-time weather integration.

## Features
- 🤖 AI-generated day-by-day itineraries (LLaMA 3.3 70B)
- 🌤️ Real-time weather data for your destination
- 🏨 Accommodation & attraction suggestions
- 🍜 Local cuisine recommendations
- 💰 Budget breakdown by category
- 🆘 Emergency travel information
- 🌙 Dark / Light mode toggle
- 📄 Multi-page PDF export
- 📱 Responsive design

## Tech Stack
- **Backend:** Spring Boot 3.3.0 (Java 21)
- **AI/LLM:** LLaMA 3.3 70B via Groq API
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Weather:** wttr.in real-time API
- **PDF:** jsPDF

## Setup Instructions
1. Clone this repository
2. Copy `application.properties.example` to `application.properties`
3. Get a free Groq API key from https://console.groq.com
4. Add your key to `application.properties`: groq.api.key=YOUR_KEY_HERE
5. Run: `.\mvnw.cmd spring-boot:run` (Windows) or `./mvnw spring-boot:run` (Mac/Linux)
6. Open: `http://localhost:8081`

## Usage
Enter destination, duration, budget tier, and interests → Click **Generate Itinerary**

## Solution Approach
The Spring Boot backend engineers a structured prompt combining user inputs and 
sends it to LLaMA 3.3 70B via Groq's ultra-fast inference API. The AI response 
is parsed and passed to a two-page frontend dashboard alongside real-time weather 
data from wttr.in. The itinerary page renders markdown, extracts specialized info 
cards, and supports multi-page PDF export.

## Demo
[YouTube Demo Link - Coming Soon]
