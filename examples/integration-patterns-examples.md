# Integration Patterns Examples

**Purpose**: Centralized code examples for third-party integration patterns referenced by cascade sessions (3, 4, 8, 8b, 10, 12).

**Maintenance**: Review when major provider API versions release (Stripe yearly, Salesforce 3x/year, SendGrid monthly).

**Provider Changelogs**:
- Stripe: https://github.com/stripe/stripe-node/blob/master/CHANGELOG.md
- Salesforce: https://developer.salesforce.com/docs/apis
- SendGrid: https://github.com/sendgrid/sendgrid-nodejs/releases
- HubSpot: https://developers.hubspot.com/changelog

---

## Section 1: Payment Processing SDK Patterns

### 1.1 Stripe PaymentIntent Flow (Node.js)

**Use Case**: Creating a payment with explicit state management for subscriptions.

```javascript
// Server-side: Create PaymentIntent
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createPayment(amount, currency, metadata) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // Amount in cents ($20.00 = 2000)
        currency: currency,
        payment_method_types: ['card'],
        metadata: metadata, // Link to your order/subscription
        automatic_payment_methods: {
            enabled: true,
        },
    });

    return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
    };
}

// Client-side: Confirm payment with Stripe Elements
// Stripe.js loaded via CDN: <script src="https://js.stripe.com/v3/"></script>
const stripe = Stripe('pk_test_...');
const elements = stripe.elements({
    clientSecret: clientSecret // from server
});

const paymentElement = elements.create('payment', {
    layout: 'tabs' // Card, Apple Pay, Google Pay tabs
});
paymentElement.mount('#payment-element');

async function handleSubmit(e) {
    e.preventDefault();

    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: 'https://yourdomain.com/payment/success',
        },
    });

    if (error) {
        // Show error to customer (e.g., insufficient funds)
        showError(error.message);
    }
    // Customer redirected to return_url on success
}
```

**Journey Trace**: "Compliance officers upgrading to paid tier (Journey Step 5) → PaymentIntent provides explicit state management for subscription lifecycle"

**Reference**: Session 3 SDK selection, Session 10 backlog story (Payment processing integration)

---

### 1.2 Stripe Subscription Creation (Python)

**Use Case**: Creating a recurring subscription with trial period.

```python
import stripe
stripe.api_key = "sk_test_..."

def create_subscription(customer_id, price_id, trial_days=14):
    """
    Create subscription with trial period.

    Args:
        customer_id: Stripe customer ID (cus_...)
        price_id: Stripe price ID for plan (price_...)
        trial_days: Trial period in days

    Returns:
        Subscription object with status 'trialing' or 'active'
    """
    subscription = stripe.Subscription.create(
        customer=customer_id,
        items=[{'price': price_id}],
        trial_period_days=trial_days,
        payment_behavior='default_incomplete',  # Require payment method upfront
        expand=['latest_invoice.payment_intent']  # Get payment intent for setup
    )

    return {
        'subscription_id': subscription.id,
        'status': subscription.status,  # 'trialing' or 'active'
        'current_period_end': subscription.current_period_end,
        'client_secret': subscription.latest_invoice.payment_intent.client_secret
    }
```

---

### 1.3 PayPal Order Creation (Node.js)

**Use Case**: Creating a PayPal order with purchase units.

```javascript
const paypal = require('@paypal/checkout-server-sdk');

// Configure PayPal environment
const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

async function createPayPalOrder(amount, currency, orderId) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            reference_id: orderId, // Your internal order ID
            amount: {
                currency_code: currency,
                value: amount.toFixed(2) // Must be string with 2 decimals
            }
        }],
        application_context: {
            return_url: 'https://yourdomain.com/payment/success',
            cancel_url: 'https://yourdomain.com/payment/cancel'
        }
    });

    const order = await client.execute(request);

    return {
        orderId: order.result.id,
        approvalUrl: order.result.links.find(link => link.rel === 'approve').href
    };
}

// Capture order after user approval
async function capturePayPalOrder(orderId) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    const capture = await client.execute(request);

    return {
        status: capture.result.status, // 'COMPLETED'
        captureId: capture.result.purchase_units[0].payments.captures[0].id
    };
}
```

