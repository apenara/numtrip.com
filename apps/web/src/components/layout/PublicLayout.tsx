import Footer from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function PublicLayout({ children, className = '' }: PublicLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}