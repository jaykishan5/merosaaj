import { formatPrice } from "./utils";

const BRAND_COLOR = "#000000";
const ACCENT_COLOR = "#000000"; // Assuming black/white premium brand

const commonStyles = `
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; mx-auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { font-size: 28px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; font-style: italic; }
    .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #999; }
    .card { background: #f9f9f9; padding: 30px; border-radius: 20px; border: 1px solid #eee; }
    .button { display: inline-block; padding: 15px 30px; background: ${BRAND_COLOR}; color: #fff; text-decoration: none; border-radius: 12px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
    .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .total { margin-top: 20px; padding-top: 20px; border-top: 2px solid #333; font-weight: 900; font-size: 18px; }
`;

export const getOrderEmailTemplate = (order: any) => {
    const itemsHtml = order.orderItems.map((item: any) => `
        <div style="display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #eee;">
            <div style="flex: 1;">
                <div style="font-weight: bold; font-size: 14px; text-transform: uppercase;">${item.name}</div>
                <div style="font-size: 12px; color: #666;">QTY: ${item.quantity} | SIZE: ${item.size}</div>
            </div>
            <div style="font-weight: bold;">${formatPrice((item.discountPrice || item.price) * item.quantity)}</div>
        </div>
    `).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head><style>${commonStyles}</style></head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">MeroSaaj<span style="color: #000;">.</span></div>
                </div>
                
                <div class="card">
                    <h1 style="text-transform: uppercase; letter-spacing: -1px; margin-top: 0;">Order Confirmed!</h1>
                    <p>Hi ${order.shippingAddress.fullName},</p>
                    <p>Thank you for your order. We've received it and are preparing it for shipment.</p>
                    
                    <div style="margin: 30px 0;">
                        <h3 style="text-transform: uppercase; font-size: 12px; letter-spacing: 1px; color: #999;">Order Summary #${order._id.toString().substring(0, 8).toUpperCase()}</h3>
                        ${itemsHtml}
                        
                        <div class="total">
                            <div style="display: flex; justify-content: space-between;">
                                <span>TOTAL</span>
                                <span>${formatPrice(order.totalPrice)}</span>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="text-transform: uppercase; font-size: 12px; letter-spacing: 1px; color: #999;">Shipping To</h3>
                        <p style="margin: 5px 0; font-weight: bold;">${order.shippingAddress.fullName}</p>
                        <p style="margin: 5px 0; color: #666;">${order.shippingAddress.address}, ${order.shippingAddress.city}</p>
                        <p style="margin: 5px 0; color: #666;">${order.shippingAddress.phone}</p>
                    </div>

                    <div style="text-align: center;">
                        <a href="${process.env.NEXTAUTH_URL}/profile/orders" class="button">View Order Details</a>
                    </div>
                </div>

                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} MeroSaaj. All rights reserved.</p>
                    <p>Nepal's Finest Curated Style.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

export const getShippingUpdateTemplate = (order: any) => {
    return `
        <!DOCTYPE html>
        <html>
        <head><style>${commonStyles}</style></head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">MeroSaaj<span style="color: #000;">.</span></div>
                </div>
                
                <div class="card">
                    <h1 style="text-transform: uppercase; letter-spacing: -1px; margin-top: 0;">Your Order is ${order.status}!</h1>
                    <p>Hi ${order.shippingAddress.fullName},</p>
                    <p>Exciting news! Your order <strong>#${order._id.toString().substring(0, 8).toUpperCase()}</strong> status has been updated to <strong>${order.status}</strong>.</p>
                    
                    ${order.status === 'Shipped' ? `
                        <p>Our courier partner is on their way. Please keep your phone reachable for delivery.</p>
                    ` : ''}

                    <div style="margin: 30px 0; text-align: center;">
                        <a href="${process.env.NEXTAUTH_URL}/profile/orders" class="button">Track My Order</a>
                    </div>
                </div>

                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} MeroSaaj. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};
