<p align="center">
  <h1 align="center">✈️ AI Travel Planner</h1>
  <p align="center">
    <strong>An intelligent travel assistant that generates personalized end-to-end itineraries using LLaMA 3.3 70B (via Groq API), with real-time weather integration and professional PDF export.</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Java-21-orange?logo=openjdk" alt="Java 21">
    <img src="https://img.shields.io/badge/Spring%20Boot-3.3.0-brightgreen?logo=springboot" alt="Spring Boot">
    <img src="https://img.shields.io/badge/AI-LLaMA%203.3%2070B-blue?logo=meta" alt="LLaMA 3.3">
    <img src="https://img.shields.io/badge/Groq-Inference%20API-purple" alt="Groq API">
    <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License">
  </p>
</p>

---

## 📖 Project Description

**AI Travel Planner** solves the problem of overwhelming travel planning by combining the power of large language models with real-time data. Instead of spending hours researching destinations, comparing options, and building itineraries manually, users simply enter their destination, dates, budget, and interests — and the AI generates a complete, day-by-day travel plan in seconds.

The application uses **LLaMA 3.3 70B Versatile** (served via Groq's ultra-fast inference API) to produce detailed, structured itineraries that include accommodation suggestions, local food recommendations, activity planning, budget breakdowns, and emergency information. Real-time weather data from **wttr.in** enriches the output with current conditions at the destination.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Generated Itineraries** | Day-by-day plans with Morning, Afternoon, and Evening activities powered by LLaMA 3.3 70B |
| 🌤️ **Real-Time Weather** | Live weather data fetched from wttr.in for your destination |
| 📅 **Interactive Date Picker** | Select travel dates with automatic duration calculation |
| 💰 **Smart Budget Input** | Budget field with AI-powered heuristic warnings for unrealistic budgets |
| 🎯 **Interest Tag Chips** | Clickable interest tags (History, Food, Adventure, Nature, etc.) + custom interests |
| 👥 **Traveler Counter** | Adjustable traveler count that influences itinerary generation |
| 📊 **Budget Allocation Chart** | Doughnut chart showing recommended spending across Accommodation, Food, Activities, and Transport |
| 💡 **AI Budget Recommendation** | Comfort rating, estimated trip cost, and recommended budget with visual progress bar |
| 📍 **Google Maps Integration** | Clickable map links for every attraction mentioned in the itinerary |
| 🏨 **Accommodation Ideas** | AI-suggested lodging options based on budget tier |
| 🍳 **Local Food Guide** | Curated local cuisine and dining recommendations |
| 🚗 **Transportation Guide** | Local transport options and getting-around tips |
| 💎 **Hidden Gems** | Off-the-beaten-path suggestions extracted from the AI response |
| 🎒 **Packing Checklist** | Destination-aware packing suggestions |
| 🆘 **Emergency Information** | Safety guidelines and emergency contacts |
| 📄 **Multi-Page PDF Export** | Professional report with formatted headings, page numbers, and metadata |
| 🌙 **Dark / Light Mode** | Theme toggle with localStorage persistence |
| ✨ **Animated Loading** | Multi-step progress animation with rotating travel facts |
| 📱 **Responsive Design** | Fully responsive across desktop, tablet, and mobile |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Spring Boot 3.3.0 (Java 21) |
| **AI / LLM** | LLaMA 3.3 70B Versatile via [Groq API](https://console.groq.com) |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Weather API** | [wttr.in](https://wttr.in) (free, no API key required) |
| **Markdown Rendering** | [marked.js](https://marked.js.org) |
| **Charts** | [Chart.js](https://www.chartjs.org) |
| **PDF Export** | [jsPDF](https://github.com/parallax/jsPDF) |
| **Build Tool** | Maven (with Maven Wrapper) |

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        USER (Browser)                            │
│  ┌─────────────┐    ┌────────────────┐    ┌──────────────────┐  │
│  │ index.html  │───▶│   app.js       │───▶│ itinerary.html   │  │
│  │ (Landing +  │    │ (Form logic,   │    │ + itinerary.js   │  │
│  │  Input Form)│    │  API call)     │    │ (Dashboard,      │  │
│  │             │    │                │    │  Charts, PDF)    │  │
│  └─────────────┘    └───────┬────────┘    └──────────────────┘  │
│                             │ POST /api/plan                     │
└─────────────────────────────┼────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                   Spring Boot Backend (port 8081)                 │
│                                                                  │
│  ┌───────────────────────┐                                       │
│  │  TravelController     │                                       │
│  │  POST /api/plan       │                                       │
│  └───────┬───────┬───────┘                                       │
│          │       │                                               │
│          ▼       ▼                                               │
│  ┌──────────┐  ┌───────────────┐                                 │
│  │ GroqSvc  │  │ WeatherSvc    │                                 │
│  │ (LLaMA)  │  │ (wttr.in)     │                                 │
│  └────┬─────┘  └──────┬────────┘                                 │
│       │               │                                          │
└───────┼───────────────┼──────────────────────────────────────────┘
        │               │
        ▼               ▼
  ┌───────────┐   ┌───────────┐
  │ Groq API  │   │ wttr.in   │
  │ (LLaMA    │   │ Weather   │
  │  3.3 70B) │   │ API       │
  └───────────┘   └───────────┘
```

---

## 📁 Project Structure

```
ai-travel-planner/
├── .gitignore
├── README.md
└── travel-planner/
    ├── .gitignore
    ├── .mvn/wrapper/                      # Maven Wrapper config
    ├── mvnw                               # Maven Wrapper (Linux/Mac)
    ├── mvnw.cmd                           # Maven Wrapper (Windows)
    ├── pom.xml                            # Maven dependencies
    └── src/
        ├── main/
        │   ├── java/com/lekha/travel_planner/
        │   │   ├── TravelPlannerApplication.java   # Spring Boot entry point
        │   │   ├── controller/
        │   │   │   └── TravelController.java       # REST API endpoint
        │   │   └── service/
        │   │       ├── GroqService.java             # LLaMA 3.3 70B integration
        │   │       └── WeatherService.java          # wttr.in weather fetcher
        │   └── resources/
        │       ├── application.properties           # App config (uses env vars)
        │       ├── application.properties.example   # Example config template
        │       └── static/
        │           ├── index.html                   # Landing page + input form
        │           ├── itinerary.html               # Itinerary dashboard
        │           ├── app.js                       # Form logic + API calls
        │           ├── itinerary.js                 # Dashboard rendering + PDF
        │           └── style.css                    # Complete stylesheet
        └── test/
            └── java/com/lekha/travel_planner/
                └── TravelPlannerApplicationTests.java
```

---

## 📋 Prerequisites

- **Java 21** or higher — [Download](https://adoptium.net/temurin/releases/)
- **Groq API Key** (free) — [Get one here](https://console.groq.com)
- No database required
- No additional API keys required (wttr.in is free and keyless)

---

## 🚀 Installation Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Lekha15-cse/ai-travel-planner.git
cd ai-travel-planner/travel-planner
```

### 2. Get a Groq API Key

1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Navigate to **API Keys** and create a new key
4. Copy the key (starts with `gsk_...`)

### 3. Configure the API Key

**Option A — Environment Variable (Recommended):**

```bash
# Windows (PowerShell)
$env:GROQ_API_KEY = "gsk_your_key_here"

# Windows (CMD)
set GROQ_API_KEY=gsk_your_key_here

# Mac / Linux
export GROQ_API_KEY=gsk_your_key_here
```

**Option B — Application Properties:**

Copy the example config and add your key:

```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Edit `application.properties`:

```properties
spring.application.name=travel-planner
groq.api.key=gsk_your_key_here
server.port=8081
```

> ⚠️ **Never commit your actual API key to Git.**

---

## ▶️ Running Locally

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Mac / Linux
./mvnw spring-boot:run
```

Then open your browser at: **[http://localhost:8081](http://localhost:8081)**

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ Yes | Your Groq API key for LLaMA 3.3 70B inference |

---

## 🌐 Deployment Instructions (Render — Free Tier)

[Render](https://render.com) is the recommended free platform for deploying Spring Boot applications.

### Step 1 — Create a Render Account

Sign up at [https://render.com](https://render.com) (free tier available).

### Step 2 — Create a New Web Service

1. Click **New → Web Service**
2. Connect your GitHub repository: `Lekha15-cse/ai-travel-planner`
3. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `ai-travel-planner` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | `travel-planner` |
| **Runtime** | `Java` |
| **Build Command** | `./mvnw clean package -DskipTests` |
| **Start Command** | `java -jar target/travel-planner-0.0.1-SNAPSHOT.jar` |
| **Instance Type** | Free |

### Step 3 — Set Environment Variables

In the Render dashboard, go to **Environment** and add:

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | `gsk_your_key_here` |
| `PORT` | `8081` |

### Step 4 — Deploy

Click **Create Web Service**. Render will build and deploy your application automatically.

> 💡 **Note:** Free-tier instances spin down after 15 minutes of inactivity. The first request after idle may take 30–60 seconds to cold start.

---

## 🔧 API Configuration

### Groq API (LLaMA 3.3 70B)

- **Endpoint:** `https://api.groq.com/openai/v1/chat/completions`
- **Model:** `llama-3.3-70b-versatile`
- **Temperature:** `0.7`
- **Max Tokens:** `2500`
- **Auth:** Bearer token via `GROQ_API_KEY`
- **Free Tier:** 30 RPM, 14,400 RPD — sufficient for demo usage

### wttr.in Weather API

- **Endpoint:** `https://wttr.in/{destination}?format=3`
- **Auth:** None required (completely free)
- **Rate Limit:** Reasonable use — no hard limit

---

## 📸 Screenshots

> Screenshots will be added after deployment. To add screenshots:
> 1. Capture the landing page, form, loading animation, and itinerary dashboard
> 2. Save images to a `screenshots/` directory
> 3. Reference them here with `![Description](screenshots/filename.png)`

---

## 🔮 Future Improvements

- 🗺️ Interactive map with pinned attractions using Google Maps / Leaflet.js
- 🔐 User authentication and saved itinerary history
- 🌍 Multi-language itinerary generation
- ✈️ Real-time flight price integration
- 🏨 Live hotel booking links via affiliate APIs
- 📱 Progressive Web App (PWA) support for offline access
- 🧪 Comprehensive unit and integration tests
- 📊 Analytics dashboard for popular destinations

---

## 🧗 Challenges Faced

1. **Prompt Engineering** — Crafting the right prompt to get consistently structured, detailed itineraries from LLaMA 3.3 70B required multiple iterations to balance specificity with flexibility.
2. **Markdown Parsing** — The AI returns markdown-formatted text that needed reliable client-side parsing. Integrating `marked.js` and building a custom accordion-based day splitter was non-trivial.
3. **GitHub Secret Scanning** — GitHub Push Protection blocked pushes containing API keys, requiring us to migrate to environment variables and clean the Git history.
4. **Budget Heuristics** — Building a meaningful budget warning system without a real pricing database required a heuristic-based approach with per-destination baselines.
5. **PDF Generation** — Converting markdown-rich itineraries to well-formatted, multi-page PDFs with proper headings, page numbers, and footers using only client-side jsPDF.

---

## 🤖 AI Models Used

| Model | Provider | Purpose |
|-------|----------|---------|
| **LLaMA 3.3 70B Versatile** | [Groq](https://groq.com) | Generates the complete travel itinerary including day-wise plans, accommodation, food, transportation, budget breakdown, and emergency information |

Groq provides ultra-fast inference (~200 tokens/sec) making the experience feel near real-time.

---

## 🌦️ Weather API Used

| API | Provider | Purpose |
|-----|----------|---------|
| **wttr.in** | [wttr.in](https://wttr.in) | Fetches current real-time weather conditions for the destination city. Free, no authentication required. |

---

## 📄 PDF Export

The application generates professional, multi-page PDF reports using **jsPDF**:

- 📐 Formatted headings with color-coded hierarchy
- 📝 Markdown-to-text conversion with bullet point formatting
- 📄 Automatic page breaks with consistent margins
- 🔢 Page numbering footer (`Page X of Y — AI Travel Planner`)
- 📅 Generated date and trip metadata in the header
- 💾 Auto-download with destination-based filename

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👩‍💻 Author

**Lekha** — [@Lekha15-cse](https://github.com/Lekha15-cse)

Built with ❤️ for the hackathon.
