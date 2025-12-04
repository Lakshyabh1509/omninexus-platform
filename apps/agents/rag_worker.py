from typing import List

class RAGWorker:
    def __init__(self):
        # Initialize Vector DB client here
        self.knowledge_base = {
            "policy_1": "Employees must submit expense reports by the 5th of each month.",
            "policy_2": "Remote work requires VP approval for more than 3 days a week.",
            "hr_1": "Annual leave allowance is 25 days per year.",
        }

    def retrieve(self, query: str) -> List[str]:
        # Simulate vector similarity search
        print(f"RAG: Searching for '{query}'...")
        
        results = []
        for key, text in self.knowledge_base.items():
            if any(word in text.lower() for word in query.lower().split()):
                results.append(text)
        
        if not results:
            results.append("No relevant documents found in the knowledge base.")
            
        return results

    def synthesize_answer(self, query: str) -> str:
        docs = self.retrieve(query)
        context = "\n".join(docs)
        # Simulate LLM generation
        return f"Based on the internal policy: {context}"

rag_worker = RAGWorker()

def query_knowledge_base(query: str):
    return rag_worker.synthesize_answer(query)
