import { AgentProvider } from '@/components/agent/AgentContext';
import AgentModal from '@/components/agent/AgentModal';
import AgentTrigger from '@/components/agent/AgentTrigger';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import Skills from '@/components/sections/Skills';
import Publications from '@/components/sections/Publications';
import AgentSection from '@/components/sections/AgentSection';
import BuiltWithClaude from '@/components/sections/BuiltWithClaude';
import Contact from '@/components/sections/Contact';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import CustomCursor from '@/components/ui/CustomCursor';

export default function Home() {
  return (
    <AgentProvider>
      <Navbar />
      <main>
        <ErrorBoundary><Hero /></ErrorBoundary>
        <ErrorBoundary><About /></ErrorBoundary>
        <ErrorBoundary><Experience /></ErrorBoundary>
        <ErrorBoundary><Projects /></ErrorBoundary>
        <ErrorBoundary><Skills /></ErrorBoundary>
        <ErrorBoundary><Publications /></ErrorBoundary>
        <ErrorBoundary><AgentSection /></ErrorBoundary>
        <ErrorBoundary><BuiltWithClaude /></ErrorBoundary>
        <ErrorBoundary><Contact /></ErrorBoundary>
      </main>
      <Footer />
      <ErrorBoundary><AgentModal /></ErrorBoundary>
      <AgentTrigger />
      <CustomCursor />
    </AgentProvider>
  );
}
