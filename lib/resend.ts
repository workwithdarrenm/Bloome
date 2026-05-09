import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export function buildEmailHtml(
  senderName: string,
  bouquetName: string,
  bouquetUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="background:#DFE0DC;font-family:'DM Sans',Arial,sans-serif;margin:0;padding:40px 20px;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#F0D0C8;padding:40px 32px 24px;text-align:center;">
      <p style="font-size:36px;margin:0;">🌸</p>
      <h1 style="font-family:'DM Serif Display',Georgia,serif;font-size:28px;color:#2C2C2A;margin:16px 0 8px;">
        You've received a bouquet
      </h1>
    </div>
    <div style="padding:32px;">
      <p style="font-size:16px;color:#2C2C2A;margin:0 0 8px;">
        <strong>${senderName}</strong> arranged something special for you.
      </p>
      <p style="font-size:16px;color:#2C2C2A;margin:0 0 24px;">
        They called it: <em>"${bouquetName}"</em>
      </p>
      <a href="${bouquetUrl}" style="display:inline-block;background:#2C2C2A;color:#fff;text-decoration:none;padding:14px 28px;border-radius:100px;font-size:15px;font-weight:500;">
        Open your bouquet →
      </a>
    </div>
    <div style="padding:16px 32px 24px;border-top:1px solid #DFE0DC;">
      <p style="font-size:12px;color:#C7C2AB;margin:0;">Sent with Bloome</p>
    </div>
  </div>
</body>
</html>
`
}
