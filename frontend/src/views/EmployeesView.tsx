import React, { useState, useEffect } from 'react';
import { fetchEmployees, type EmployeeListItem } from '../api/employees.api';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import { Users, Search, Plus, ChevronLeft, ChevronRight, RefreshCw, AlertTriangle } from 'lucide-react';

export const EmployeesView: React.FC = () => {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchEmployees(page, 10);
      setEmployees(data.items);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message || 'We couldn\'t retrieve this workforce workspace right now.');
      showToast('Failed to load employee directory', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [page]);

  const filtered = employees.filter((e) => {
    const term = searchQuery.toLowerCase();
    const name = `${e.firstName} ${e.lastName}`.toLowerCase();
    const code = (e.employeeCode || '').toLowerCase();
    const dept = (e.department?.name || '').toLowerCase();
    return name.includes(term) || code.includes(term) || dept.includes(term);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F3F1E8', margin: 0 }}>Workforce Directory</h2>
          <p style={{ color: '#8A918A', fontSize: '0.875rem', margin: '4px 0 0 0' }}>Manage enterprise workforce profiles, designations, and departmental structures.</p>
        </div>
        <button
          onClick={() => showToast('Employee creation drawer opened', 'info')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            background: '#7CFFB2',
            color: '#060806',
            fontWeight: 800,
            fontSize: '0.875rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Plus size={16} /> Add New Employee
        </button>
      </div>

      {/* Filter Search Toolbar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={16} color="#8A918A" style={{ position: 'absolute', left: '14px' }} />
          <input
            type="text"
            placeholder="Filter workforce by name, employee code, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              borderRadius: 'var(--radius-md)',
              background: '#0D120F',
              border: '1px solid rgba(243, 241, 232, 0.12)',
              color: '#F3F1E8',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Table Container */}
      <div style={{ background: '#0D120F', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: '#8A918A' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #7CFFB2', borderTopColor: 'transparent', margin: '0 auto 1rem auto', animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '0.875rem', color: '#F3F1E8', fontWeight: 600 }}>Loading workforce records...</span>
          </div>
        ) : error ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#8A918A' }}>
            <AlertTriangle size={36} color="#E97870" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ color: '#F3F1E8', fontWeight: 800, margin: 0 }}>SYSTEM CONNECTION INTERRUPTED</h4>
            <p style={{ fontSize: '0.8125rem', marginTop: '6px', maxWidth: '420px', margin: '6px auto 1.5rem auto' }}>{error}</p>
            <button
              onClick={loadEmployees}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                background: '#131A15',
                border: '1px solid rgba(124, 255, 178, 0.3)',
                color: '#7CFFB2',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} /> Retry Connection
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#8A918A' }}>
            <Users size={36} color="#7CFFB2" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ color: '#F3F1E8', fontWeight: 800, margin: 0 }}>NO WORKFORCE RECORDS FOUND</h4>
            <p style={{ fontSize: '0.8125rem', marginTop: '6px' }}>There are no employee profiles matching your active criteria.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#131A15', borderBottom: '1px solid rgba(243, 241, 232, 0.08)', color: '#8A918A' }}>
                <th style={{ padding: '14px 18px' }}>Employee</th>
                <th style={{ padding: '14px 18px' }}>Code</th>
                <th style={{ padding: '14px 18px' }}>Department</th>
                <th style={{ padding: '14px 18px' }}>Designation</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid rgba(243, 241, 232, 0.06)' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#F3F1E8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#131A15', border: '1px solid #7CFFB2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#7CFFB2', fontWeight: 800 }}>
                        {emp.firstName[0]}
                      </div>
                      <span>{emp.firstName} {emp.lastName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', color: '#7CFFB2', fontSize: '0.8125rem' }}>{emp.employeeCode}</td>
                  <td style={{ padding: '14px 18px', color: '#A8ADA4' }}>{emp.department?.name || 'Unassigned'}</td>
                  <td style={{ padding: '14px 18px', color: '#A8ADA4' }}>{emp.designation}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <Badge variant={emp.status === 'ACTIVE' ? 'success' : 'warning'}>{emp.status}</Badge>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <button
                      onClick={() => showToast(`Viewing profile of ${emp.firstName} ${emp.lastName}`, 'info')}
                      style={{ background: 'transparent', border: '1px solid rgba(243,241,232,0.12)', color: '#F3F1E8', padding: '4px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination Bar */}
        <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(243, 241, 232, 0.08)', fontSize: '0.8125rem', color: '#8A918A' }}>
          <span>Showing {filtered.length} of {total} employees</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              style={{ background: '#131A15', border: '1px solid rgba(243, 241, 232, 0.08)', color: '#F3F1E8', padding: '4px 10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ padding: '4px 8px', fontFamily: 'var(--font-mono)', color: '#7CFFB2' }}>Page {page}</span>
            <button
              disabled={filtered.length < 10}
              onClick={() => setPage(page + 1)}
              style={{ background: '#131A15', border: '1px solid rgba(243, 241, 232, 0.08)', color: '#F3F1E8', padding: '4px 10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
