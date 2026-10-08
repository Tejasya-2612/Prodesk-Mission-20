import nodemailer from 'nodemailer';
export async function sendReceipt(client, invoice, payment, pdf) {
 if(!process.env.SMTP_HOST) { console.info('Receipt email skipped: SMTP is not configured.'); return; }
 const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:Number(process.env.SMTP_PORT)===465,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});
 try { await transport.sendMail({from:process.env.EMAIL_FROM,to:client.email,subject:`Payment receipt · ${invoice.invoiceNumber}`,text:`Hello ${client.name},\n\nWe received ${new Intl.NumberFormat('en-US',{style:'currency',currency:invoice.currency}).format(invoice.amount)} for invoice ${invoice.invoiceNumber}. Transaction reference: ${payment.stripePaymentIntentId||payment.stripeSessionId}.\n\nThank you,\nNexus Corporate Services`,attachments:[{filename:`${invoice.invoiceNumber}-receipt.pdf`,content:pdf}]}); console.info(`Receipt email delivered for ${invoice.invoiceNumber}.`); }
 catch(error){ console.error(`Receipt email failed for ${invoice.invoiceNumber}: ${error.message}`); }
}
