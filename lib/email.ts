import nodemailer from 'nodemailer';

const ADMIN_EMAIL = 'abbasimusa1106@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || ADMIN_EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: {
    title: string;
    type: string;
    price: number;
    printSize?: string;
    frameOption?: string;
  }[];
  total: number;
  shippingAddress?: {
    address: string;
    city: string;
    country: string;
    zip: string;
  };
}

export async function sendOrderNotification(order: OrderEmailData) {
  const itemRows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #333;">${item.title}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #333;">${item.type === 'digital' ? 'Digital Download' : `Print — ${item.printSize || ''} ${item.frameOption ? '/ ' + item.frameOption : ''}`}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #333;text-align:right;">₹${(item.price / 100).toFixed(0)}</td>
        </tr>`
    )
    .join('');

  const shippingHtml = order.shippingAddress
    ? `<div style="margin-top:16px;padding:12px;background:#1a1a1a;border-radius:6px;">
        <strong style="color:#d4af37;">Shipping Address</strong><br/>
        <span style="color:#ccc;">${order.shippingAddress.address}<br/>
        ${order.shippingAddress.city}, ${order.shippingAddress.country} ${order.shippingAddress.zip}</span>
      </div>`
    : '';

  const adminHtml = `
    <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:8px;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#d4af37;font-size:24px;margin:0;">New Order Received!</h1>
      </div>
      <div style="background:#111;padding:16px;border-radius:6px;margin-bottom:16px;">
        <p style="margin:0 0 8px;color:#999;">Order Number</p>
        <p style="margin:0;font-size:18px;font-weight:bold;color:#d4af37;">${order.orderNumber}</p>
      </div>
      <div style="margin-bottom:16px;">
        <p style="margin:0 0 4px;color:#999;">Customer</p>
        <p style="margin:0;color:#fff;">${order.customerName} — ${order.customerEmail}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead>
          <tr style="border-bottom:2px solid #d4af37;">
            <th style="padding:8px 12px;text-align:left;color:#d4af37;">Item</th>
            <th style="padding:8px 12px;text-align:left;color:#d4af37;">Type</th>
            <th style="padding:8px 12px;text-align:right;color:#d4af37;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:12px;font-weight:bold;color:#d4af37;">Total</td>
            <td style="padding:12px;text-align:right;font-weight:bold;font-size:18px;color:#d4af37;">₹${(order.total / 100).toFixed(0)}</td>
          </tr>
        </tfoot>
      </table>
      ${shippingHtml}
      <div style="margin-top:24px;text-align:center;color:#666;font-size:12px;">
        <p>Yacum Art — yacum.art</p>
      </div>
    </div>
  `;

  const customerHtml = `
    <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:8px;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#d4af37;font-size:24px;margin:0;">Thank you for your order!</h1>
        <p style="color:#999;margin:8px 0 0;">Your order has been confirmed</p>
      </div>
      <div style="background:#111;padding:16px;border-radius:6px;margin-bottom:16px;">
        <p style="margin:0 0 8px;color:#999;">Order Number</p>
        <p style="margin:0;font-size:18px;font-weight:bold;color:#d4af37;">${order.orderNumber}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead>
          <tr style="border-bottom:2px solid #d4af37;">
            <th style="padding:8px 12px;text-align:left;color:#d4af37;">Item</th>
            <th style="padding:8px 12px;text-align:right;color:#d4af37;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td style="padding:8px 12px;border-bottom:1px solid #333;">${item.title}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #333;text-align:right;">₹${(item.price / 100).toFixed(0)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td style="padding:12px;font-weight:bold;color:#d4af37;">Total</td>
            <td style="padding:12px;text-align:right;font-weight:bold;font-size:18px;color:#d4af37;">₹${(order.total / 100).toFixed(0)}</td>
          </tr>
        </tfoot>
      </table>
      <div style="margin-top:16px;text-align:center;">
        <a href="https://yacum.art/track-order" style="display:inline-block;padding:12px 24px;background:#d4af37;color:#0a0a0a;text-decoration:none;font-weight:bold;border-radius:4px;">Track Your Order</a>
      </div>
      <div style="margin-top:24px;text-align:center;color:#666;font-size:12px;">
        <p>Yacum Art — yacum.art</p>
      </div>
    </div>
  `;

  try {
    // Send to admin
    await transporter.sendMail({
      from: `"Yacum Art" <${process.env.EMAIL_USER || ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `New Order #${order.orderNumber} — ₹${(order.total / 100).toFixed(0)}`,
      html: adminHtml,
    });

    // Send confirmation to customer
    await transporter.sendMail({
      from: `"Yacum Art" <${process.env.EMAIL_USER || ADMIN_EMAIL}>`,
      to: order.customerEmail,
      subject: `Order Confirmed — #${order.orderNumber}`,
      html: customerHtml,
    });

    console.log(`Order emails sent for #${order.orderNumber}`);
  } catch (err) {
    console.error('Email send error:', err);
    // Don't throw — order is still valid even if email fails
  }
}

interface NewUserData {
  name: string;
  email: string;
  createdAt: Date;
}

export async function sendNewUserNotification(user: NewUserData) {
  const date = new Date(user.createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });

  const html = `
    <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:8px;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#d4af37;font-size:24px;margin:0;">New Customer Signed Up!</h1>
      </div>
      <div style="background:#111;padding:20px;border-radius:6px;">
        <table style="width:100%;">
          <tr>
            <td style="padding:8px 0;color:#999;width:80px;">Name</td>
            <td style="padding:8px 0;color:#fff;font-weight:bold;">${user.name}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#999;">Email</td>
            <td style="padding:8px 0;color:#d4af37;">${user.email}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#999;">Joined</td>
            <td style="padding:8px 0;color:#fff;">${date}</td>
          </tr>
        </table>
      </div>
      <div style="margin-top:24px;text-align:center;color:#666;font-size:12px;">
        <p>Yacum Art — yacum.art</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Yacum Art" <${process.env.EMAIL_USER || ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `New Signup: ${user.name} (${user.email})`,
      html,
    });
    console.log(`Signup notification sent for ${user.email}`);
  } catch (err) {
    console.error('Signup email error:', err);
  }
}

export default transporter;