**Gotcha**: PayPal webhook verification requires posting back to verification API (see Section 4.2).

---

## Section 2: Communication Service SDK Patterns

### 2.1 SendGrid Transactional Email with Template (Node.js)

**Use Case**: Sending templated email with dynamic data.

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendTemplatedEmail(to, templateId, dynamicData) {
    const msg = {
        to: to,
        from: 'noreply@yourdomain.com', // Must be verified sender
        templateId: templateId, // SendGrid template ID (d-abc123...)
        dynamic_template_data: dynamicData, // Variables for template
    };

    try {
        await sgMail.send(msg);
        return { success: true };
    } catch (error) {
        console.error('SendGrid error:', error.response.body.errors);
        throw error;
    }
}

// Example usage: Send assessment results
await sendTemplatedEmail(
    'user@example.com',
    'd-assessment-results',
    {
        user_name: 'John Doe',
        assessment_score: 85,
        pdf_url: 'https://yourdomain.com/reports/abc123.pdf'
    }
);
```

**Journey Trace**: "Users receiving assessment results via email (Journey Step 4) → SendGrid dynamic templates allow personalized PDF attachments"

---

### 2.2 SendGrid Bounce Handling Webhook (Python)

**Use Case**: Processing email bounce events from SendGrid webhook.

```python
from flask import Flask, request
from enum import Enum

app = Flask(__name__)

class EmailEventType(str, Enum):
    BOUNCE = 'bounce'
    DROPPED = 'dropped'
    SPAM_REPORT = 'spamreport'
    DELIVERED = 'delivered'
    OPEN = 'open'
    CLICK = 'click'

@app.post('/webhooks/sendgrid')
async def handle_sendgrid_webhook():
    """
    Process SendGrid Event Webhook.
    Events: https://docs.sendgrid.com/for-developers/tracking-events/event
    """
    events = request.json

    for event in events:
        event_type = event['event']
        email = event['email']

        if event_type == EmailEventType.BOUNCE:
            # Permanent failure - mark email undeliverable
            await mark_email_undeliverable(email, reason=event.get('reason'))

        elif event_type == EmailEventType.DROPPED:
            # SendGrid dropped due to spam filter or invalid email
            await mark_email_undeliverable(email, reason=event.get('reason'))

        elif event_type == EmailEventType.SPAM_REPORT:
            # User marked as spam - unsubscribe immediately
            await unsubscribe_user(email)

        elif event_type == EmailEventType.DELIVERED:
            # Successfully delivered - update delivery status
            await update_email_status(email, 'delivered', timestamp=event['timestamp'])

    return {'status': 'ok'}, 200
```

**Reference**: Session 7 webhook_events table, Session 8 webhook design, Session 10 backlog story (Email delivery tracking)

---

### 2.3 Twilio SMS with Delivery Status Callback (Node.js)

**Use Case**: Sending SMS with delivery confirmation.

```javascript
const twilio = require('twilio');
const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

async function sendSMS(to, message, statusCallbackUrl) {
    try {
        const sms = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to,
            statusCallback: statusCallbackUrl // Webhook for delivery updates
        });

        return {
            sid: sms.sid,
            status: sms.status // 'queued', 'sent', 'delivered', 'failed'
        };
    } catch (error) {
        // Handle specific Twilio error codes
        if (error.code === 21211) {
            // Invalid phone number format
            throw new Error('Invalid phone number');
        } else if (error.code === 30006) {
            // Landline or unreachable number
            throw new Error('Cannot send to landline');
        } else if (error.code === 30007) {
            // Carrier spam filter
            throw new Error('Message blocked by carrier');
        }
        throw error;
    }
}

// Webhook handler for delivery status
app.post('/webhooks/twilio/sms-status', (req, res) => {
    const { MessageSid, MessageStatus, ErrorCode } = req.body;

    switch (MessageStatus) {
        case 'delivered':
            updateSMSStatus(MessageSid, 'delivered');
            break;
        case 'failed':
        case 'undelivered':
            updateSMSStatus(MessageSid, 'failed', errorCode: ErrorCode);
            break;
    }

    res.sendStatus(200);
});
```

**Gotcha**: Twilio requires 10DLC registration for US A2P messaging (2-4 week approval time).

---

## Section 3: CRM/ERP SDK Patterns

### 3.1 Salesforce Bulk Upsert with jsforce (Node.js)

**Use Case**: Bulk upserting contacts while respecting governor limits.

```javascript
const jsforce = require('jsforce');

