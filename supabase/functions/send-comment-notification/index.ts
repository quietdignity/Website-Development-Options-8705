import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestData = await req.json()
    
    console.log('📧 Processing comment notification:', {
      type: requestData.type || 'new_comment',
      author: requestData.author_name,
      postTitle: requestData.postTitle
    })

    let emailHtml = ''
    let subject = ''

    if (requestData.type === 'approval') {
      // Approval notification to commenter
      subject = `Your comment on "${requestData.postTitle}" has been approved!`
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .comment-box { background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2563eb; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✅ Comment Approved!</h1>
            <p>Workplace Mapping Blog</p>
          </div>
          <div class="content">
            <p>Hi ${requestData.comment.author_name},</p>
            
            <p>Great news! Your comment on "<strong>${requestData.postTitle}</strong>" has been approved and is now live on our blog.</p>
            
            <div class="comment-box">
              <p><strong>Your comment:</strong></p>
              <p>${requestData.comment.content}</p>
            </div>
            
            <p>Thank you for contributing to our discussion! Feel free to continue engaging with our content.</p>
            
            <p>Best regards,<br>
            James A. Brown<br>
            Workplace Mapping</p>
          </div>
        </body>
        </html>
      `
    } else {
      // New comment notification to admin
      subject = `🔔 New ${requestData.isReply ? 'Reply' : 'Comment'} on "${requestData.postTitle}"`
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .comment-box { background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2563eb; }
            .actions { background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .button { background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>💬 New ${requestData.isReply ? 'Reply' : 'Comment'} Notification</h1>
            <p>Workplace Mapping Blog</p>
          </div>
          <div class="content">
            <h2>📋 Comment Details</h2>
            <p><strong>Post:</strong> ${requestData.postTitle}</p>
            <p><strong>Type:</strong> ${requestData.isReply ? 'Reply to existing comment' : 'New top-level comment'}</p>
            <p><strong>Author:</strong> ${requestData.author_name}</p>
            <p><strong>Email:</strong> ${requestData.author_email}</p>
            ${requestData.author_website ? `<p><strong>Website:</strong> <a href="${requestData.author_website}">${requestData.author_website}</a></p>` : ''}
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            
            <div class="comment-box">
              <h3>💬 Comment Content</h3>
              <p>${requestData.content.replace(/\n/g, '<br>')}</p>
            </div>
            
            <div class="actions">
              <h3>⚡ Quick Actions</h3>
              <p>
                <a href="https://workplacemapping.com/admin" class="button">
                  🔧 Moderate Comments
                </a>
                <a href="mailto:${requestData.author_email}?subject=Re: Your comment on ${requestData.postTitle}" class="button" style="background: #10b981;">
                  📧 Reply to ${requestData.author_name}
                </a>
              </p>
            </div>
            
            <p><strong>Status:</strong> This comment is pending moderation. Visit the admin panel to approve, reject, or mark as spam.</p>
          </div>
        </body>
        </html>
      `
    }

    // For demo purposes, just log the email (in production, send via SMTP/email service)
    console.log('Email would be sent:', {
      to: requestData.type === 'approval' ? requestData.comment.author_email : 'james@workplacemapping.com',
      subject,
      htmlPreview: emailHtml.substring(0, 200) + '...'
    })

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Comment notification processed successfully',
        emailSent: true, // In production, this would be the actual result
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in send-comment-notification function:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        emailSent: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})