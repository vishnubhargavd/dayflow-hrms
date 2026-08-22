import React, { useState } from 'react';
import { Badge } from '../common/Badge';
import { CreditCard, DollarSign, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const MoneyChapter: React.FC = () => {
  const [baseSalary, setBaseSalary] = useState<number>(85000);
  const [hra, setHra] = useState<boolean>(true);
  const [medical, setMedical] = useState<boolean>(true);

  const hraAmount = hra ? 18500 : 0;
  const medicalAmount = medical ? 6000 : 0;
  const taxDeduction = Math.round((baseSalary + hraAmount + medicalAmount) * 0.10);
  const netDisbursement = baseSalary + hraAmount + medicalAmount - taxDeduction;

  return (
    <section id="money" style={{ padding: '6rem 0', background: 'var(--bg-base)' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
        {/* Chapter Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
          <span className="chapter-num" style={{ color: '#D6C38A' }}>03 / 06 &bull; MONEY</span>
          <h2 className="editorial-heading">
            <span style={{ color: '#F3F1E8' }}>EVERY NUMBER</span><br />
            <span style={{ background: 'linear-gradient(135deg, #D6C38A 0%, #7CFFB2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              HAS A STORY.
            </span>
          </h2>
        </div>

        {/* Two-Column Composition */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          {/* Left Column: Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <p style={{ color: '#A8ADA4', fontSize: '1.125rem', lineHeight: 1.65 }}>
              Automated compensation structure calculations, tax withholding breakdowns, allowance rules, and one-click direct deposit disbursement.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#7CFFB2" />
                <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#F3F1E8' }}>Automated Tax Withholding Engine</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#D6C38A" />
                <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#F3F1E8' }}>Dynamic HRA & Medical Allowance Rules</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#159A68" />
                <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#F3F1E8' }}>Direct Bank Transfer Integration</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Payroll Calculator Simulator */}
          <div className="product-surface" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(13, 18, 15, 0.88)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} color="#D6C38A" />
                <span style={{ fontSize: '0.875rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#F3F1E8' }}>INTERACTIVE PAYROLL MODEL</span>
              </div>
              <Badge variant="warning">CONCEPTUAL MODEL</Badge>
            </div>

            {/* Base Salary Input Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: '#A8ADA4' }}>Base Annual Compensation</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#D6C38A' }}>₹{baseSalary.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="40000"
                max="200000"
                step="5000"
                value={baseSalary}
                onChange={(e) => setBaseSalary(Number(e.target.value))}
                style={{ accentColor: '#7CFFB2', cursor: 'pointer' }}
              />
            </div>

            {/* Allowance Toggles */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8125rem', color: '#A8ADA4' }}>
                <input type="checkbox" checked={hra} onChange={() => setHra(!hra)} style={{ accentColor: '#7CFFB2' }} />
                <span>HRA (+₹18,500)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8125rem', color: '#A8ADA4' }}>
                <input type="checkbox" checked={medical} onChange={() => setMedical(!medical)} style={{ accentColor: '#7CFFB2' }} />
                <span>Medical (+₹6,000)</span>
              </label>
            </div>

            {/* Financial Calculation Breakdown */}
            <div style={{ background: '#0D120F', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid rgba(243, 241, 232, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#8A918A' }}>BASE SALARY</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#F3F1E8' }}>₹{baseSalary.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#8A918A' }}>HRA ALLOWANCE</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#D6C38A' }}>+₹{hraAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#8A918A' }}>MEDICAL ALLOWANCE</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#D6C38A' }}>+₹{medicalAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#8A918A' }}>TAX WITHHOLDING (−10%)</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#E97870' }}>-₹{taxDeduction.toLocaleString()}</span>
              </div>
              <div style={{ borderTop: '1px dashed var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#F3F1E8' }}>NET DISBURSEMENT</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DollarSign size={18} color="#7CFFB2" />
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#7CFFB2' }}>
                    ₹{netDisbursement.toLocaleString()}
                  </span>
                  <ArrowUpRight size={16} color="#7CFFB2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
