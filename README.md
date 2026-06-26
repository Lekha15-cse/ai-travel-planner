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
4. Add your key to `application.properties`:
