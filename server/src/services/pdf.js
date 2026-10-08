import PDFDocument from 'pdfkit';
export function createDocument(invoice, client, payment=null) {
 return new Promise((resolve,reject)=>{
  const doc=new PDFDocument({margin:54,size:'A4'}); const chunks=[];
  doc.on('data',c=>chunks.push(c)); doc.on('end',()=>resolve(Buffer.concat(chunks))); doc.on('error',reject);
  const navy='#14243A', blue='#315F91', slate='#64748B';
  doc.rect(0,0,doc.page.width,112).fill(navy); doc.fillColor('#FFFFFF').fontSize(11).text('NEXUS CORPORATE SERVICES',54,34,{characterSpacing:1.3});
  doc.fontSize(25).font('Helvetica-Bold').text(payment?'PAYMENT RECEIPT':'INVOICE',54,57); doc.fillColor(navy).fontSize(16).text(invoice.invoiceNumber,54,140);
  doc.fillColor(slate).fontSize(10).text(`Issued ${new Date(invoice.issueDate).toLocaleDateString()}   ·   Due ${new Date(invoice.dueDate).toLocaleDateString()}`,54,168);
  doc.fillColor(navy).fontSize(11).font('Helvetica-Bold').text('BILLED TO',54,214); doc.font('Helvetica').fontSize(11).text(client.name,54,234).text(client.company||'Individual client',54,251).text(client.email,54,268);
  doc.moveTo(54,310).lineTo(541,310).strokeColor('#D9E1EA').stroke(); doc.fillColor(navy).font('Helvetica-Bold').text(invoice.title,54,332); doc.fillColor(slate).font('Helvetica').fontSize(10).text(invoice.description,54,354,{width:350});
  doc.fillColor(navy).fontSize(11).font('Helvetica-Bold').text('AMOUNT DUE',390,332,{width:151,align:'right'}); doc.fontSize(18).text(new Intl.NumberFormat('en-US',{style:'currency',currency:invoice.currency}).format(invoice.amount),365,354,{width:176,align:'right'});
  doc.moveTo(54,407).lineTo(541,407).strokeColor('#D9E1EA').stroke(); doc.fillColor(blue).fontSize(11).font('Helvetica-Bold').text(`STATUS  ${payment?'PAID':invoice.status.toUpperCase()}`,54,431);
  if(payment){ doc.fillColor(slate).font('Helvetica').fontSize(10).text(`Paid ${new Date(payment.paidAt).toLocaleString()}   ·   Transaction ${payment.stripePaymentIntentId||payment.stripeSessionId}`,54,455,{width:480}); doc.save().rotate(-16,{origin:[440,545]}).fillColor('#16805D').opacity(0.13).fontSize(42).font('Helvetica-Bold').text('PAID',370,550).restore(); }
  if(invoice.notes){doc.fillColor(slate).fontSize(9).text(`Notes: ${invoice.notes}`,54,510,{width:470});}
  doc.fillColor(slate).fontSize(8).text('Nexus Corporate Services  ·  VaultPay secure billing',54,doc.page.height-55,{align:'center',width:487}); doc.end();
 });
}
