export interface PayslipPdfData {
  employeeName: string;
  employeeId: string;
  department: string;
  designation: string;
  month: string;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  paymentDate: string;
  status: string;
}

export function generatePayslipPdf(data: PayslipPdfData): void {
  const windowRef = window.open('', '_blank');
  if (!windowRef) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Dayflow_Payslip_${data.employeeId}_${data.month}_${data.year}</title>
      <style>
        @page { size: A4; margin: 20mm; }
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; line-height: 1.5; padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #111; padding-bottom: 15px; margin-bottom: 25px; }
        .brand { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .subtitle { font-size: 10px; text-transform: uppercase; color: #666; font-family: monospace; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .meta-card { background: #f9f9f9; border: 1px solid #eee; border-radius: 6px; padding: 15px; }
        .meta-title { font-size: 10px; font-weight: 700; color: #888; text-transform: uppercase; margin-bottom: 6px; }
        .meta-value { font-size: 14px; font-weight: 700; color: #111; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f4f4f4; font-size: 11px; text-transform: uppercase; color: #555; font-weight: 700; }
        td { font-size: 13px; }
        .total-row { font-weight: 800; font-size: 16px; background: #f9f9f9; border-top: 2px solid #111; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px dashed #ccc; display: flex; justify-content: space-between; font-size: 10px; color: #777; font-family: monospace; }
        @media print {
          body { padding: 0; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div style="margin-bottom: 20px; text-align: right;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #111; color: #fff; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">PRINT / SAVE PDF</button>
      </div>

      <div class="header">
        <div>
          <div class="brand">DAYFLOW HRMS</div>
          <div class="subtitle">Official Payroll Disbursement Voucher</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 18px; font-weight: 800; color: #222;">CONFIDENTIAL PAYSLIP</div>
          <div style="font-size: 12px; color: #555;">PERIOD: ${data.month.toUpperCase()} ${data.year}</div>
        </div>
      </div>

      <div class="meta-grid">
        <div class="meta-card">
          <div class="meta-title">Employee Details</div>
          <div class="meta-value">${data.employeeName}</div>
          <div style="font-size: 12px; color: #555; margin-top: 4px;">ID: ${data.employeeId}</div>
          <div style="font-size: 12px; color: #555;">Dept: ${data.department}</div>
          <div style="font-size: 12px; color: #555;">Role: ${data.designation}</div>
        </div>
        <div class="meta-card">
          <div class="meta-title">Disbursement Information</div>
          <div class="meta-value">Status: ${data.status.toUpperCase()}</div>
          <div style="font-size: 12px; color: #555; margin-top: 4px;">Payment Date: ${data.paymentDate}</div>
          <div style="font-size: 12px; color: #555;">Currency: INR (₹)</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Earnings (₹)</th>
            <th>Deductions (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Basic Salary</td>
            <td>₹${data.baseSalary.toLocaleString('en-IN')}</td>
            <td>—</td>
          </tr>
          <tr>
            <td>HRA & Standard Allowances</td>
            <td>₹${data.allowances.toLocaleString('en-IN')}</td>
            <td>—</td>
          </tr>
          <tr>
            <td>PF & Statutory Tax Deductions</td>
            <td>—</td>
            <td>₹${data.deductions.toLocaleString('en-IN')}</td>
          </tr>
          <tr class="total-row">
            <td>NET PAYABLE SALARY</td>
            <td colspan="2" style="text-align: right; color: #000;">₹${data.netPay.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>

      <div class="footer">
        <div>GEN-ID: DF-${Date.now()} &bull; SECURED WITH JWT & RBAC</div>
        <div>DAYFLOW HRMS V3.0 SYSTEM GENERATED DOCUMENT</div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 500);
        };
      </script>
    </body>
    </html>
  `;

  windowRef.document.write(htmlContent);
  windowRef.document.close();
}
