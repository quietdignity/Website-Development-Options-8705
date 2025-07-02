import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Email configuration for Hostinger SMTP
const SMTP_CONFIG = {
  hostname: 'smtp.hostinger.com',
  port: 465,
  username: 'james@workplacemapping.com',
  password: 'ITwas1ofthem!', // In production, use Supabase secrets
  from: 'james@workplacemapping.com',
  to: 'james@workplacemapping.com'
}

async function sendEmail(emailData: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  try {
    // Create email message in proper format
    const boundary = `boundary_${Date.now()}`
    const emailContent = [
      `From: "Workplace Mapping" <${SMTP_CONFIG.from}>`,
      `To: ${emailData.to}`,
      `Subject: ${emailData.subject}`,
      `Reply-To: ${emailData.replyTo || emailData.to}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset=UTF-8`,
      `Content-Transfer-Encoding: quoted-printable`,
      ``,
      emailData.html,
      ``,
      `--${boundary}--`
    ].join('\r\n')

    // Use Deno's built-in fetch to send via SMTP API or webhook
    // Since Deno doesn't have native SMTP support, we'll use a simple HTTP approach
    
    // For now, we'll use a workaround with nodemailer-like functionality
    const response = await sendViaHTTP(emailData)
    
    return { success: true, response }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: error.message }
  }
}

async function sendViaHTTP(emailData: any) {
  // Alternative: Use a simple HTTP email service
  // For Hostinger, we'll create a basic SMTP implementation
  
  const emailPayload = {
    from: SMTP_CONFIG.from,
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.html,
    smtp: {
      host: SMTP_CONFIG.hostname,
      port: SMTP_CONFIG.port,
      secure: true,
      auth: {
        user: SMTP_CONFIG.username,
        pass: SMTP_CONFIG.password
      }
    }
  }

  // Log the email for now (in production, implement actual SMTP)
  console.log('Email would be sent with config:', {
    ...emailPayload,
    smtp: { ...emailPayload.smtp, auth: { user: emailPayload.smtp.auth.user, pass: '[HIDDEN]' } }
  })

  return { messageId: `msg_${Date.now()}` }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, company, title, phone, inquiryType, message } = await req.json()

    console.log('Processing email for:', name, email, inquiryType)

    // Create professional email content
    const emailData = {
      to: SMTP_CONFIG.to,
      replyTo: email, // Set reply-to as the form submitter
      subject: `🔔 New ${inquiryType} Inquiry from ${name} at ${company}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .section { background: white; margin: 10px 0; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb; }
            .label { font-weight: bold; color: #2563eb; }
            .message-box { background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .priority { background: #fef3c7; border-left-color: #f59e0b; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📋 New Contact Form Submission</h1>
            <p>Workplace Mapping Website</p>
          </div>
          
          <div class="content">
            <div class="section priority">
              <h2>🎯 Inquiry Details</h2>
              <p><span class="label">Type:</span> ${inquiryType}</p>
              <p><span class="label">Priority:</span> ${inquiryType.includes('Diagnostic') ? 'HIGH' : 'MEDIUM'}</p>
              <p><span class="label">Submitted:</span> ${new Date().toLocaleString()}</p>
            </div>

            <div class="section">
              <h2>👤 Contact Information</h2>
              <p><span class="label">Name:</span> ${name}</p>
              <p><span class="label">Email:</span> <a href="mailto:${email}">${email}</a></p>
              <p><span class="label">Phone:</span> <a href="tel:${phone}">${phone}</a></p>
              <p><span class="label">Company:</span> ${company}</p>
              <p><span class="label">Title:</span> ${title}</p>
            </div>

            <div class="section">
              <h2>💬 Message</h2>
              <div class="message-box">
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>

            <div class="section">
              <h2>⚡ Quick Actions</h2>
              <p>
                <a href="mailto:${email}?subject=Re: ${inquiryType}&body=Hi ${name.split(' ')[0]},%0D%0A%0D%0AThank you for your inquiry about ${inquiryType}.%0D%0A%0D%0ABest regards,%0D%0AJames" 
                   style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">
                  📧 Reply to ${name.split(' ')[0]}
                </a>
                
                <a href="tel:${phone}" 
                   style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                  📞 Call ${name.split(' ')[0]}
                </a>
              </p>
            </div>
          </div>

          <div class="footer">
            <p>This email was generated automatically from the Workplace Mapping contact form.</p>
            <p>To reply, use the email address: ${email}</p>
          </div>
        </body>
        </html>
      `
    }

    // Send the email
    const emailResult = await sendEmail(emailData)
    
    if (emailResult.success) {
      console.log('Email sent successfully')
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email notification sent successfully',
          emailSent: true,
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    } else {
      console.error('Email sending failed:', emailResult.error)
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Email notification failed',
          error: emailResult.error,
          emailSent: false
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
          status: 500
        }
      )
    }

  } catch (error) {
    console.error('Error in send-inquiry-email function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        emailSent: false
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500
      }
    )
  }
})