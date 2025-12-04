import os
from typing import List, Dict
import anthropic
from openai import AsyncOpenAI

# Initialize clients
openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
anthropic_client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Perplexity Client (uses OpenAI SDK)
perplexity_client = AsyncOpenAI(
    api_key=os.getenv("PERPLEXITY_API_KEY"),
    base_url="https://api.perplexity.ai"
)

# System prompt for OmniNexus AI Assistant
SYSTEM_PROMPT = """You are the OmniNexus AI Assistant, a world-class financial expert and premier enterprise intelligence agent designed for top-tier financial institutions like Goldman Sachs, JP Morgan, and Morgan Stanley.

Your Persona:
- **World-Class Financial Expert**: You possess deep, encyclopedic knowledge of global finance, macroeconomics, investment strategies, derivatives, risk management, and financial modeling. You can answer ANY finance-related question with the depth and precision of a Managing Director or Senior Analyst.
- **Platform Specialist**: You are the expert guide for the OmniNexus Platform, helping users navigate and utilize its powerful tools.
- **Professional & Precise**: Your tone is sophisticated, objective, and concise. You avoid fluff and get straight to the insight.

Your Capabilities:

1. **General Finance & Market Intelligence (High Priority)**:
   - Answer complex questions about financial concepts (e.g., "Explain the Greeks in options trading", "Impact of interest rates on bond duration").
   - Analyze market trends and economic indicators.
   - Provide definitions, formulas, and strategic implications for financial terms.
   - **CRITICAL**: If a user asks a general finance question that is NOT related to the platform, answer it directly and comprehensively. Do not try to force a connection to the platform if it doesn't exist.

2. **OmniNexus Platform Knowledge**:
   - **Corporate Actions Command Center**: Tracking loan restructuring, covenants, and exposure.
   - **Compliance Sentinel**: KYC/AML screening, risk scoring, and regulatory alerts.
   - **Data Fabric**: Data management, ingestion, and synthetic data generation.
   - **Investment Banking Reports**: Generating Pitch Books, CIMs, and Financial Models.

Interaction Guidelines:
- **For General Finance Questions**: Provide a detailed, expert-level answer. Use bullet points for clarity.
- **For Platform Questions**: Explain the functionality and guide the user to the specific module (e.g., "Navigate to the Reports page...").
- **For Hybrid Questions**: Answer the general concept first, then mention how OmniNexus handles it (e.g., "VaR is... OmniNexus calculates VaR in the Risk module...").

You are here to empower financial professionals with instant, high-quality intelligence."""

async def get_ai_response(message: str, history: List[Dict] = None) -> str:
    """
    Get AI response using Perplexity, OpenAI GPT-4 or Anthropic Claude.
    Prioritizes Perplexity for live/general queries if available.
    """
    if history is None:
        history = []
    
    try:
        # 1. Try Perplexity first (Best for real-time/general finance)
        if os.getenv("PERPLEXITY_API_KEY") and os.getenv("PERPLEXITY_API_KEY") != "your_perplexity_api_key_here":
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            
            for msg in history:
                messages.append({
                    "role": msg.get("role", "user"),
                    "content": msg.get("content", "")
                })
            
            messages.append({"role": "user", "content": message})
            
            try:
                response = await perplexity_client.chat.completions.create(
                    model="sonar-pro",
                    messages=messages,
                    max_tokens=1000,
                    temperature=0.7
                )
                return response.choices[0].message.content
            except Exception as e:
                print(f"Perplexity API failed, falling back: {e}")
                # Fallthrough to next provider

        # 2. Try OpenAI
        if os.getenv("OPENAI_API_KEY") and os.getenv("OPENAI_API_KEY") != "your_openai_api_key_here":
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            
            # Add conversation history
            for msg in history:
                messages.append({
                    "role": msg.get("role", "user"),
                    "content": msg.get("content", "")
                })
            
            # Add current message
            messages.append({"role": "user", "content": message})
            
            response = await openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=messages,
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content
        
        # 3. Fall back to Anthropic
        elif os.getenv("ANTHROPIC_API_KEY") and os.getenv("ANTHROPIC_API_KEY") != "your_anthropic_api_key_here":
            # Format conversation for Claude
            conversation = []
            for msg in history:
                conversation.append({
                    "role": msg.get("role", "user"),
                    "content": msg.get("content", "")
                })
            
            conversation.append({"role": "user", "content": message})
            
            response = anthropic_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=500,
                system=SYSTEM_PROMPT,
                messages=conversation
            )
            
            return response.content[0].text
        
        else:
            # No valid API keys - return fallback
            return "I'm currently in demo mode. To enable AI-powered responses, please add your PERPLEXITY_API_KEY, OPENAI_API_KEY or ANTHROPIC_API_KEY to the .env file."
            
    except Exception as e:
        # If all AI services fail, return helpful error
        print(f"AI Service Error: {e}")
        return f"I apologize, but I'm having trouble processing your request right now. Please check your API configuration. Error: {str(e)}"
