# Third-Party Integration Guide: Architecture, Patterns, and Best Practices

Building robust integrations with external services requires mastering **architectural patterns**, **vendor-specific quirks**, and **resilience strategies**. This guide provides production-ready patterns for integrating payment processors, communication services, authentication providers, and CRM/ERP systems with code examples in Python, JavaScript/Node.js, and Java.

---

## 1. Integration architecture patterns

### Direct integration vs middleware/iPaaS

The fundamental architectural decision when building integrations is choosing between **direct API integration** and **middleware platforms** (Zapier, MuleSoft, Workato). This choice impacts development velocity, operational complexity, and long-term maintenance costs.

**Direct integration** provides full control over functionality, security, and optimization. It's ideal when you have dedicated engineering resources, need fine-grained performance tuning, or are connecting to a small number of services (1-3). The tradeoff is higher initial development time (weeks to months) and ongoing maintenance responsibility.

**Middleware/iPaaS** excels when connecting multiple systems (5+ integrations), when non-technical users need to manage workflows, or when speed of deployment matters more than customization. Organizations with mature integration strategies using iPaaS achieve **35% faster time-to-market** according to 2024 industry research.

| Factor | Direct API Integration | iPaaS/Middleware |
|--------|----------------------|------------------|
| **Control** | Full customization | Limited to platform capabilities |
| **Development Time** | High (weeks-months) | Low (days-weeks) |
| **Long-term Cost** | Lower (no recurring fees) | Higher (per-task/user pricing) |
| **Maintenance** | Internal team responsibility | Provider-managed |
| **Scalability** | Manual scaling required | Built-in auto-scaling |

### Webhook handling: security and idempotency

Webhooks enable event-driven architectures but require careful attention to security and reliability. **HMAC-SHA256 signature verification** is used by 65% of webhook providers and prevents payload tampering.

```python
# Python webhook signature verification
import hmac
import hashlib
from flask import Flask, request, abort

app = Flask(__name__)
WEBHOOK_SECRET = 'your_webhook_secret'

def verify_webhook(payload: bytes, signature: str) -> bool:
    expected = hmac.new(
        WEBHOOK_SECRET.encode('utf-8'),
        payload,
        digestmod=hashlib.sha256
    ).hexdigest()
    # Constant-time comparison prevents timing attacks
    return hmac.compare_digest(expected, signature)

@app.route('/webhook', methods=['POST'])
def handle_webhook():
    payload = request.get_data()
    signature = request.headers.get('X-Signature-SHA256')
    
    if not signature or not verify_webhook(payload, signature):
        abort(401, 'Invalid signature')
    
    # Process asynchronously - return 200 quickly
    queue.enqueue(process_webhook, request.json)
    return '', 200
```

**Idempotency** ensures webhooks are processed exactly once even when delivered multiple times. Use the webhook's unique event ID as a deduplication key:

```javascript
// Node.js idempotent webhook processing with Redis
const Redis = require('ioredis');
const redis = new Redis();

async function processIdempotent(webhookId, handler) {
    const key = `webhook:processed:${webhookId}`;
    
    // NX flag: only set if key doesn't exist
    const acquired = await redis.set(key, 'processing', 'EX', 86400, 'NX');
    if (!acquired) {
        return { status: 'duplicate' };
    }
    
    try {
        const result = await handler();
        await redis.set(key, 'completed', 'EX', 86400);
        return { status: 'success', result };
    } catch (error) {
        await redis.del(key); // Allow retry on failure
        throw error;
    }
}
```

### Polling vs webhooks vs WebSockets

Each communication pattern serves different use cases with distinct tradeoffs in latency, resource usage, and complexity.

| Aspect | Polling | Webhooks | WebSockets |
|--------|---------|----------|------------|
| **Latency** | High (polling interval) | Low (near real-time) | Very low (real-time) |
| **Resource Usage** | High (constant requests) | Low (event-driven) | Medium (persistent connection) |
| **Complexity** | Low | Medium | High |
| **Best For** | Infrequent updates, fallback | Server-to-server events | Chat, gaming, live collaboration |

**Use polling** when webhooks aren't available, updates are infrequent, or as a fallback mechanism. **Use webhooks** for near real-time server-to-server communication and event-driven architectures. **Use WebSockets** for true bidirectional real-time communication where latency under 100ms is critical.

