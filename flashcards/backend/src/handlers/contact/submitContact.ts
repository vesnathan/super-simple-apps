/**
 * Contact Form Handler
 *
 * Receives contact form submissions, validates reCAPTCHA,
 * and sends email via SES.
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

import { corsHeaders } from "../../utils/cors";

const sesClient = new SESClient({});

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || "";
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "";
const STAGE = process.env.STAGE || "dev";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  recaptchaToken?: string;
}

interface RecaptchaResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

/**
 * Verify reCAPTCHA v3 token
 */
async function verifyRecaptcha(token: string): Promise<{ valid: boolean; score: number }> {
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn("reCAPTCHA secret key not configured, skipping verification");
    return { valid: true, score: 1.0 };
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = (await response.json()) as RecaptchaResponse;

    if (!data.success) {
      console.error("reCAPTCHA verification failed:", data["error-codes"]);
      return { valid: false, score: 0 };
    }

    // reCAPTCHA v3 returns a score between 0.0 and 1.0
    // 1.0 is very likely a good interaction, 0.0 is very likely a bot
    const score = data.score ?? 0;

    // Require a minimum score of 0.5 (adjust as needed)
    if (score < 0.5) {
      console.warn(`Low reCAPTCHA score: ${score}`);
      return { valid: false, score };
    }

    return { valid: true, score };
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return { valid: false, score: 0 };
  }
}

/**
 * Send contact email via SES
 */
async function sendContactEmail(data: ContactFormData): Promise<void> {
  if (!CONTACT_EMAIL || !FROM_EMAIL) {
    console.warn("Email configuration missing, logging contact instead");
    console.log("Contact form submission:", JSON.stringify(data, null, 2));
    return;
  }

  const emailBody = `
New contact form submission from Super Simple Flashcards

From: ${data.name} <${data.email}>
Subject: ${data.subject}

Message:
${data.message}

---
Sent from: Super Simple Flashcards (${STAGE})
  `.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 16px; }
    .label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; }
    .value { margin-top: 4px; }
    .message { background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; white-space: pre-wrap; }
    .footer { margin-top: 20px; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">From</div>
        <div class="value">${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;</div>
      </div>
      <div class="field">
        <div class="label">Subject</div>
        <div class="value">${escapeHtml(data.subject)}</div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="message">${escapeHtml(data.message)}</div>
      </div>
      <div class="footer">
        Sent from Super Simple Flashcards (${STAGE})
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  await sesClient.send(
    new SendEmailCommand({
      Source: FROM_EMAIL,
      Destination: {
        ToAddresses: [CONTACT_EMAIL],
      },
      ReplyToAddresses: [data.email],
      Message: {
        Subject: {
          Data: `[Contact] ${data.subject}`,
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: emailBody,
            Charset: "UTF-8",
          },
          Html: {
            Data: htmlBody,
            Charset: "UTF-8",
          },
        },
      },
    })
  );
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

/**
 * Validate contact form data
 */
function validateFormData(data: unknown): { valid: boolean; errors: string[]; data?: ContactFormData } {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Invalid request body"] };
  }

  const formData = data as Record<string, unknown>;

  if (typeof formData.name !== "string" || formData.name.length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (typeof formData.email !== "string" || !formData.email.includes("@")) {
    errors.push("Please provide a valid email address");
  }

  if (typeof formData.subject !== "string" || formData.subject.length < 5) {
    errors.push("Subject must be at least 5 characters");
  }

  if (typeof formData.message !== "string" || formData.message.length < 20) {
    errors.push("Message must be at least 20 characters");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {
      name: formData.name as string,
      email: formData.email as string,
      subject: formData.subject as string,
      message: formData.message as string,
      recaptchaToken: formData.recaptchaToken as string | undefined,
    },
  };
}

/**
 * Main handler
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  // Only accept POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Parse request body
    let body: unknown;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Invalid JSON" }),
      };
    }

    // Validate form data
    const validation = validateFormData(body);
    if (!validation.valid || !validation.data) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Validation failed", details: validation.errors }),
      };
    }

    const formData = validation.data;

    // Verify reCAPTCHA
    if (formData.recaptchaToken) {
      const recaptchaResult = await verifyRecaptcha(formData.recaptchaToken);
      if (!recaptchaResult.valid) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            error: "reCAPTCHA verification failed",
            message: "Please try again",
          }),
        };
      }
      console.log(`reCAPTCHA score: ${recaptchaResult.score}`);
    }

    // Send email
    await sendContactEmail(formData);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: "Thank you for your message. We'll get back to you soon!",
      }),
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Failed to submit contact form",
        message: STAGE === "dev" ? String(error) : undefined,
      }),
    };
  }
};
