from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import List, Optional

class Document(BaseModel):
    id: str
    name: str
    type: str
    status: str  # 'pending', 'submitted', 'approved', 'rejected'
    due_date: datetime
    submitted_date: Optional[datetime] = None

class ComplianceCheckResult(BaseModel):
    passed: bool
    risk_score: int  # 0-100
    issues: List[str]

def check_kyc_compliance(documents: List[Document]) -> ComplianceCheckResult:
    issues = []
    risk_score = 0
    
    required_types = {'Passport', 'Utility Bill', 'Incorporation Cert'}
    submitted_types = {doc.type for doc in documents if doc.status in ('submitted', 'approved')}
    
    missing = required_types - submitted_types
    if missing:
        issues.append(f"Missing mandatory documents: {', '.join(missing)}")
        risk_score += 30 * len(missing)

    for doc in documents:
        if doc.status == 'pending' and doc.due_date < datetime.now():
            issues.append(f"Document {doc.name} is overdue")
            risk_score += 10
        
        if doc.status == 'rejected':
            issues.append(f"Document {doc.name} was rejected")
            risk_score += 20

    return ComplianceCheckResult(
        passed=risk_score < 50,
        risk_score=min(risk_score, 100),
        issues=issues
    )