A **hybrid approach** combines webhooks with polling fallback for maximum reliability:

```python
# Webhook-primary with polling fallback
class HybridDataSync:
    def __init__(self, api_client):
        self.api_client = api_client
        self.last_webhook = datetime.utcnow()
        self.webhook_timeout = timedelta(minutes=5)
    
    async def polling_fallback(self):
        while True:
            await asyncio.sleep(60)
            if datetime.utcnow() - self.last_webhook > self.webhook_timeout:
                # Webhooks may be failing - poll for updates
                updates = await self.api_client.get_updates(since=self.last_webhook)
                for update in updates:
                    await self.process_update(update)
```

### Rate limiting with exponential backoff and jitter

Respecting rate limits prevents service degradation and account suspension. The industry-standard approach combines **exponential backoff** with **jitter** to prevent thundering herd problems.

```python
# Exponential backoff with full jitter (AWS recommended)
import random
import asyncio

class ExponentialBackoff:
    def __init__(self, base_delay=1.0, max_delay=60.0, max_retries=5):
        self.base_delay = base_delay
        self.max_delay = max_delay
        self.max_retries = max_retries
    
    def calculate_delay(self, attempt: int) -> float:
        # Full jitter: random value between 0 and exponential delay
        temp = min(self.max_delay, self.base_delay * (2 ** attempt))
        return random.uniform(0, temp)
    
    async def execute(self, func, *args, **kwargs):
        for attempt in range(self.max_retries + 1):
            try:
                return await func(*args, **kwargs)
            except RetryableError:
                if attempt == self.max_retries:
                    raise
                delay = self.calculate_delay(attempt)
                await asyncio.sleep(delay)
```

**Read and respect rate limit headers** returned by APIs:

```javascript
// Node.js rate limit header handling
class RateLimitedClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.rateLimitState = { remaining: null, resetTime: null };
    }
    
    async request(endpoint, options = {}) {
        // Preemptively wait if near limit
        if (this.rateLimitState.remaining <= 1 && this.rateLimitState.resetTime) {
            const waitTime = (this.rateLimitState.resetTime * 1000) - Date.now();
            if (waitTime > 0) await this.sleep(waitTime + 100);
        }
        
        const response = await fetch(`${this.baseUrl}${endpoint}`, options);
        
        // Update state from headers
        this.rateLimitState = {
            remaining: parseInt(response.headers.get('x-ratelimit-remaining')),
            resetTime: parseInt(response.headers.get('x-ratelimit-reset'))
        };
        
        if (response.status === 429) {
            const retryAfter = parseInt(response.headers.get('retry-after')) || 60;
            await this.sleep(retryAfter * 1000);
            return this.request(endpoint, options);
        }
        
        return response;
    }
}
```

---

## 2. Payment processing integration

### Stripe, PayPal, and Square compared

Each payment processor serves different market segments with distinct API philosophies. **Stripe** targets developer-focused tech companies with extensive API customization. **PayPal** offers global reach with **200+ countries** and high consumer trust. **Square** excels in point-of-sale and omnichannel retail scenarios.

All three charge approximately **2.9% + $0.30** for online transactions, but their API designs differ significantly. Stripe's PaymentIntent-based flow provides explicit state management, while PayPal's order-based system bundles purchase units.

```python
# Stripe PaymentIntent (recommended approach)
import stripe
stripe.api_key = "sk_test_..."

payment_intent = stripe.PaymentIntent.create(
    amount=2000,  # $20.00 in cents
    currency="usd",
    payment_method_types=["card"],
    metadata={"order_id": "12345"}
)

# Confirm with payment method
confirmed = stripe.PaymentIntent.confirm(
    payment_intent.id,
    payment_method="pm_card_visa"
)
```

```javascript
// PayPal Order API
const paypal = require('@paypal/checkout-server-sdk');

const environment = new paypal.core.SandboxEnvironment('CLIENT_ID', 'CLIENT_SECRET');
const client = new paypal.core.PayPalHttpClient(environment);

const request = new paypal.orders.OrdersCreateRequest();
request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
        amount: { currency_code: 'USD', value: '20.00' }
    }]
});

const order = await client.execute(request);
```

### PCI compliance and scope reduction

**Tokenization** is the cornerstone of PCI scope reduction. By using hosted payment fields, card data never touches your servers, reducing compliance requirements from **300+ SAQ D requirements** to approximately **22 SAQ A requirements**.

