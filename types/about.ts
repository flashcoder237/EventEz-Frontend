// types/about.ts

export interface TeamMember {
    name: string;
    role: string;
    image: string;
    bio: string;
    socialLinks: {
      [key: string]: string;
    };
  }
  
  export interface FaqItem {
    question: string;
    answer: string;
  }
  
  export interface Achievement {
    number: string;
    text: string;
  }
  
  interface Stat {
    value: string;
    label: string;
  }
  
  export interface Advantage {
    icon: string;
    title: string;
    description: string;
    stats: Stat[];
  }
  
  export interface Testimonial {
    quote: string;
    name: string;
    role: string;
    image: string;
  }
  
  export interface SectionProps {
    animationTriggered: boolean;
  }
  
  export interface TeamSectionProps extends SectionProps {
    teamMembers: TeamMember[];
  }
  
  export interface StatsSectionProps extends SectionProps {
    achievements: Achievement[];
  }
  
  export interface TabsSectionProps extends SectionProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
  }
  
  export interface AdvantagesSectionProps extends SectionProps {
    advantages: Advantage[];
  }
  
  export interface TestimonialsSectionProps extends SectionProps {
    testimonials: Testimonial[];
  }
  
  export interface FaqSectionProps extends SectionProps {
    faqs: FaqItem[];
    expandedFaq: number | null;
    toggleFaq: (index: number) => void;
  }
  
  export interface CtaSectionProps extends SectionProps {}