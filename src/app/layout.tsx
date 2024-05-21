import type { Metadata } from 'next';
import { Montserrat as FontSans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/contexts/theme-provider';
import Header from '@/components/header';
import { AuthProvider } from '@/contexts/auth-provider';

const fontSans = FontSans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Track your goals and habits',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'bg-background font-sans antialiased',
          fontSans.variable
        )}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          <AuthProvider>
            <div className='flex flex-col h-full pl-[calc(34px)]'>
              <Header />
              <main className='flex-grow'>
                <section className='mx-auto my-12 px-8 max-w-[90rem]'>
                  {children}
                </section>
              </main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