```javascript
// Stripe Elements - Card data stays in Stripe's iframe
const stripe = Stripe('pk_test_...');
const elements = stripe.elements({
    clientSecret: 'pi_xxx_secret_xxx'
});

const paymentElement = elements.create('payment', { layout: 'tabs' });
paymentElement.mount('#payment-element');

// Form submission - your server never sees card numbers
async function handleSubmit(e) {
    e.preventDefault();
    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: 'https://example.com/success' }
    });
}
```

| SAQ Type | Use Case | Requirements |
|----------|----------|--------------|
| **SAQ A** | Fully outsourced (iframes/redirects) | ~22 requirements |
| **SAQ A-EP** | Hosted fields affecting payment page | ~139 requirements |
| **SAQ D** | Card data on your servers | 300+ requirements |

### Subscription lifecycle and dunning management

Webhook-driven subscription management provides real-time visibility into subscription state changes. Critical events include `customer.subscription.created`, `invoice.payment_failed`, and `customer.subscription.deleted`.

```javascript
// Stripe subscription webhook handling
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    
    switch (event.type) {
        case 'invoice.payment_failed':
            const invoice = event.data.object;
            const attemptCount = invoice.attempt_count;
            
            // Graduated dunning response
            if (attemptCount === 1) {
                await sendEmail(invoice.customer_email, 'payment_failed_soft');
            } else if (attemptCount >= 3) {
                await sendEmail(invoice.customer_email, 'payment_failed_final');
                await sendSMS(invoice.customer, 'Update payment urgently');
            }
            break;
            
        case 'customer.subscription.deleted':
            await revokeAccess(event.data.object.customer);
            break;
    }
    
    res.json({received: true});
});
```

**Webhook signature verification** differs by provider—Stripe requires the raw body before JSON parsing, PayPal uses a verification API call, and Square includes the notification URL in signature calculation.

---

## 3. Communication service integration

### Email services: SendGrid vs AWS SES vs Postmark

The choice between email providers depends on volume, deliverability requirements, and operational complexity tolerance.

| Feature | SendGrid | AWS SES | Postmark |
|---------|----------|---------|----------|
| **Pricing** | $19.95/mo for 50K-100K | $0.10/1K emails | ~$10-20/mo for 10K |
| **Deliverability** | Good with dedicated IPs | Requires management | Industry-leading for transactional |
| **Setup Complexity** | Moderate | High (AWS expertise) | Low |

**AWS SES** offers the lowest cost at scale ($0.10 per 1,000 emails) but requires CloudWatch setup for logging and more complex bounce handling. **Postmark** provides superior deliverability for transactional emails with built-in analytics. **SendGrid** balances features with moderate complexity.

```python
# SendGrid with bounce handling
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

sg = SendGridAPIClient(api_key='SENDGRID_API_KEY')

def send_email(to_email, subject, html_content):
    message = Mail(
        from_email='sender@yourdomain.com',
        to_emails=to_email,
        subject=subject,
        html_content=html_content
    )
    return sg.client.mail.send.post(request_body=message.get())

# Webhook handler for bounces
@app.post('/webhooks/sendgrid')
def handle_sendgrid_webhook():
    for event in request.json:
        if event['event'] == 'bounce':
            mark_email_undeliverable(event['email'])
        elif event['event'] == 'spamreport':
            unsubscribe_user(event['email'])
    return 'OK', 200
```

**Email authentication** (SPF, DKIM, DMARC) is mandatory for deliverability. Start with `p=none` DMARC policy for monitoring, then progress to `p=quarantine` and finally `p=reject`.

### SMS: Twilio vs AWS SNS patterns

**Twilio** provides superior documentation, easier 10DLC registration, and full two-way SMS support. **AWS SNS** offers marginally lower costs ($0.0075 vs $0.0079 per message) but requires longer approval times (7-10 days) and separate Pinpoint configuration for advanced features.

```javascript
// Twilio with delivery status callback
const twilio = require('twilio');
const client = twilio(accountSid, authToken);

async function sendSMS(to, message, statusCallback) {
    try {
        const msg = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to,
            statusCallback: statusCallback // Receive delivery updates
        });
        return { sid: msg.sid, status: msg.status };
    } catch (error) {
        // Handle specific error codes
        if (error.code === 30006) return { error: 'Landline detected' };
        if (error.code === 30007) return { error: 'Carrier spam filter' };
        throw error;
    }
}
```

