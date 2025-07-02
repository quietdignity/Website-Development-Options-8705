import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Use Resend API for reliable email delivery
const RESEND_API_KEY = 'your-resend-api-key' // Will be set via environment variables

async function sendEmailViaResend(emailData: any) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Workplace Mapping <noreply@workplacemapping.com>',
        to: ['james@workplacemapping.com'],
        reply_to: emailData.email,
        subject: `🔔 New ${emailData.inquiryType} from ${emailData.name}`,
        html: createEmailHTML(emailData)
      }),
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Email sent successfully via Resend:', result.id)
      return { success: true, id: result.id }
    } else {
      console.error('❌ Resend API error:', result)
      return { success: false, error: result }
    }
  } catch (error) {
    console.error('❌ Resend request failed:', error)
    return { success: false, error: error.message }
  }
}

async function sendEmailViaFormspree(emailData: any) {
  try {
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: emailData.name,
        email: emailData.email,
        company: emailData.company,
        title: emailData.title,
        phone: emailData.phone,
        inquiryType: emailData.inquiryType,
        message: emailData.message,
        subject: `New ${emailData.inquiryType} from ${emailData.name}`,
        _replyto: emailData.email
      }),
    })

    if (response.ok) {
      console.log('✅ Email sent successfully via Formspree')
      return { success: true, service: 'formspree' }
    } else {
      console.error('❌ Formspree error:', response.status)
      return { success: false, error: `Formspree error: ${response.status}` }
    }
  } catch (error) {
    console.error('❌ Formspree request failed:', error)
    return { success: false, error: error.message }
  }
}

// Fallback: Use Netlify Forms
async function sendEmailViaNetlify(emailData: any) {
  try {
    const formData = new FormData()
    formData.append('form-name', 'contact')
    formData.append('name', emailData.name)
    formData.append('email', emailData.email)
    formData.append('company', emailData.company)
    formData.append('title', emailData.title)
    formData.append('phone', emailData.phone)
    formData.append('inquiryType', emailData.inquiryType)
    formData.append('message', emailData.message)

    const response = await fetch('https://workplacemapping.netlify.app/', {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      console.log('✅ Email sent successfully via Netlify Forms')
      return { success: true, service: 'netlify' }
    } else {
      console.error('❌ Netlify Forms error:', response.status)
      return { success: false, error: `Netlify error: ${response.status}` }
    }
  } catch (error) {
    console.error('❌ Netlify Forms request failed:', error)
    return { success: false, error: error.message }
  }
}

function createEmailHTML(data: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { background: #f9f9f9; margin: 15px 0; padding: 15px; border-radius: 8px; }
        .label { font-weight: bold; color: #2563eb; }
        .priority { background: #fef3c7; border-left: 4px solid #f59e0b; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔔 New Contact Form Submission</h1>
        <p>Workplace Mapping Website</p>
      </div>
      <div class="content">
        <div class="section priority">
          <h2>🎯 Inquiry Details</h2>
          <p><span class="label">Type:</span> ${data.inquiryType}</p>
          <p><span class="label">Submitted:</span> ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="section">
          <h2>👤 Contact Information</h2>
          <p><span class="label">Name:</span> ${data.name}</p>
          <p><span class="label">Email:</span> ${data.email}</p>
          <p><span class="label">Phone:</span> ${data.phone}</p>
          <p><span class="label">Company:</span> ${data.company}</p>
          <p><span class="label">Title:</span> ${data.title}</p>
        </div>
        
        <div class="section">
          <h2>💬 Message</h2>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div class="section">
          <h2>⚡ Quick Actions</h2>
          <p>
            <a href="mailto:${data.email}?subject=Re: ${data.inquiryType}" 
               style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              📧 Reply to ${data.name.split(' ')[0]}
            </a>
            <a href="tel:${data.phone}" 
               style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-left: 10px;">
              📞 Call Now
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestData = await req.json()
    console.log('📧 Processing email request:', {
      name: requestData.name,
      email: requestData.email,
      inquiryType: requestData.inquiryType
    })

    const emailData = {
      name: requestData.name,
      email: requestData.email,
      company: requestData.company,
      title: requestData.title,
      phone: requestData.phone,
      inquiryType: requestData.inquiryType,
      message: requestData.message
    }

    // Try multiple email services in order of preference
    let emailResult = { success: false, error: 'No email service available' }

    // Method 1: Try Resend (most reliable)
    if (RESEND_API_KEY && RESEND_API_KEY !== 'your-resend-api-key') {
      console.log('🔄 Attempting Resend...')
      emailResult = await sendEmailViaResend(emailData)
    }

    // Method 2: Try Formspree (backup)
    if (!emailResult.success) {
      console.log('🔄 Attempting Formspree...')
      emailResult = await sendEmailViaFormspree(emailData)
    }

    // Method 3: Try Netlify Forms (fallback)
    if (!emailResult.success) {
      console.log('🔄 Attempting Netlify Forms...')
      emailResult = await sendEmailViaNetlify(emailData)
    }

    if (emailResult.success) {
      console.log('✅ Email sent successfully!')
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Email sent successfully',
          service: emailResult.service || 'resend',
          timestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      console.error('❌ All email services failed:', emailResult.error)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'All email services failed',
          details: emailResult.error
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

  } catch (error) {
    console.error('❌ Function error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})