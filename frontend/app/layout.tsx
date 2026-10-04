import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TaskPilot — Agentic AI Opportunity Management Platform',
  description: 'Autonomous multi-step opportunity discovery, eligibility verification, pipeline tracking, and human-in-the-loop follow-up management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
