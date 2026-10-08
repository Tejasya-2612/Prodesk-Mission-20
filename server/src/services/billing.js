export function toMinorUnits(amount,currency='USD'){
 if(currency!=='USD'||!Number.isFinite(Number(amount))||Number(amount)<=0||!/^\d+(\.\d{1,2})?$/.test(String(amount)))throw new Error('Invalid payment amount or currency.');
 return Math.round(Number(amount)*100);
}
export function checkoutMatchesInvoice(invoice,clientId,session){
 return Boolean(invoice&&session&&String(invoice._id)===session.metadata?.invoiceId&&String(clientId)===String(invoice.clientId?._id||invoice.clientId)&&String(clientId)===session.metadata?.clientId&&session.amount_total===toMinorUnits(invoice.amount,invoice.currency)&&session.currency?.toUpperCase()===invoice.currency);
}
