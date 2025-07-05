.PHONY: install setup test clean dev build start

# Installation and Setup
install:
	@echo "📦 Installing dependencies..."
	npm install
	poetry install

setup: install
	@echo "🔧 Setting up QuantAlpha..."
	@if [ ! -f .env ]; then cp .env.example .env; echo "📝 Created .env file - please add your GROQ_API_KEY"; fi
	@echo "✅ Setup complete!"

# Development
dev:
	@echo "🚀 Starting development server..."
	npm run dev

# Python Commands
python-shell:
	@echo "🐍 Activating Poetry shell..."
	poetry shell

python-test:
	@echo "🧪 Testing Python setup..."
	poetry run python scripts/test_groq_connection.py

python-portfolio:
	@echo "📊 Running portfolio analysis..."
	poetry run python scripts/portfolio_manager.py

python-ai:
	@echo "🤖 Testing AI advisor..."
	poetry run python scripts/ai_portfolio_advisor.py

# Testing
test: python-test
	@echo "✅ All tests completed"

# Cleanup
clean:
	@echo "🧹 Cleaning up..."
	rm -rf node_modules/
	rm -rf .next/
	poetry env remove --all
	@echo "✅ Cleanup complete"

# Build and Deploy
build:
	@echo "🏗️ Building application..."
	npm run build

start:
	@echo "🚀 Starting production server..."
	npm start

# Help
help:
	@echo "QuantAlpha Development Commands:"
	@echo ""
	@echo "Setup:"
	@echo "  make setup          - Install all dependencies and create .env"
	@echo "  make install        - Install Node.js and Python dependencies"
	@echo ""
	@echo "Development:"
	@echo "  make dev            - Start Next.js development server"
	@echo "  make python-shell   - Activate Poetry environment"
	@echo ""
	@echo "Testing:"
	@echo "  make test           - Run all tests"
	@echo "  make python-test    - Test Groq API connection"
	@echo "  make python-ai      - Test AI portfolio advisor"
	@echo ""
	@echo "Production:"
	@echo "  make build          - Build for production"
	@echo "  make start          - Start production server"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean          - Clean all dependencies"
	@echo "  make help           - Show this help message"