### Push notifications: FCM and APNs

Firebase Cloud Messaging (FCM) provides a unified API for both Android and iOS, though Apple Push Notification service (APNs) has specific requirements for iOS-only apps. Key differences include **4KB payload limits** (2KB for FCM topics) and different priority semantics.

```python
# FCM with proper token management
import firebase_admin
from firebase_admin import credentials, messaging

firebase_admin.initialize_app(credentials.Certificate('service-account.json'))

def send_notification(token, title, body, data=None):
    message = messaging.Message(
        notification=messaging.Notification(title=title, body=body),
        data=data or {},
        token=token,
        android=messaging.AndroidConfig(
            priority='high',
            notification=messaging.AndroidNotification(sound='default')
        ),
        apns=messaging.APNSConfig(
            headers={'apns-priority': '10'},
            payload=messaging.APNSPayload(
                aps=messaging.Aps(sound='default', badge=1)
            )
        )
    )
    
    try:
        return messaging.send(message)
    except messaging.UnregisteredError:
        # Token invalid - remove from database
        remove_device_token(token)
        return None
```

**Device token management** requires handling token refresh (iOS/Android provide new tokens periodically), removing invalid tokens when FCM/APNs reports `UnregisteredError`, and cleaning stale tokens not used in 90+ days.

---

## 4. Authentication provider integration

### OAuth 2.0 with PKCE

**PKCE (Proof Key for Code Exchange)** is now mandatory in OAuth 2.1 for all clients, not just public ones. It protects against authorization code interception by requiring the same client that initiated the flow to complete it.

```python
# OAuth 2.0 Authorization Code Flow with PKCE
import base64
import hashlib
import os
import requests

def generate_pkce_codes():
    code_verifier = base64.urlsafe_b64encode(os.urandom(32)).rstrip(b'=').decode()
    code_challenge = base64.urlsafe_b64encode(
        hashlib.sha256(code_verifier.encode()).digest()
    ).rstrip(b'=').decode()
    return code_verifier, code_challenge

def initiate_oauth(client_id, redirect_uri, scope='openid profile email'):
    verifier, challenge = generate_pkce_codes()
    state = base64.urlsafe_b64encode(os.urandom(16)).decode()
    
    auth_url = (
        f"https://auth.example.com/authorize?"
        f"response_type=code&client_id={client_id}&"
        f"redirect_uri={redirect_uri}&scope={scope}&"
        f"state={state}&code_challenge={challenge}&"
        f"code_challenge_method=S256"
    )
    return auth_url, verifier, state

def exchange_code(code, verifier, client_id, redirect_uri):
    return requests.post('https://auth.example.com/oauth/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri,
        'client_id': client_id,
        'code_verifier': verifier
    }).json()
```

**Token storage best practices**: Store access tokens in memory only (SPAs) or HttpOnly cookies. **Never** use localStorage or sessionStorage—they're vulnerable to XSS attacks. Refresh tokens should be stored in HttpOnly, Secure, SameSite=Strict cookies.

### Social login implementation

Each social provider has specific requirements and gotchas. **Apple Sign In** is mandatory for iOS apps with social login, and Apple only sends the user's name on the **first authentication**—you must store it immediately.

```javascript
// Apple Sign In with name capture
const AppleStrategy = require('passport-apple');

passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyString: process.env.APPLE_PRIVATE_KEY,
    callbackURL: '/auth/apple/callback',
    scope: ['name', 'email']
}, async (req, accessToken, refreshToken, idToken, profile, done) => {
    // Apple only sends name on FIRST login - store immediately!
    const user = await User.findOneAndUpdate(
        { 'socialLogins.provider': 'apple', 'socialLogins.providerId': profile.id },
        { 
            $setOnInsert: {
                email: profile.email,
                name: `${profile.name?.firstName || ''} ${profile.name?.lastName || ''}`.trim(),
                emailVerified: true
            }
        },
        { upsert: true, new: true }
    );
    return done(null, user);
}));
```

**Account linking** should verify email ownership before linking. Only link accounts when both the new social login and existing account have verified emails from the same address.

### MFA with TOTP and backup codes

**TOTP (Time-based One-Time Password)** provides strong second-factor authentication compatible with Google Authenticator, Authy, and similar apps.

