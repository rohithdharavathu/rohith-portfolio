import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rohith Dharavathu — Data Scientist & GenAI Builder",
  description: "Data Scientist at HDFC Bank. ML, NLP, GenAI. Building CodeSage AI — GitHub-native codebase intelligence. 3 IEEE/Springer publications.",
  openGraph: {
    title: "Rohith Dharavathu — Data Scientist & GenAI Builder",
    description: "Data Scientist at HDFC Bank. ML, NLP, GenAI. Building CodeSage AI.",
    type: "website",
    url: "https://rohithdharavathu.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohith Dharavathu — Data Scientist & GenAI Builder",
    description: "Data Scientist at HDFC Bank. ML, NLP, GenAI. Building CodeSage AI.",
  },
  robots: "index, follow",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Mono:wght@400;500&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full" style={{ background: '#080810' }}>
        {children}
      </body>
    </html>
  );
}
