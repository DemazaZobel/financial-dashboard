import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

const sql = postgres("postgresql://postgres:password@localhost:5432/financial_dashboard");


// Seed Users
async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await sql`
      INSERT INTO users (id, name, email, password)
      VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

// Seed Customers
async function seedCustomers() {
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  for (const customer of customers) {
    await sql`
      INSERT INTO customers (id, name, email, image_url)
      VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

// Seed Invoices
async function seedInvoices() {
  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  for (const invoice of invoices) {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

// Seed Revenue
async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) PRIMARY KEY,
      revenue INT NOT NULL
    );
  `;

  for (const rev of revenue) {
    await sql`
      INSERT INTO revenue (month, revenue)
      VALUES (${rev.month}, ${rev.revenue})
      ON CONFLICT (month) DO NOTHING;
    `;
  }
}

// Main Seeder
async function main() {
  try {
    console.log('Seeding users...');
    await seedUsers();

    console.log('Seeding customers...');
    await seedCustomers();

    console.log('Seeding invoices...');
    await seedInvoices();

    console.log('Seeding revenue...');
    await seedRevenue();

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

main();
