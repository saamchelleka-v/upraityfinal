import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

const optima = localFont({
  src: [
    {
      path: '../../public/fonts/optima-regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/optima-italic.woff',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/optima-medium.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/optima-bold.woff',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-optima',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Upraity And Son — Grave Structures & Monumental Stonemasons (Est. 1909)',
  description:
    'Upraity And Son: Handcrafting strong, dignified memorial monuments and grave structures since 1909. 4-generation family legacy specializing in granite, Carrara marble, custom engraving, and precision leveling.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark ${optima.variable} ${optima.className} antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('upraity_theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    if (!saved) localStorage.setItem('upraity_theme', 'dark');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${optima.className} min-h-screen bg-[#FBFBFB] dark:bg-[#09090b] text-[#18181b] dark:text-[#ededed] selection:bg-[#8B7355] selection:text-white antialiased transition-colors duration-200`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
