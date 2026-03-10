// ! ||--------------------------------------------------------------------------------||
// ! ||                                Email Controller                                ||
// ! ||--------------------------------------------------------------------------------||

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ! ||--------------------------------------------------------------------------------||
// ! ||                                Helper for Item Rows                            ||
// ! ||--------------------------------------------------------------------------------||
const renderItems = (items, isHindi = false) => items.map(item => `
  <tr>
    <td style="padding: 15px 0; border-bottom: 1px solid #e0f2fe;">
      <div style="color: #0369a1; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
        ${item.bottleId?.name || (isHindi ? 'गंगा जल' : 'Ganga Water')}
      </div>
      <div style="color: #94a3b8; font-size: 11px; margin-top: 4px;">
        ${isHindi ? 'साइज़' : 'Size'}: ${item.size} | ${isHindi ? 'मूल्य' : 'Price'}: ₹${item.priceAtPurchase}
      </div>
    </td>
    <td style="padding: 15px 0; border-bottom: 1px solid #e0f2fe; text-align: right; vertical-align: middle;">
      <div style="font-weight: 900; color: #0c4a6e; font-size: 15px;">
        ${isHindi ? 'मात्रा' : 'Qty'}: ${item.quantity} <span style="margin-left:8px; color:#0369a1;">₹${item.priceAtPurchase * item.quantity}</span>
      </div>
    </td>
  </tr>
`).join('');

// ! ||--------------------------------------------------------------------------------||
// ! ||                           SENDING MAIL TO CUSTOMER                             ||
// ! ||--------------------------------------------------------------------------------||
export const sendCustomerEmail = async (orderData, userEmail, userName) => {
  const orderID = orderData._id.toString().slice(-6).toUpperCase();

  const mailOptions = {
    from: `"Kantam Source" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Order Logged / ऑर्डर दर्ज हुआ - #KANTAM-${orderID}`,
    html: `
      <div style="background-color: #f0f9ff; padding: 50px 10px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <table align="center" width="100%" style="max-width: 600px; background: white; border-radius: 32px; border: 1px solid #e0f2fe; box-shadow: 0 20px 40px rgba(3,105,161,0.08); overflow: hidden;">
          
          <tr>
            <td style="padding: 40px 40px 10px 40px; text-align: center;">
              <h2 style="margin: 0; color: #0369a1; text-transform: uppercase; letter-spacing: 8px; font-size: 24px; font-weight: 900;">Kantam</h2>
              <p style="margin: 5px 0 0 0; color: #38bdf8; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; font-weight: 700;">The Ganga Water / गंगा जल</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 40px;">
              <div style="background: #f8fafc; padding: 25px; border-radius: 20px; border-left: 5px solid #0369a1;">
                <h3 style="margin: 0; color: #0369a1; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Order ID: #KANTAM-${orderID}</h3>
                <p style="margin: 10px 0 0 0; color: #475569; font-size: 14px; line-height: 1.6;">
                  <b>Radhe Radhe</b> ${userName},<br> your request has been logged. Please keep this Order ID for any future support.
                </p>
              </div>
              <table width="100%" style="margin-top: 20px;">${renderItems(orderData.items)}</table>
              <div style="text-align: right; padding: 20px 0; color: #0369a1;">
                <span style="font-size: 12px; font-weight: 700;">TOTAL: </span>
                <span style="font-size: 28px; font-weight: 900;">₹${orderData.totalAmount}</span>
              </div>
            </td>
          </tr>

          <tr><td style="text-align: center; padding: 20px; color: #cbd5e1; font-size: 20px;">❈</td></tr>

          <tr>
            <td style="padding: 20px 40px;">
              <div style="background: #f0f9ff; padding: 25px; border-radius: 20px; border-left: 5px solid #38bdf8;">
                <h3 style="margin: 0; color: #0369a1; font-size: 15px;">ऑर्डर आईडी: #KANTAM-${orderID}</h3>
                <p style="margin: 10px 0 0 0; color: #475569; font-size: 15px; line-height: 1.8;">
                  <b>राधे राधे</b> ${userName},<br> आपका ऑर्डर दर्ज कर लिया गया है। सहायता के लिए कृपया इस ऑर्डर आईडी को सुरक्षित रखें।
                </p>
              </div>
              <table width="100%" style="margin-top: 20px;">${renderItems(orderData.items, true)}</table>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px; background: #f8fafc; text-align: center; border-bottom-left-radius: 32px; border-bottom-right-radius: 32px;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8; font-style: italic;">"Pure from the Source, Direct to your Soul."</p>
            </td>
          </tr>
        </table>
      </div>`
  };
  return transporter.sendMail(mailOptions);
};

// ! ||--------------------------------------------------------------------------------||
// ! ||                           SENDING MAIL TO SELLER                               ||
// ! ||--------------------------------------------------------------------------------||
export const sendSellerEmail = async (orderData, sellerEmail, customerName) => {
  const sellerItems = orderData.items.map(item => `
    <tr style="background: #ffffff;">
      <td style="padding: 15px; border: 1px solid #e0f2fe; font-size: 13px; color: #0c4a6e;"><b>${item.bottleId?.name}</b></td>
      <td style="padding: 15px; border: 1px solid #e0f2fe; text-align: center; font-size: 13px;">${item.quantity}</td>
      <td style="padding: 15px; border: 1px solid #e0f2fe; text-align: right; font-weight: 800; color: #0369a1;">₹${item.priceAtPurchase * item.quantity}</td>
    </tr>`).join('');

  const mailOptions = {
    from: `"Kantam Admin" <${process.env.EMAIL_USER}>`,
    to: sellerEmail,
    subject: `NEW ORDER ALERT - ${customerName}`,
    html: `
      <div style="background: #f1f5f9; padding: 40px 10px; font-family: sans-serif;">
        <table align="center" width="100%" style="max-width: 600px; background: white; border-radius: 24px; border: 1px solid #cbd5e1; overflow: hidden;">
          <tr>
            <td style="background: #0369a1; padding: 30px; text-align: center; color: white;">
              <h2 style="margin: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 18px;">Radhe Radhe - New Order</h2>
              <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">Action Required: Logistics & Dispatch</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569;">You have received a new <b>COD</b> order from <b>${customerName}</b>.</p>
              <table width="100%" style="border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background: #f8fafc; color: #0369a1; font-size: 11px; text-transform: uppercase;">
                  <th style="padding: 12px; border: 1px solid #e0f2fe; text-align: left;">Product</th>
                  <th style="padding: 12px; border: 1px solid #e0f2fe;">Qty</th>
                  <th style="padding: 12px; border: 1px solid #e0f2fe; text-align: right;">Total</th>
                </tr>
                ${sellerItems}
              </table>
              <div style="background: #fff5f5; border: 1px solid #fee2e2; padding: 20px; border-radius: 12px;">
                <p style="margin: 0; font-size: 13px; color: #1e293b; line-height: 1.5;">
                  <b>Phone:</b> ${orderData.shippingAddress.phone}<br>
                  <b>Address:</b> ${orderData.shippingAddress.street}, ${orderData.shippingAddress.city}
                </p>
              </div>
            </td>
          </tr>
        </table>
      </div>`
  };
  return transporter.sendMail(mailOptions);
};