```python
# TOTP implementation with pyotp
import pyotp
import qrcode
import io
import base64
import secrets

class TOTPService:
    def __init__(self, issuer='MyApp'):
        self.issuer = issuer
    
    def generate_secret(self):
        return pyotp.random_base32()
    
    def generate_qr_code(self, secret, user_email):
        totp = pyotp.TOTP(secret)
        uri = totp.provisioning_uri(name=user_email, issuer_name=self.issuer)
        
        qr = qrcode.make(uri)
        buffer = io.BytesIO()
        qr.save(buffer, format='PNG')
        return base64.b64encode(buffer.getvalue()).decode()
    
    def verify_token(self, secret, token, window=1):
        totp = pyotp.TOTP(secret)
        return totp.verify(token, valid_window=window)
    
    def generate_backup_codes(self, count=10):
        return [secrets.token_hex(4).upper() for _ in range(count)]
```

**Backup codes** provide recovery when users lose access to their authenticator app. Store only **hashed** backup codes, never plaintext. Use SHA-256 hashing and mark codes as used immediately after verification.

---

## 5. CRM/ERP integration patterns

### Salesforce API selection and governor limits

Salesforce offers three main APIs with different characteristics. **REST API** handles simple CRUD operations synchronously with 200 records per batch. **SOAP API** provides enterprise features like WS-Security. **Bulk API** processes up to **10,000 records per batch** asynchronously for data migrations and ETL.

| Limit Type | Synchronous Limit |
|------------|-------------------|
| SOQL Queries | 100 per transaction |
| DML Statements | 150 per transaction |
| Records Retrieved | 50,000 per query |
| CPU Time | 10,000ms |
| Callouts | 100 per transaction |

**Bulkify operations** to stay within governor limits:

```python
# Salesforce bulkified operations
from simple_salesforce import Salesforce

class SalesforceIntegration:
    def __init__(self, username, password, security_token):
        self.sf = Salesforce(username=username, password=password, 
                             security_token=security_token)
    
    def bulk_upsert(self, object_name, records, external_id, batch_size=200):
        """Bulkified upsert to avoid DML limits"""
        results = []
        for i in range(0, len(records), batch_size):
            batch = records[i:i + batch_size]
            result = getattr(self.sf.bulk, object_name).upsert(batch, external_id)
            results.extend(result)
        return results
    
    def efficient_query(self, soql):
        """Handle pagination for large result sets"""
        records = []
        result = self.sf.query(soql)
        records.extend(result['records'])
        
        while not result['done']:
            result = self.sf.query_more(result['nextRecordsUrl'], True)
            records.extend(result['records'])
        return records
```

**Change Data Capture (CDC)** enables real-time, event-driven synchronization. Events are retained for 3 days and can be replayed. Subscribe via CometD or the newer Pub/Sub API.

### HubSpot rate limits and batch operations

HubSpot's rate limits vary by subscription tier: **250,000 daily calls** for Free/Starter, **650,000** for Professional, and **1,000,000** for Enterprise. Critically, batch limits differ by object type—**contacts are limited to 10 per batch call** while other objects allow 100.

```python
# HubSpot batch operations with rate limit handling
import time
from functools import wraps

def rate_limit_handler(max_retries=3, base_delay=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                response = func(*args, **kwargs)
                if response.status_code == 429:
                    delay = base_delay * (2 ** attempt)
                    time.sleep(delay)
                    continue
                return response
            return None
        return wrapper
    return decorator

class HubSpotClient:
    def __init__(self, access_token):
        self.headers = {'Authorization': f'Bearer {access_token}'}
        self.base_url = 'https://api.hubapi.com'
    
    def batch_upsert_contacts(self, contacts, batch_size=10):
        """Batch upsert contacts - limited to 10 per call"""
        results = []
        for i in range(0, len(contacts), batch_size):
            batch = contacts[i:i + batch_size]
            payload = {
                "inputs": [
                    {"idProperty": "email", "id": c["email"], "properties": c}
                    for c in batch
                ]
            }
            response = self._request('POST', '/crm/v3/objects/contacts/batch/upsert', 
                                     json=payload)
            results.append(response.json())
            time.sleep(0.1)  # Respect rate limits
        return results
```

### Bi-directional sync and conflict resolution

