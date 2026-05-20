# Use a base image with Python and Node.js
FROM python:3.9-slim as backend

# Backend setup
WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .

# Frontend build stage
FROM node:18-slim as frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Final stage
FROM python:3.9-slim
WORKDIR /app
COPY --from=backend /app/backend /app/backend
COPY --from=frontend /app/frontend/dist /app/frontend/dist

# Install production dependencies for backend
RUN pip install --no-cache-dir fastapi uvicorn torch transformers safetensors pydantic python-multipart

# Expose ports
EXPOSE 8000

# Start backend (In a real production, you might serve frontend via Nginx)
CMD ["python", "backend/main.py"]
