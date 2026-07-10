#!/usr/bin/env python3
"""
Seed the database with default portfolio content.
Run this after setup_admin.py to populate the content tables.
"""

import sys
from models.database import set_content, init_db

# Default content matching the frontend data structure
DEFAULT_CONTENT = {
    "hero": {
        "subtitles": [
            "LLM Architect",
            "RAG Engineer",
            "System Builder",
            "Production Thinker",
            "The Intuitive ✦"
        ],
        "tagline": "eval-driven iteration, not hype ✦",
        "description": "I build AI systems that ship — then I make them reliable, fast, and worth caring about. 3.5+ years of production LLM systems, retrieval pipelines, and intelligent automation."
    },
    "skills": [
        {"name": "Azure OpenAI", "category": "ai-llm", "level": "core"},
        {"name": "GPT-4o", "category": "ai-llm", "level": "core"},
        {"name": "LangChain", "category": "ai-llm", "level": "core"},
        {"name": "RAG Systems", "category": "ai-llm", "level": "core"},
        {"name": "Prompt Engineering", "category": "ai-llm", "level": "core"},
        {"name": "LangGraph", "category": "ai-llm", "level": "proficient"},
        {"name": "Vector DBs", "category": "ai-llm", "level": "core"},
        {"name": "Agentic Workflows", "category": "ai-llm", "level": "core"},
        {"name": "LoRA / QLoRA", "category": "ai-llm", "level": "proficient"},
        {"name": "FastAPI", "category": "backend", "level": "core"},
        {"name": "Python", "category": "backend", "level": "core"},
        {"name": "TypeScript", "category": "backend", "level": "proficient"},
        {"name": "WebSockets", "category": "backend", "level": "core"},
        {"name": "Celery / Redis", "category": "backend", "level": "core"},
        {"name": "PostgreSQL", "category": "backend", "level": "proficient"},
        {"name": "REST APIs", "category": "backend", "level": "core"},
        {"name": "Azure AI Foundry", "category": "cloud", "level": "core"},
        {"name": "Docker", "category": "cloud", "level": "proficient"},
        {"name": "Kubernetes", "category": "cloud", "level": "proficient"},
        {"name": "CI/CD", "category": "cloud", "level": "core"},
        {"name": "OpenTelemetry", "category": "cloud", "level": "proficient"},
        {"name": "PyTorch", "category": "ml-nlp", "level": "proficient"},
        {"name": "TensorFlow", "category": "ml-nlp", "level": "proficient"},
        {"name": "Hugging Face", "category": "ml-nlp", "level": "proficient"},
        {"name": "scikit-learn", "category": "ml-nlp", "level": "core"},
        {"name": "Text Classification", "category": "ml-nlp", "level": "core"},
        {"name": "Semantic Search", "category": "ml-nlp", "level": "core"},
        {"name": "PySpark", "category": "data", "level": "proficient"},
        {"name": "ETL Pipelines", "category": "data", "level": "core"},
        {"name": "Elasticsearch", "category": "data", "level": "proficient"},
        {"name": "Power BI", "category": "data", "level": "proficient"}
    ],
    "projects": [],  # Add your projects here
    "experiences": [],  # Add your experiences here
    "personalities": [],  # Add your personalities here
    "hobbies": [],  # Add your hobbies here
    "oracle_prompt": ""  # Add oracle prompt here
}


def seed_content():
    """Seed the database with default content."""
    print("🌱 Seeding database with default content...")

    # Initialize database (creates tables if they don't exist)
    init_db()

    # Seed each content key
    for key, data in DEFAULT_CONTENT.items():
        print(f"   ✓ Seeding '{key}'...")
        set_content(key, data)

    print("✅ Database seeded successfully!")
    print("\nYou can now start the backend:")
    print("   python app.py")


if __name__ == "__main__":
    try:
        seed_content()
    except Exception as e:
        print(f"❌ Error seeding database: {e}", file=sys.stderr)
        sys.exit(1)
