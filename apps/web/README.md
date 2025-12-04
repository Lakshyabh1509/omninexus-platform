# OmniNexus Enterprise Intelligence Suite

![OmniNexus Banner](https://images.unsplash.com/photo-1642790551116-18e150f248e3?q=80&w=2533&auto=format&fit=crop)

**OmniNexus** is a next-generation **Corporate Action Management & Platform (C-AMP)** designed for high-stakes investment banking and enterprise compliance. It unifies data ingestion, loan management, compliance monitoring, and automated reporting into a single, AI-powered command center.

---

## 🚀 Key Features

### 📊 Command Center
- **Real-time Dashboard**: Monitor critical KPIs, active deals, and exposure at a glance.
- **Compliance Heatmap**: Visual calendar view of compliance status (Compliant, Warning, Breach).
- **Recent Events Feed**: Live ticker of corporate actions and system alerts.

### 🏦 C-AMP Platform
- **Loan Management**: Comprehensive portfolio tracking with search, filters, and detailed loan views (Covenants, Events, Documents).
- **Data Ingestion**: Drag-and-drop file upload (PDF, CSV, XLSX) with automated processing and API status monitoring (Bloomberg, Reuters).
- **Compliance Sentinel**: Automated risk scoring and "Pending Deliverables" tracker to ensure no deadline is missed.

### 📑 Intelligent Reporting
- **Investment Banking Reports**: Generate professional **Pitch Books**, **CIMs**, and **Teasers** in PDF format.
- **Financial Models**: Auto-generate complex **3-Statement Models** in Excel (XLSX) with multi-sheet support.
- **Strict Validation**: Enterprise-grade validation ensures reports are generated only for verified entities.

### 🧠 AI Core
- **Context-Aware Chat**: Integrated AI assistant (OpenAI/Anthropic) that understands your portfolio and data.
- **Smart Insights**: Automated analysis of financial data and risk factors.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS
- **UI Components**: Lucide React, Custom Enterprise UI Kit
- **Data Handling**: XLSX (SheetJS), jsPDF
- **AI Integration**: OpenAI GPT-4, Anthropic Claude 3.5
- **Backend**: Supabase (Ready for integration)

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-org/omninexus.git
    cd omninexus
    ```

2.  **Install dependencies**
    ```bash
    cd apps/web
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in `apps/web` with your API keys:
    ```env
    OPENAI_API_KEY=your_openai_key
    ANTHROPIC_API_KEY=your_anthropic_key
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

---

## 🚢 Deployment

For detailed deployment instructions, please refer to our [Deployment Guide](./DEPLOYMENT.md).

We recommend deploying to **Vercel** for the best performance and developer experience.

---

## 🔒 Security

- **Data Privacy**: All sensitive data is handled with enterprise-grade security standards.
- **Access Control**: Role-based access control (RBAC) ready.
- **Secret Management**: strict `.gitignore` policies to prevent API key leakage.

---

© 2024 OmniNexus Financial Technologies. All rights reserved.
