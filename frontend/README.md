# Frontend - TheKade

Built with **Next.js 15 (App Router, TypeScript)**.

---

## 🚀 Overview

The frontend is a **Next.js 15** application using the App Router.  
It communicates with backend microservices via the **API Gateway**.

### Key Libraries & Tools

- **shadcn/ui** → UI components
- **NextAuth.js** → JWT-based authentication management
- **Tailwind CSS** → Styling
- **TypeScript** → Type safety

---

## 📂 Project Structure

```
/app/api        -> API routes (proxy to API Gateway)
/components/ui  -> shadcn UI components
/components     -> Project-specific React components
/lib            -> Utilities & helpers
/util           -> Utility functions
/types          -> TypeScript type definitions
/config         -> Configuration files (constants, envs)
/hooks          -> Custom React hooks
/public         -> Static assets
```

---

## ⚡ Setup & Run

1. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

The app will run at → `http://localhost:3000`

---

## 🔑 Authentication

- Authentication is handled via **NextAuth.js**.
- JWT tokens (issued by the AuthService) are stored and managed automatically.
- Use `useSession()` hook from NextAuth to access the current logged-in user.

---

## 💳 Subscription Management

- Users can manage their subscription plans (Free, Premium, Author) via the `/dashboard/subscription` page.
- **Mock Payment System**: Use discount code `test-discount` to test subscription upgrades without actual payment.
- The subscription status is stored in the user's session and updated in real-time.
- See [Subscription Documentation](../docs/SUBSCRIPTION.md) for detailed information.

---

## 🎨 UI Components

- The project uses **shadcn/ui** for reusable UI components.
- New components should be placed inside `/components/ui` or `/components` depending on scope.

---

## 📘 Notes

- All API requests go through `/app/api/*` which acts as a proxy to the backend API Gateway.
- Ensure your backend (microservices) is running before using the frontend.
