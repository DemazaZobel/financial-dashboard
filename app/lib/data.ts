// app/lib/data.ts
import postgres from 'postgres';
import { formatCurrency } from './utils';
import { Revenue, LatestInvoiceRaw, InvoiceData } from './definitions'; // adjust types if you have them

// connect to Postgres
const sql = postgres("postgresql://postgres:password@localhost:5432/financial_dashboard");

export async function fetchRevenue(): Promise<Revenue[]> {
  try {
    const data: Revenue[] = await sql<Revenue[]>`SELECT * FROM revenue ORDER BY month`;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices(): Promise<LatestInvoiceRaw[]> {
  try {
    const data: LatestInvoiceRaw[] = await sql<LatestInvoiceRaw[]>`
      SELECT i.id, i.amount, c.name, c.email, c.image_url
      FROM invoices i
      JOIN customers c ON i.customer_id = c.id
      ORDER BY i.date DESC
      LIMIT 5
    `;

    return data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    const [invoiceCountRes, customerCountRes, invoiceStatusRes] = await Promise.all([
      sql`SELECT COUNT(*) FROM invoices`,
      sql`SELECT COUNT(*) FROM customers`,
      sql`
        SELECT
          SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid,
          SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending
        FROM invoices
      `,
    ]);

    const numberOfInvoices = Number(invoiceCountRes[0].count ?? 0);
    const numberOfCustomers = Number(customerCountRes[0].count ?? 0);
    const totalPaidInvoices = formatCurrency(invoiceStatusRes[0].paid ?? 0);
    const totalPendingInvoices = formatCurrency(invoiceStatusRes[0].pending ?? 0);

    return { numberOfInvoices, numberOfCustomers, totalPaidInvoices, totalPendingInvoices };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}