Bi-directional synchronization requires careful **change detection** and **conflict resolution**. The three main conflict resolution strategies are:

- **Last-write-wins**: Simple timestamp comparison—most recent change wins
- **Vector clocks**: Detect truly concurrent modifications requiring manual resolution  
- **Field-level merge**: Different systems are authoritative for different fields

```python
# Field-level merge strategy
class FieldLevelMerger:
    def __init__(self, field_priorities=None):
        # {'email': 'crm', 'address': 'erp'} - which system owns each field
        self.field_priorities = field_priorities or {}
    
    def merge(self, crm_record, erp_record, crm_modified, erp_modified):
        merged = {}
        conflicts = []
        
        for field in set(crm_record.keys()) | set(erp_record.keys()):
            crm_val = crm_record.get(field)
            erp_val = erp_record.get(field)
            
            if field in self.field_priorities:
                authority = self.field_priorities[field]
                merged[field] = crm_val if authority == 'crm' else erp_val
            elif crm_val == erp_val:
                merged[field] = crm_val
            else:
                # Use most recent modification
                crm_time = crm_modified.get(field, datetime.min)
                erp_time = erp_modified.get(field, datetime.min)
                merged[field] = crm_val if crm_time >= erp_time else erp_val
                conflicts.append({'field': field, 'crm': crm_val, 'erp': erp_val})
        
        return {'data': merged, 'conflicts': conflicts}
```

---

## 6. Error handling and recovery

### Circuit breaker implementation

The **circuit breaker pattern** prevents cascading failures by failing fast when a service is unhealthy. It operates in three states: **Closed** (normal operation), **Open** (rejecting requests), and **Half-Open** (testing recovery).

```javascript
// JavaScript circuit breaker
class CircuitBreaker {
    constructor({ failureThreshold = 5, successThreshold = 3, timeout = 30000 } = {}) {
        this.failureThreshold = failureThreshold;
        this.successThreshold = successThreshold;
        this.timeout = timeout;
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.successCount = 0;
        this.lastFailureTime = null;
    }
    
    async execute(operation) {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime >= this.timeout) {
                this.state = 'HALF_OPEN';
            } else {
                throw new Error('Circuit breaker is OPEN');
            }
        }
        
        try {
            const result = await operation();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }
    
    onSuccess() {
        if (this.state === 'HALF_OPEN') {
            this.successCount++;
            if (this.successCount >= this.successThreshold) {
                this.state = 'CLOSED';
                this.failureCount = 0;
                this.successCount = 0;
            }
        } else {
            this.failureCount = 0;
        }
    }
    
    onFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        if (this.failureCount >= this.failureThreshold) {
            this.state = 'OPEN';
        }
    }
}
```

For production use, consider **Resilience4j** (Java), **pybreaker** (Python), or **opossum** (Node.js) which provide thread-safe implementations with metrics.

### Graceful degradation patterns

When dependencies fail, **fallback mechanisms** maintain service availability with reduced functionality:

```javascript
// Fallback chain: primary → cache → secondary → default
class ResilientService {
    async getData(key) {
        try {
            return await this.circuitBreaker.execute(() =>
                this.backoff.execute(() => this.fetchFromPrimary(key))
            );
        } catch (error) {
            return this.fallbackChain(key);
        }
    }
    
    async fallbackChain(key) {
        // 1. Try fresh cache
        const cached = this.cache.get(key);
        if (cached && !this.isStale(cached)) {
            return { ...cached.data, _fromCache: true };
        }
        
        // 2. Try secondary service
        try {
            return await this.fetchFromSecondary(key);
        } catch {
            // 3. Return stale cache if available
            if (cached) return { ...cached.data, _stale: true };
            
            // 4. Return default
            return this.getDefaultValue(key);
        }
    }
}
```

### Monitoring and SLOs for dependencies

Key metrics to monitor for third-party integrations:
- **Latency percentiles**: p50, p95, p99 response times
- **Error rate**: 4xx/5xx response percentages
- **Circuit breaker state**: Open/Closed/Half-Open transitions
- **Retry rate**: Percentage of requests requiring retries

Set **lower availability SLOs for external dependencies** than internal services—a third-party API with 99.9% uptime will occasionally fail, and your system should handle it gracefully.

---

## 7. Testing third-party integrations

### Mock service patterns

**Library-based mocking** (nock, responses) intercepts HTTP calls at the client level. **Service-based mocking** (WireMock) runs a separate server for more realistic testing.

