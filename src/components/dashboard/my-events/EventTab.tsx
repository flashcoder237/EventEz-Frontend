import Link from 'next/link';
import { TabsTrigger } from '@/components/ui/Tabs';

interface EventTabProps {
  value: string;
  href: string;
  children: React.ReactNode;
}

export default function EventTab({ value, href, children }: EventTabProps) {
  return (
    <TabsTrigger value={value}>
      <Link href={href}>
        <span>{children}</span>
      </Link>
    </TabsTrigger>
  );
}