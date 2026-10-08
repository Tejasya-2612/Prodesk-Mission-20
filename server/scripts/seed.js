import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import Invoice from '../src/models/Invoice.js';
import Payment from '../src/models/Payment.js';

if (process.env.NODE_ENV === 'production') throw new Error('Seed script is disabled in production.');
await mongoose.connect(process.env.MONGODB_URI);
const clients = [];
const demoClients = [
  { name: 'Alex Morgan', email: 'alex@northstar.example', company: 'Northstar Group' },
  { name: 'Maya Chen', email: 'maya@apex.example', company: 'Apex Ventures' },
  { name: 'Liam Patel', email: 'liam@meridian.example', company: 'Meridian Labs' },
];
for (const client of demoClients) {
  clients.push(await User.findOneAndUpdate(
    { email: client.email },
    { $set: { ...client, password: await bcrypt.hash('ClientDemo123!', 12), role: 'client' } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ));
}
const adminEmail = process.env.ADMIN_EMAIL || 'admin@vaultpay.demo';
const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeThisDemoPassword123!';
const admin = await User.findOneAndUpdate(
  { email: adminEmail },
  { $set: { name: 'VaultPay Administrator', email: adminEmail, password: await bcrypt.hash(adminPassword, 12), role: 'admin', company: 'Nexus Corporate Services' } },
  { upsert: true, new: true, setDefaultsOnInsert: true },
);
const today = new Date();
const monthsAgo = count => new Date(today.getFullYear(), today.getMonth() - count, today.getDate());
const rows = [
  ['VP-2026-041', 'Quarterly Advisory Retainer', 'Q3 finance and strategic advisory services', 12800, 0, 0, 'paid'],
  ['VP-2026-042', 'Treasury Optimization', 'Cash management assessment and recommendations', 6450, 0, 14, 'pending'],
  ['VP-2026-043', 'Implementation Services', 'VaultPay onboarding and workflow configuration', 9200, 0, -9, 'overdue'],
  ['VP-2026-044', 'Compliance Review', 'Annual controls and compliance review', 7800, 1, 10, 'pending'],
  ['VP-2026-045', 'Platform Support', 'Premium support and maintenance', 3200, 2, 2, 'paid'],
  ['VP-2026-046', 'Data Migration', 'Financial records migration and validation', 5100, 1, 18, 'pending'],
  ['VP-2026-047', 'Business Continuity Review', 'Operational resilience consulting', 4300, 2, -5, 'overdue'],
];
for (let index = 0; index < rows.length; index += 1) {
  const [invoiceNumber, title, description, amount, clientIndex, dueOffset, status] = rows[index];
  const issueDate = monthsAgo(index % 4);
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + 30 + dueOffset);
  const paidAt = status === 'paid' ? monthsAgo(index % 2) : null;
  const invoice = await Invoice.findOneAndUpdate(
    { invoiceNumber },
    { $set: { invoiceNumber, title, description, amount, currency: 'USD', clientId: clients[clientIndex]._id, createdBy: admin._id, issueDate, dueDate, status, paidAt } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  if (status === 'paid') {
    const sessionId = `demo_${invoiceNumber}`;
    await Payment.findOneAndUpdate(
      { stripeSessionId: sessionId },
      { $set: { invoiceId: invoice._id, clientId: clients[clientIndex]._id, amount, currency: 'USD', stripeSessionId: sessionId, stripePaymentIntentId: `demo_pi_${invoiceNumber}`, status: 'paid', paidAt } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }
}
console.info(`Seeded or refreshed demo accounts for ${adminEmail}; client password: ClientDemo123!.`);
await mongoose.disconnect();
