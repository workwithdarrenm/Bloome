import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabase'
import { resend, buildEmailHtml } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { bouquetName, placedFlowers, note, recipientName, recipientEmail, senderName } = body

    if (!recipientEmail) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 })
    }

    const id = uuidv4()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const bouquetUrl = `${baseUrl}/bouquet/${id}`

    // Save to Supabase
    const { error: dbError } = await supabase.from('bouquets').insert({
      id,
      bouquet_name: bouquetName || 'A bouquet for you',
      flowers: placedFlowers,
      note: note || '',
      recipient_name: recipientName,
      recipient_email: recipientEmail,
      sender_name: senderName || 'Someone',
    })

    if (dbError) {
      console.error('Supabase error:', dbError)
      return NextResponse.json({ error: 'Failed to save bouquet' }, { status: 500 })
    }

    // Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: recipientEmail,
      subject: `${senderName || 'Someone'} sent you a bouquet!`,
      html: buildEmailHtml(senderName || 'Someone', bouquetName || 'A bouquet for you', bouquetUrl),
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      // Don't fail the request — bouquet is saved, email delivery is best-effort
    }

    return NextResponse.json({ id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
