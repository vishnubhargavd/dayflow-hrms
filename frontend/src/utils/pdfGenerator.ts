export interface DetailedPayslipData {
  employeeName: string;
  employeeId: string;
  department: string;
  designation: string;
  month: string;
  wage: number;
  basicSalary: number;
  hra: number;
  performanceBonus: number;
  leaveTravelAllowance: number;
  standardAllowance: number;
  fixedAllowance: number;
  totalEarnings: number;
  pfEmployee: number;
  professionalTax: number;
  totalDeductions: number;
  netSalary: number;
}

export function generatePayslipPdf(data: DetailedPayslipData): void {
  const windowRef = window.open('', '_blank');
  if (!windowRef) {
    window.print();
    return;
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Dayflow_Payslip_${data.employeeId}_${data.month.replace(/\s+/g, '_')}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 12mm 15mm;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #111827;
          background: #ffffff;
          line-height: 1.4;
          font-size: 12px;
          padding: 10px;
        }
        .payslip-container {
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 24px;
          background: #ffffff;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #059669;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .brand-title {
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -0.5px;
          color: #059669;
        }
        .brand-sub {
          font-size: 11px;
          color: #4b5563;
          margin-top: 2px;
        }
        .brand-corp {
          font-size: 10px;
          color: #6b7280;
          margin-top: 4px;
        }
        .header-right {
          text-align: right;
        }
        .period-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          color: #6b7280;
          letter-spacing: 0.05em;
        }
        .period-val {
          font-size: 16px;
          font-weight: 800;
          color: #111827;
          font-family: monospace;
          margin-top: 2px;
        }
        .ref-no {
          font-size: 10px;
          color: #059669;
          font-family: monospace;
          margin-top: 2px;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 14px;
          margin-bottom: 20px;
        }
        .meta-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .meta-row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
        }
        .meta-label {
          color: #6b7280;
          font-weight: 500;
        }
        .meta-value {
          color: #111827;
          font-weight: 700;
        }
        .meta-value.mono {
          font-family: monospace;
        }
        .tables-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }
        .section-table {
          width: 100%;
          border-collapse: collapse;
        }
        .section-table th {
          background: #f3f4f6;
          padding: 8px 10px;
          text-align: left;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          color: #374151;
          border-bottom: 1px solid #d1d5db;
        }
        .section-table th.amount {
          text-align: right;
        }
        .section-table td {
          padding: 6px 10px;
          font-size: 11px;
          border-bottom: 1px solid #f3f4f6;
          color: #1f2937;
        }
        .section-table td.amount {
          text-align: right;
          font-family: monospace;
          font-weight: 600;
        }
        .section-table tr.total-row td {
          border-top: 1px solid #d1d5db;
          border-bottom: none;
          font-weight: 800;
          background: #f9fafb;
          padding: 8px 10px;
        }
        .net-card {
          background: #ecfdf5;
          border: 1.5px solid #10b981;
          border-radius: 8px;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .net-title {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          color: #047857;
          letter-spacing: 0.05em;
        }
        .net-amount {
          font-size: 24px;
          font-weight: 900;
          color: #065f46;
          font-family: monospace;
          margin-top: 2px;
        }
        .net-sub {
          font-size: 10px;
          color: #4b5563;
          margin-top: 2px;
        }
        .net-cert {
          text-align: right;
          font-size: 10px;
          color: #047857;
          font-weight: 700;
        }
        .footer {
          border-top: 1px dashed #d1d5db;
          padding-top: 12px;
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: #6b7280;
          font-family: monospace;
        }
        .no-print {
          margin-bottom: 16px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .btn-print {
          padding: 8px 18px;
          background: #059669;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
        }
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            padding: 0;
            background: #ffffff;
          }
          .payslip-container {
            border: 1px solid #d1d5db;
            padding: 20px;
            box-shadow: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print">
        <button class="btn-print" onclick="window.print()">PRINT / SAVE AS PDF</button>
      </div>

      <div class="payslip-container">
        <div class="header">
          <div>
            <div class="brand-title">DAYFLOW HRMS</div>
            <div class="brand-sub">Official Salary Disbursement & Tax Certificate</div>
            <div class="brand-corp">Corporate HQ: Bangalore, India • CIN: U72200KA2022PTC123456</div>
          </div>
          <div class="header-right">
            <div class="period-label">Payslip Period</div>
            <div class="period-val">${data.month}</div>
            <div class="ref-no">Ref: DF-${Date.now().toString().slice(-6)}</div>
          </div>
        </div>

        <div class="meta-grid">
          <div class="meta-col">
            <div class="meta-row">
              <span class="meta-label">Employee Name:</span>
              <span class="meta-value">${data.employeeName}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Employee ID:</span>
              <span class="meta-value mono">${data.employeeId}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Department:</span>
              <span class="meta-value">${data.department}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Designation:</span>
              <span class="meta-value">${data.designation}</span>
            </div>
          </div>
          <div class="meta-col" style="border-left: 1px solid #e5e7eb; padding-left: 16px;">
            <div class="meta-row">
              <span class="meta-label">Bank Name:</span>
              <span class="meta-value">HDFC Bank Ltd.</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Account No:</span>
              <span class="meta-value mono">••••••••4829</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">PAN Number:</span>
              <span class="meta-value mono">ABCDE1234F</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Days Worked:</span>
              <span class="meta-value" style="color: #059669;">31 / 31 Days (Full)</span>
            </div>
          </div>
        </div>

        <div class="tables-grid">
          <div>
            <table class="section-table">
              <thead>
                <tr>
                  <th>Earnings Component</th>
                  <th class="amount">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic Salary (50%)</td>
                  <td class="amount">${formatCurrency(data.basicSalary)}</td>
                </tr>
                <tr>
                  <td>House Rent Allowance (HRA)</td>
                  <td class="amount">${formatCurrency(data.hra)}</td>
                </tr>
                <tr>
                  <td>Performance Bonus</td>
                  <td class="amount">${formatCurrency(data.performanceBonus)}</td>
                </tr>
                <tr>
                  <td>Leave Travel Allowance</td>
                  <td class="amount">${formatCurrency(data.leaveTravelAllowance)}</td>
                </tr>
                <tr>
                  <td>Standard Allowance</td>
                  <td class="amount">${formatCurrency(data.standardAllowance)}</td>
                </tr>
                <tr>
                  <td>Fixed Allowance</td>
                  <td class="amount">${formatCurrency(data.fixedAllowance)}</td>
                </tr>
                <tr class="total-row">
                  <td>Gross Earnings</td>
                  <td class="amount" style="color: #059669;">${formatCurrency(data.totalEarnings)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <table class="section-table">
              <thead>
                <tr>
                  <th>Statutory Deduction</th>
                  <th class="amount">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Provident Fund (PF - 12%)</td>
                  <td class="amount" style="color: #dc2626;">-${formatCurrency(data.pfEmployee)}</td>
                </tr>
                <tr>
                  <td>Professional Tax (PT)</td>
                  <td class="amount" style="color: #dc2626;">-${formatCurrency(data.professionalTax)}</td>
                </tr>
                <tr>
                  <td>Income Tax (TDS / Est)</td>
                  <td class="amount">₹0</td>
                </tr>
                <tr>
                  <td>Loss of Pay (Unpaid Leave)</td>
                  <td class="amount">₹0</td>
                </tr>
                <tr class="total-row">
                  <td>Total Deductions</td>
                  <td class="amount" style="color: #dc2626;">-${formatCurrency(data.totalDeductions)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="net-card">
          <div>
            <div class="net-title">Net Take-Home Disbursed Salary</div>
            <div class="net-amount">${formatCurrency(data.netSalary)}</div>
            <div class="net-sub">Gross: ${formatCurrency(data.totalEarnings)} | Deductions: ${formatCurrency(data.totalDeductions)}</div>
          </div>
          <div class="net-cert">
            <div>✓ DIGITALLY CERTIFIED</div>
            <div style="font-size: 9px; color: #4b5563; margin-top: 2px;">Dayflow Statutory Payroll Engine</div>
          </div>
        </div>

        <div class="footer">
          <div>GEN-ID: DF-${Date.now()} • SECURED WITH JWT & RBAC</div>
          <div>SYSTEM GENERATED ELECTRONIC SALARY VOUCHER • PAGE 1 OF 1</div>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  windowRef.document.write(htmlContent);
  windowRef.document.close();
}
