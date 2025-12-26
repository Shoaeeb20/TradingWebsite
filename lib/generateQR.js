// UPI QR Code Generator for Algo Trading Subscription
// UPI ID: oshoaeeb@oksbi
// Merchant: Shoaeeb Osman
// Amount: ₹199

const upiUrl = `upi://pay?pa=oshoaeeb@oksbi&pn=Shoaeeb%20Osman&am=199&cu=INR&tn=Algo%20Trading%20Pro%20Subscription`

console.log('UPI Payment URL:', upiUrl)
console.log('QR Code can be generated using: https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(upiUrl))