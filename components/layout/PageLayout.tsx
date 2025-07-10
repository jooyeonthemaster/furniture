import Header from './Header';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className={`pt-16 xs:pt-14 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
} 