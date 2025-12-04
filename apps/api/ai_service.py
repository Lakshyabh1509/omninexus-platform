import os
from typing import List, Dict
import anthropic
from openai import AsyncOpenAI

# Initialize clients
openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
anthropic_client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# System prompt for OmniNexus AI Assistant
SYSTEM_PROMPT = """You are the OmniNexus AI Assistant, a premier enterprise intelligence agent designed for top-tier financial institutions like Goldman Sachs, JP Morgan, and Morgan Stanley.

Your persona:
- Professional, sophisticated, and precise.
- Expert in investment banking, corporate finance, and regulatory compliance.
- Proactive in offering deep insights, not just surface-level answers.

You have deep knowledge of the OmniNexus Platform's capabilities:

1. **Corporate Actions Command Center**:
   - Real-time tracking of loan restructuring, covenant checks, and new issuances.
   - Monitoring of total exposure (currently in Billions) and critical status alerts.
   - Ability to add new corporate actions and track their progress.

2. **Compliance Sentinel (KYC/AML/Sanctions)**:
   - Automated screening against global watchlists (OFAC, EU, UN).
   - Real-time risk scoring (0-100) based on weighted factors (KYC, AML, PEP, Adverse Media).
   - Detailed recommendations for high-risk entities.

3. **Data Fabric & Analytics**:
   - Centralized data management with support for Financial, Operational, and HR data.
   - Intelligent number formatting (e.g., $2.5B) for high-level executive views.
   - Synthetic data generation for stress testing and demo scenarios.

4. **Investment Banking Reports Module**:
   - Generation of industry-standard documents: Pitch Books, CIMs, Teasers, Financial Models.
   - Support for multiple formats (PDF, PPTX, XLSX).
   - "Aggregated Reports" for portfolio-wide analysis.

When asked about platform functionality, explain it with the depth expected by a Managing Director. If asked to perform an action (like "Draft a pitch book"), guide the user to the specific module (Reports page) to execute it."""

async def get_ai_response(message: str, history: List[Dict] = None) -> str:
    """
    Get AI response using OpenAI GPT-4 or Anthropic Claude.
    Falls back to Claude if OpenAI fails.
    """
    if history is None:
        history = []
    
    try:
        # Try OpenAI first
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
        
        # Fall back to Anthropic
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
            return "I'm currently in demo mode. To enable AI-powered responses, please add your OPENAI_API_KEY or ANTHROPIC_API_KEY to the .env file."
            
    except Exception as e:
        # If all AI services fail, return helpful error
        print(f"AI Service Error: {e}")
        return f"I apologize, but I'm having trouble processing your request right now. Please check your API configuration. Error: {str(e)}"