```python
# Python responses library for HTTP mocking
import responses
import requests

@responses.activate
def test_retry_on_error():
    # Simulate transient failures followed by success
    responses.add(responses.GET, "https://api.example.com/data", status=503)
    responses.add(responses.GET, "https://api.example.com/data", status=503)
    responses.add(responses.GET, "https://api.example.com/data", json={"ok": True})
    
    result = resilient_client.get_data()
    assert result["ok"] is True
    assert len(responses.calls) == 3  # Verify retry behavior
```

```javascript
// Node.js nock for HTTP mocking
const nock = require('nock');

describe('API Client', () => {
    beforeEach(() => {
        nock('https://api.example.com')
            .get('/users/1')
            .reply(200, { id: 1, name: 'John' });
    });
    
    afterEach(() => nock.cleanAll());
    
    it('should handle rate limiting', async () => {
        nock('https://api.example.com')
            .get('/users/1')
            .reply(429, { error: 'Too Many Requests' });
        
        await expect(apiClient.getUser(1)).rejects.toThrow('Rate limited');
    });
});
```

### Contract testing with Pact

**Consumer-driven contracts** ensure API compatibility between services. The consumer defines expected interactions, which providers verify against their implementation.

```javascript
// Pact consumer test
const { Pact, Matchers } = require('@pact-foundation/pact');

describe('User API Consumer', () => {
    const provider = new Pact({
        consumer: 'UserClient',
        provider: 'UserService',
        port: 1234
    });

    it('should get user by id', async () => {
        await provider.addInteraction({
            state: 'user with id 1 exists',
            uponReceiving: 'a request for user 1',
            withRequest: {
                method: 'GET',
                path: '/users/1'
            },
            willRespondWith: {
                status: 200,
                body: {
                    id: 1,
                    name: Matchers.string('John'),
                    email: Matchers.email()
                }
            }
        });
        
        const user = await userClient.getUser(1);
        expect(user.id).toBe(1);
    });
});
```

### Test data isolation strategies

For parallel test execution, each test needs isolated data to prevent interference:

```javascript
// Namespaced test data for isolation
class TestDataManager {
    constructor(testId) {
        this.namespace = `test_${testId}_${Date.now()}`;
    }
    
    createUser(data) {
        return this.db.insert('users', {
            ...data,
            email: `${this.namespace}_${data.email}`,
            _test_namespace: this.namespace
        });
    }
    
    async cleanup() {
        await this.db.delete('users', { _test_namespace: this.namespace });
    }
}
```

---

## Vendor-specific gotchas summary

**Stripe**: Webhook signature verification requires raw body before JSON parsing; different webhook secrets for test vs live mode; events can arrive out of order.

**PayPal**: Must return 200 within 30 seconds; webhook body must be posted back exactly as received for verification; mock simulator events don't support postback verification.

**Salesforce**: Governor limits reset per transaction; Mixed DML errors prevent updating setup and non-setup objects together; Bulk API doesn't support subqueries or aggregate functions; CDC events limited to 750K/day by default.

**HubSpot**: Batch contacts limited to 10 per call (other objects: 100); rate limits shared across all apps in account; custom object webhooks require "Expand object support" opt-in.

**Twilio**: 10DLC registration required for US A2P messaging; error codes 30003-30007 indicate delivery issues requiring different handling.

**AWS SES**: Requires sandbox exit approval; complex CloudWatch setup for delivery logs; higher operational overhead than managed alternatives.

**Apple Sign In**: Only sends user's name on first authentication—must store immediately; mandatory for iOS apps with any social login.

---

## Conclusion

Building reliable third-party integrations requires a layered approach: **architectural patterns** that match your scaling needs, **security practices** that protect sensitive data, **resilience mechanisms** that handle inevitable failures gracefully, and **testing strategies** that catch issues before production.

The most critical insights from production systems are: always use **exponential backoff with jitter** for retries, implement **idempotency** for all webhook processing, prefer **hosted payment fields** to minimize PCI scope, and set **explicit SLOs for external dependencies** that acknowledge their lower reliability than internal services. Combine webhooks with **polling fallbacks** for maximum reliability, and invest in **contract testing** to catch API compatibility issues early.

Start with the patterns that address your highest-risk integrations, then expand coverage as your system matures.