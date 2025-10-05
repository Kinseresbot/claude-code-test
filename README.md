# Sample Full-Stack Application

A demonstration project showing a REST API backend with Express.js and a React frontend featuring a Matrix-style terminal chatbot interface.

## Architecture

The application uses a client-server architecture:
- **Backend**: Express.js REST API (port 3001)
- **Frontend**: React SPA with Matrix-themed chatbot UI (port 3000)
- **Database**: MongoDB (connection via environment variables)
- **Chatbot**: n8n webhook integration for AI conversations

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (optional, only if using the backend)
- n8n instance with a webhook endpoint (for chatbot functionality)

### Installation

1. **Clone and install dependencies**:
```bash
npm install
cd client && npm install
```

2. **Configure environment variables**:

Backend (root `.env`):
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

Frontend (`client/.env`):
```bash
cd client
cp .env.example .env
# Edit .env with your n8n webhook URL
```

3. **Set up n8n webhook**:
   - Create a webhook node in your n8n workflow
   - Configure it to receive POST requests with `{ message, sessionId, timestamp }`
   - The workflow should return a response in one of these formats:
     - Plain string: `"response text"`
     - Object with message: `{ "message": "response text" }`
     - Object with response: `{ "response": "response text" }`
     - Object with output: `{ "output": "response text" }`

## Development

### Run the chatbot interface only:
```bash
cd client
npm run dev
```

### Run full-stack (backend + chatbot frontend):
```bash
npm run dev
```

- Backend runs on http://localhost:3001
- Frontend runs on http://localhost:3000
- Chatbot landing page is the default route (`/`)
- Original app routes are available at `/app/*`

## Features

### Matrix Terminal Chatbot
- **Full-screen terminal interface** with Matrix aesthetic
- **Animated "digital rain" background** with falling characters
- **CRT monitor effects**: scanlines, phosphor glow, screen flicker
- **Real-time messaging** with n8n chatbot integration
- **Boot sequence animation** on first visit
- **Session management** for conversation continuity
- **Responsive design** for mobile and desktop

### Styling
- Green-on-black Matrix color scheme (#00FF41)
- Monospace terminal fonts (Share Tech Mono, Courier Prime)
- Text glow effects and shadows
- Terminal-style message formatting
- Typing indicators with cursor animation

## Testing

Run all tests: `npm test`
Run server tests only: `npm run test:server`
Run client tests only: `npm run test:client`

## Deployment

Build for production: `npm run build`
Start production server: `npm start`

## Project Structure

```
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── MatrixChat.jsx        # Main chat component
│   │   ├── pages/
│   │   │   └── ChatbotLanding.jsx    # Landing page with boot sequence
│   │   ├── services/
│   │   │   └── chatbot.js            # n8n integration service
│   │   └── styles/
│   │       ├── matrix.css            # Global Matrix theme
│   │       ├── MatrixChat.css        # Chat component styles
│   │       └── ChatbotLanding.css    # Landing page styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                    # Express backend (optional)
└── package.json
```

## Customization

### Change n8n webhook URL
Edit `client/.env` and set `VITE_N8N_WEBHOOK_URL` to your n8n webhook endpoint.

### Customize Matrix colors
Edit CSS variables in `client/src/styles/matrix.css`:
```css
:root {
  --matrix-green: #00FF41;
  --matrix-green-dark: #008F11;
  --matrix-green-light: #00FF41;
}
```

### Disable boot sequence
Remove or modify the boot sequence logic in `client/src/pages/ChatbotLanding.jsx`.

### Modify chatbot response parsing
Update the response handling logic in `client/src/services/chatbot.js` to match your n8n workflow output format.