const conn = new jsforce.Connection({
    loginUrl: process.env.SALESFORCE_LOGIN_URL // 'https://login.salesforce.com' or 'https://test.salesforce.com'
});

await conn.login(
    process.env.SALESFORCE_USERNAME,
    process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITY_TOKEN
);

async function bulkUpsertContacts(contacts, externalIdField = 'Email') {
    /**
     * Bulk upsert contacts to Salesforce.
     *
     * @param contacts - Array of contact objects (max 10,000 per batch)
     * @param externalIdField - Field to match existing records (Email, External_ID__c)
     * @returns Array of results with success/failure status
     *
     * Governor Limits:
     * - DML statements: 150 per transaction
     * - Records per DML: 10,000 (use Bulk API for >200 records)
     * - SOQL queries: 100 per transaction
     */

    const BATCH_SIZE = 200; // Bulk API recommended batch size
    const results = [];

    for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
        const batch = contacts.slice(i, i + BATCH_SIZE);

        const batchResults = await conn.sobject('Contact')
            .upsert(batch, externalIdField, { allOrNone: false });

        results.push(...batchResults);
    }

    // Process results
    const succeeded = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`Upserted ${succeeded} contacts, ${failed} failed`);

    return results;
}

// Example usage
await bulkUpsertContacts([
    { Email: 'user1@example.com', FirstName: 'John', LastName: 'Doe' },
    { Email: 'user2@example.com', FirstName: 'Jane', LastName: 'Smith' }
], 'Email');
```

**Journey Trace**: "CRM integration for bidirectional contact sync (Session 2a requirement) → jsforce Bulk API handles Salesforce governor limits efficiently"

**Gotcha**: Salesforce has Mixed DML error - cannot update setup objects (User, Group) and non-setup objects (Contact, Account) in same transaction.

---

### 3.2 HubSpot Batch Upsert with Rate Limiting (Python)

**Use Case**: Batch upserting HubSpot contacts with rate limit handling.

```python
import time
import requests
from functools import wraps

