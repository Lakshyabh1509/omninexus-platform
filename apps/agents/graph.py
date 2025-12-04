from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, List
import operator
import random

class AgentState(TypedDict):
    messages: Annotated[list[str], operator.add]
    target_item: str
    current_price: float
    target_price: float
    negotiation_status: str # 'scouting', 'negotiating', 'deal_reached', 'failed'

# --- Nodes ---

def web_scout(state: AgentState):
    """Scouts the web for the item."""
    item = state.get("target_item", "Unknown Item")
    print(f"Scout: Searching for {item}...")
    
    # Simulate finding a price
    found_price = random.uniform(100, 200)
    return {
        "messages": [f"Scout: Found {item} at ${found_price:.2f}"],
        "current_price": found_price,
        "negotiation_status": "negotiating"
    }

def negotiator(state: AgentState):
    """Negotiates the price."""
    current_price = state["current_price"]
    target_price = state.get("target_price", 120.0)
    
    print(f"Negotiator: Current price is ${current_price:.2f}, target is ${target_price:.2f}")
    
    if current_price <= target_price:
        return {
            "messages": ["Negotiator: Price is within target range. Deal reached!"],
            "negotiation_status": "deal_reached"
        }
    else:
        # Simulate negotiation attempt
        new_price = current_price * 0.95
        return {
            "messages": [f"Negotiator: Counter-offered. New price: ${new_price:.2f}"],
            "current_price": new_price,
            "negotiation_status": "negotiating" if new_price > target_price else "deal_reached"
        }

def compliance_check(state: AgentState):
    """Checks if the deal is compliant."""
    status = state["negotiation_status"]
    if status == "deal_reached":
        return {"messages": ["Compliance: Deal approved. Proceeding to purchase."]}
    return {"messages": ["Compliance: Monitoring negotiation..."]}

# --- Graph Construction ---

workflow = StateGraph(AgentState)

workflow.add_node("scout", web_scout)
workflow.add_node("negotiator", negotiator)
workflow.add_node("compliance", compliance_check)

workflow.set_entry_point("scout")

def router(state: AgentState):
    if state["negotiation_status"] == "deal_reached":
        return "compliance"
    elif state["negotiation_status"] == "negotiating":
        return "negotiator"
    else:
        return END

workflow.add_conditional_edges(
    "scout",
    router,
    {"negotiator": "negotiator", "compliance": "compliance", END: END}
)

workflow.add_conditional_edges(
    "negotiator",
    router,
    {"negotiator": "negotiator", "compliance": "compliance", END: END}
)

workflow.add_edge("compliance", END)

app = workflow.compile()
