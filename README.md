# 🏫 DCMS — Dhanbari Collegiate Model School

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query_v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query)

<br/>

**🔗 Links:**
[⚙️ Backend Repo](https://github.com/naims6/dcms-backend-v2.git) &nbsp;•&nbsp;
[🌐 Live Demo](https://dcms-frontend-woad.vercel.app)

</div>

---

## 📖 About the Project

**DCMS** (Dhanbari Collegiate Model School — Management System) is a full-stack school management platform that replaces slow, paper-based school operations with a fast, modern web experience.

Students and parents get a clean public website to browse school info, apply for admission online, pay fees, and download a PDF receipt — all without visiting the office. School staff get a secure admin dashboard to manage admissions, students, notices, users, and permissions through a fine-grained **Role-Based Access Control (RBAC)** system.

Built with real-world features: **multi-step admission flow**, **online payment integration**, **PDF generation**, **bilingual support (EN / BN)**, and **dark/light mode**.

---

## ✨ Key Features

### 🌐 Public Website
| Feature | Description |
|---|---|
| **Home / About / Gallery** | Informational pages showcasing the school, its history, mission, facilities, and photo gallery |
| **Teacher Directory** | Browsable list of all teachers with individual profile pages |
| **Notice Board** | Publicly accessible school notices with detail view |
| **Alumni Forum** | Dedicated section for alumni engagement, events, and posts |
| **Contact Page** | Contact info cards and enquiry section |

### 🎓 Online Admission System
A guided **4-step admission workflow** for new applicants:

1. **Apply** — Multi-section application form (student info, parent info, academic info, contact & additional details)
2. **Verify Email** — OTP-based email verification for application authenticity
3. **Fee Payment** — Integrated online payment gateway step
4. **Receipt** — Downloadable PDF admission voucher generated client-side

Applicants can also track their existing application via a modal using their application ID.

### 🛡️ Admin Dashboard
| Module | Capabilities |
|---|---|
| **Overview** | At-a-glance dashboard metrics |
| **Admissions** | View, review, and manage all admission applications |
| **Students** | Full CRUD — create, view, edit, and list enrolled students |
| **Users** | Manage staff/admin user accounts |
| **Roles & RBAC** | Define roles and assign granular permissions (e.g. `students:read`, `notices:read`) |
| **Notices** | Create and edit rich-text notices using a Tiptap editor with formatting toolbar |
| **Profile** | Authenticated user profile settings |

### ⚙️ Technical Highlights
- 🌐 **Bilingual i18n** — English & Bengali (`en` / `bn`) with `next-intl` and locale-based routing (`/en/...`, `/bn/...`)
- 🌓 **Dark / Light Mode** — System-adaptive theme via `next-themes` with smooth transitions
- 🔒 **RBAC-Driven UI** — Dashboard navigation items are conditionally rendered based on the authenticated user's permissions
- 📱 **Fully Responsive** — Mobile-first layout across all pages and dashboard views
- 📄 **Client-Side PDF** — Admission receipts and vouchers generated in-browser with `jsPDF` + `html2canvas`
- ⚡ **React Compiler** — Enabled for automatic memoization and optimal re-render performance
- 🖼️ **Cloudinary Images** — Remote image optimization via Next.js Image component

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Server State** | [TanStack Query v5](https://tanstack.com/query/latest) |
| **Rich Text Editor** | [Tiptap](https://tiptap.dev/) (with Link, Underline, Placeholder extensions) |
| **Internationalization** | [next-intl](https://next-intl-docs.vercel.app/) |
| **PDF Generation** | [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/) |
| **Icons** | [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/) |
| **Package Manager** | [pnpm](https://pnpm.io/) |
| **CI / CD** | [GitHub Actions](https://github.com/features/actions) + [Docker](https://www.docker.com/) |

---

## 🗂️ Project Structure

```
dcms-frontend/
├── src/
│   ├── app/
│   │   └── [locale]/               # Locale-aware App Router root
│   │       ├── (public)/           # Public-facing pages (home, about, admissions, etc.)
│   │       └── (dashboard)/        # Protected admin dashboard pages
│   ├── components/
│   │   ├── pages/                  # Page-specific UI components (public)
│   │   ├── dashboard/              # Dashboard-specific UI components
│   │   └── ui/                     # Shared shadcn/ui primitives
│   ├── services/                   # API service layer (auth, students, notices, etc.)
│   ├── hooks/
│   │   └── queries/                # TanStack Query hooks per domain
│   ├── schemas/                    # Zod validation schemas
│   ├── types/                      # TypeScript type definitions
│   ├── providers/                  # React context & query providers
│   ├── context/                    # Auth context
│   ├── constants/                  # Static data (nav items, gallery data, etc.)
│   ├── i18n/                       # next-intl routing & request config
│   └── lib/                        # Utility functions, API client, query keys
├── next.config.ts
├── components.json                 # shadcn/ui config
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `>= 20`
- [pnpm](https://pnpm.io/) `>= 9`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/naims6/dcms-frontend.git
cd dcms-frontend

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in the required values (see below)

# 4. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server with Turbopack |
| `pnpm build` | Create an optimized production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint across the codebase |

---

## 👤 Author

<p>
  <strong>Naim Sorker</strong><br/>
  Full Stack Developer
</p>

[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:naimsorker6@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/naims6)
[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@NaimsDev)
[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://www.facebook.com/naim.sorker6)