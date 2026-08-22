import React from 'react';
import { motion } from 'framer-motion';
import { AuroraBackground } from '../components/common/AuroraBackground';
import { MouseLightOverlay } from '../components/common/MouseLightOverlay';
import { LandingHeader } from '../components/landing/LandingHeader';
import { LandingFooter } from '../components/landing/LandingFooter';
import { EditorialHero } from '../components/landing/EditorialHero';
import { WorkforceChapter } from '../components/landing/WorkforceChapter';
import { OperationsChapter } from '../components/landing/OperationsChapter';
import { MoneyChapter } from '../components/landing/MoneyChapter';
import { PerformanceChapter } from '../components/landing/PerformanceChapter';
import { IntelligenceChapter } from '../components/landing/IntelligenceChapter';
import { WorkflowSection } from '../components/landing/WorkflowSection';
import { SystemConvergence } from '../components/landing/SystemConvergence';

interface LandingPageProps {
  onNavigateToDashboard: () => void;
}

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut' as const,
    },
  },
};

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToDashboard }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <AuroraBackground />
      <MouseLightOverlay />
      <LandingHeader onNavigateToApp={onNavigateToDashboard} />

      <main style={{ flex: 1 }}>
        <EditorialHero onExplore={onNavigateToDashboard} />

        {/* Marquee Rhythm Divider */}
        <div style={{ padding: '2.5rem 0', overflow: 'hidden', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.01)' }}>
          <div className="animate-marquee" style={{ gap: '3rem', fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#626A62' }}>
            <span>ATTENDANCE &bull; LEAVE &bull; PAYROLL &bull; PERFORMANCE &bull; HELPDESK &bull; INTELLIGENCE</span>
            <span>ATTENDANCE &bull; LEAVE &bull; PAYROLL &bull; PERFORMANCE &bull; HELPDESK &bull; INTELLIGENCE</span>
          </div>
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={sectionVariant}>
          <WorkforceChapter />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={sectionVariant}>
          <OperationsChapter />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={sectionVariant}>
          <MoneyChapter />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={sectionVariant}>
          <PerformanceChapter />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={sectionVariant}>
          <IntelligenceChapter />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={sectionVariant}>
          <WorkflowSection />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={sectionVariant}>
          <SystemConvergence onExplore={onNavigateToDashboard} />
        </motion.div>
      </main>

      <LandingFooter />
    </div>
  );
};