def rate_limit_handler(max_retries=3, base_delay=1):
    """Decorator for handling HubSpot rate limits (429 responses)."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                response = func(*args, **kwargs)
                if response.status_code == 429:
                    delay = base_delay * (2 ** attempt)  # Exponential backoff
                    print(f"Rate limited. Retrying in {delay}s...")
                    time.sleep(delay)
                    continue
                return response
            raise Exception(f"Max retries ({max_retries}) exceeded")
        return wrapper
    return decorator

class HubSpotClient:
    def __init__(self, access_token):
        self.headers = {'Authorization': f'Bearer {access_token}'}
        self.base_url = 'https://api.hubapi.com'

    @rate_limit_handler(max_retries=3, base_delay=1)
    def _request(self, method, endpoint, **kwargs):
        url = f"{self.base_url}{endpoint}"
        return requests.request(method, url, headers=self.headers, **kwargs)

    def batch_upsert_contacts(self, contacts, batch_size=10):
        """
        Batch upsert contacts to HubSpot.

        CRITICAL: HubSpot batch contacts endpoint limited to 10 per call
        (other objects allow 100 per call).

        Args:
            contacts: List of contact dicts with 'email' and 'properties'
            batch_size: Batch size (max 10 for contacts, 100 for other objects)
        """
        results = []

        for i in range(0, len(contacts), batch_size):
            batch = contacts[i:i + batch_size]

            payload = {
                "inputs": [
                    {
                        "idProperty": "email",
                        "id": contact["email"],
                        "properties": contact["properties"]
                    }
                    for contact in batch
                ]
            }

            response = self._request(
                'POST',
                '/crm/v3/objects/contacts/batch/upsert',
                json=payload
            )

            if response.status_code == 200:
                results.append(response.json())
            else:
                print(f"Batch failed: {response.json()}")

            time.sleep(0.1)  # Rate limit protection

        return results

# Example usage
client = HubSpotClient(access_token='pat-...')
contacts = [
    {
        "email": "user1@example.com",
        "properties": {"firstname": "John", "lastname": "Doe", "company": "Acme Inc"}
    },
    {
        "email": "user2@example.com",
        "properties": {"firstname": "Jane", "lastname": "Smith", "company": "Tech Corp"}
    }
]

results = client.batch_upsert_contacts(contacts, batch_size=10)
```

**Gotcha**: HubSpot batch contacts limited to 10 per call (other objects: 100 per call). Rate limits shared across all apps in account.

---

## Section 4: Webhook Endpoint Patterns

### 4.1 Stripe Webhook with Signature Verification (Express)

**Use Case**: Receiving and verifying Stripe webhook events.

```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

// CRITICAL: Use express.raw() for Stripe webhooks
// Signature verification requires raw body BEFORE JSON parsing
app.post('/webhooks/stripe',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let event;

        try {
            // Verify signature and parse event
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return res.status(401).send(`Webhook Error: ${err.message}`);
        }

        // Check for duplicate event (idempotency)
        const existingEvent = await db.webhook_events.findOne({
            provider: 'stripe',
            event_id: event.id
        });

        if (existingEvent) {
            console.log(`Duplicate Stripe event: ${event.id}`);
            return res.json({ received: true, duplicate: true });
        }

        // Store event (UNIQUE constraint on provider + event_id)
        await db.webhook_events.create({
            provider: 'stripe',
            event_id: event.id,
            event_type: event.type,
            payload: event.data.object,
            status: 'pending'
        });

        // Enqueue for async processing
        await queue.enqueue('webhook-processor', {
            provider: 'stripe',
            event_id: event.id,
            event_type: event.type
        });

        // Return 200 OK immediately
        res.json({ received: true });
    }
);

// Background worker processes events from queue
async function processStripeWebhook(eventId) {
    const webhookEvent = await db.webhook_events.findOne({ event_id: eventId });
    await db.webhook_events.update(webhookEvent.id, { status: 'processing' });

    try {
        switch (webhookEvent.event_type) {
            case 'payment_intent.succeeded':
                await handlePaymentSuccess(webhookEvent.payload);
                break;

            case 'customer.subscription.created':
                await handleSubscriptionCreated(webhookEvent.payload);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionCanceled(webhookEvent.payload);
                break;

            case 'invoice.payment_failed':
                await handlePaymentFailed(webhookEvent.payload);
                break;
        }

        await db.webhook_events.update(webhookEvent.id, {
            status: 'completed',
            processed_at: new Date()
        });
    } catch (error) {
        await db.webhook_events.update(webhookEvent.id, {
            status: 'failed',
            error_message: error.message
        });
        throw error; // Trigger queue retry
    }
}
```

**Journey Trace**: "Payment confirmation webhook (Stripe payment_intent.succeeded) triggers subscription activation + access provisioning + confirmation email → 3 operations, async processing required"

**Reference**: Session 8 webhook design (Step 5a), Session 7 webhook_events table

---

### 4.2 PayPal Webhook with Postback Verification (Python/FastAPI)

**Use Case**: Receiving PayPal webhooks and verifying via postback API.

```python
from fastapi import FastAPI, Request, HTTPException
import httpx
import os

app = FastAPI()

async def verify_paypal_webhook(
    webhook_id: str,
    transmission_id: str,
    transmission_time: str,
    cert_url: str,
    auth_algo: str,
    transmission_sig: str,
    webhook_event: dict
) -> bool:
    """
    Verify PayPal webhook signature via postback API.

    CRITICAL: PayPal requires posting back exact webhook body to verification endpoint.
    """
    verification_url = "https://api.paypal.com/v1/notifications/verify-webhook-signature"

    # Get PayPal access token
    auth_response = await httpx.post(
        "https://api.paypal.com/v1/oauth2/token",
        auth=(os.getenv("PAYPAL_CLIENT_ID"), os.getenv("PAYPAL_CLIENT_SECRET")),
        data={"grant_type": "client_credentials"}
    )
    access_token = auth_response.json()["access_token"]

    # Verify signature
    verify_response = await httpx.post(
        verification_url,
        json={
            "transmission_id": transmission_id,
            "transmission_time": transmission_time,
            "cert_url": cert_url,
            "auth_algo": auth_algo,
            "transmission_sig": transmission_sig,
            "webhook_id": webhook_id,
            "webhook_event": webhook_event
        },
        headers={"Authorization": f"Bearer {access_token}"}
    )

    result = verify_response.json()
    return result.get("verification_status") == "SUCCESS"

@app.post("/webhooks/paypal")
async def handle_paypal_webhook(request: Request):
    # Get webhook headers
    webhook_id = os.getenv("PAYPAL_WEBHOOK_ID")
    transmission_id = request.headers.get("PAYPAL-TRANSMISSION-ID")
    transmission_time = request.headers.get("PAYPAL-TRANSMISSION-TIME")
    cert_url = request.headers.get("PAYPAL-CERT-URL")
    auth_algo = request.headers.get("PAYPAL-AUTH-ALGO")
    transmission_sig = request.headers.get("PAYPAL-TRANSMISSION-SIG")

    # Get raw body (must post back exactly as received)
    body = await request.json()

    # Verify signature
    is_valid = await verify_paypal_webhook(
        webhook_id, transmission_id, transmission_time,
        cert_url, auth_algo, transmission_sig, body
    )

    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    # Check idempotency
    event_id = body["id"]
    existing = await db.webhook_events.find_one({
        "provider": "paypal",
        "event_id": event_id
    })

    if existing:
        return {"received": True, "duplicate": True}

    # Store and enqueue
    await db.webhook_events.create({
        "provider": "paypal",
        "event_id": event_id,
        "event_type": body["event_type"],
        "payload": body,
        "status": "pending"
    })

    await queue.enqueue("webhook-processor", {
        "provider": "paypal",
        "event_id": event_id
    })

    return {"received": True}
```

**Gotcha**: PayPal mock simulator webhooks don't support postback verification (test with sandbox webhooks, not simulator).

---

### 4.3 Generic HMAC Webhook Verification (SendGrid, Twilio, HubSpot)

**Use Case**: Verifying webhook signatures using HMAC-SHA256.

```python
import hmac
import hashlib

def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
    """
    Verify webhook signature using HMAC-SHA256.

    Args:
        payload: Raw webhook body (bytes, NOT parsed JSON)
        signature: Signature from webhook header
        secret: Webhook signing secret from provider

    Returns:
        True if signature is valid, False otherwise
    """
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload,
        digestmod=hashlib.sha256
    ).hexdigest()

    # CRITICAL: Use constant-time comparison to prevent timing attacks
    return hmac.compare_digest(expected_signature, signature)

# SendGrid webhook example
@app.post("/webhooks/sendgrid")
async def handle_sendgrid_webhook(request: Request):
    # Get raw body
    payload = await request.body()

    # Get signature from header
    signature = request.headers.get("X-Twilio-Email-Event-Webhook-Signature")
    secret = os.getenv("SENDGRID_WEBHOOK_SECRET")

    # Verify signature
    if not verify_webhook_signature(payload, signature, secret):
        raise HTTPException(status_code=401, detail="Invalid signature")

    # Parse and process events
    events = await request.json()
    for event in events:
        await process_sendgrid_event(event)

    return {"status": "ok"}
```

**Reference**: `/reference-material/third-party-integration-patterns.md` lines 29-58

---

## Section 5: OpenAPI Webhook Schema Templates

### 5.1 Stripe Webhook Endpoint Schema

**Use Case**: OpenAPI schema for Stripe webhook endpoint (referenced by Session 8b).

```yaml
/webhooks/stripe:
  post:
    summary: Stripe webhook receiver
    description: |
      Receives payment and subscription events from Stripe.
      Events are verified via HMAC-SHA256 signature and processed asynchronously.

      Event Types: payment_intent.succeeded, customer.subscription.created,
      customer.subscription.deleted, invoice.payment_failed, charge.refunded

      Reference: https://stripe.com/docs/webhooks
    tags:
      - Webhooks
    security: []  # No bearer token, uses Stripe-Signature header verification
    parameters:
      - name: Stripe-Signature
        in: header
        required: true
        schema:
          type: string
        description: |
          HMAC-SHA256 signature for request verification.
          Format: t=<timestamp>,v1=<signature>

          Verification requires raw request body BEFORE JSON parsing.
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - id
              - type
              - data
              - created
            properties:
              id:
                type: string
                description: Unique event ID (for idempotency tracking)
                example: "evt_1NqPNJ2eZvKYlo2C9xQpZ8Vz"
              type:
                type: string
                description: Event type
                enum:
                  - payment_intent.succeeded
                  - payment_intent.payment_failed
                  - customer.subscription.created
                  - customer.subscription.updated
                  - customer.subscription.deleted
                  - invoice.payment_succeeded
                  - invoice.payment_failed
                  - charge.refunded
                example: "payment_intent.succeeded"
              data:
                type: object
                description: Event-specific payload
                properties:
                  object:
                    type: object
                    description: The object affected by the event (PaymentIntent, Subscription, etc.)
              created:
                type: integer
                description: Unix timestamp of event creation
                example: 1686876543
    responses:
      '200':
        description: Webhook received and queued for processing
        content:
          application/json:
            schema:
              type: object
              properties:
                received:
                  type: boolean
                  example: true
                duplicate:
                  type: boolean
                  example: false
                  description: True if event already processed (idempotent)
      '401':
        description: Invalid webhook signature
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Error'
```

**Reference**: Session 8b API contracts generation

---

### 5.2 Salesforce CDC Webhook Schema

**Use Case**: OpenAPI schema for Salesforce Change Data Capture webhook.

```yaml
/webhooks/salesforce:
  post:
    summary: Salesforce Change Data Capture (CDC) webhook
    description: |
      Receives real-time change events from Salesforce.
      Events include Contact, Account, Opportunity updates.

      Reference: https://developer.salesforce.com/docs/platform/change-data-capture
    tags:
      - Webhooks
    security: []
    parameters:
      - name: X-Salesforce-Signature
        in: header
        required: true
        schema:
          type: string
        description: HMAC-SHA256 signature for verification
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - event_id
              - event_type
              - object_type
              - change_type
              - record_id
            properties:
              event_id:
                type: string
                description: Unique Salesforce event ID
                example: "00Dxx0000001gERE_3a1xx0000008RqWAAU_2023-06-15T10:30:00.000Z"
              event_type:
                type: string
                enum:
                  - created
                  - updated
                  - deleted
                  - undeleted
                example: "updated"
              object_type:
                type: string
                description: Salesforce object type
                enum:
                  - Contact
                  - Account
                  - Opportunity
                  - CustomObject__c
                example: "Contact"
              change_type:
                type: string
                enum:
                  - CREATE
                  - UPDATE
                  - DELETE
                  - UNDELETE
                  - GAP_CREATE
                  - GAP_UPDATE
                  - GAP_DELETE
              record_id:
                type: string
                description: Salesforce record ID (18-character)
                example: "003xx000004TmiQAAS"
              changed_fields:
                type: array
                description: List of field names that changed (UPDATE events only)
                items:
                  type: string
                example: ["Email", "Phone", "LastModifiedDate"]
    responses:
      '200':
        description: Event received and queued
        content:
          application/json:
            schema:
              type: object
              properties:
                received:
                  type: boolean
                  example: true
```

---

## Maintenance Checklist

**Quarterly Review** (every 3 months):
- [ ] Check Stripe CHANGELOG for breaking changes (v13 → v14 migration)
- [ ] Review Salesforce API version deprecations (API v55+)
- [ ] Update SendGrid Event Webhook types (new event types added quarterly)
- [ ] Verify HubSpot batch limits (occasional changes to batch sizes)

**When Provider Updates SDK**:
- [ ] Update SDK version in Section 1-3 code examples
- [ ] Test signature verification still works (algorithm changes are rare but possible)
- [ ] Update provider changelog URLs if documentation moved

**When Framework/Language Updates**:
- [ ] Update Express middleware patterns (express.raw() syntax)
- [ ] Update FastAPI async patterns (ASGI compatibility)
- [ ] Update Python type hints (typing module updates)

---

**Last Updated**: 2026-02-02
**Next Review**: 2026-05-02 (Quarterly)
