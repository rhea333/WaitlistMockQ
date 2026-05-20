import { AppSidebar } from '@/components/app/app-sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return <AppSidebar>{children}</AppSidebar>;
}
