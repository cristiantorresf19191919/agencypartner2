"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function AuthenticationAuthorizationPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  return (
    <BlogContentLayout>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li>
            <ButtonLink href={createLocalizedPath("/")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("blog-breadcrumb-home")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li>
            <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("nav-blog")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>Authentication & Authorization</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Authentication & Authorization Patterns
        </Heading>
        <Text className={styles.subtitle}>
          Master production-grade authentication and authorization. Learn JWT deep dive, OAuth 2.0/OpenID Connect, session management, refresh token strategies, Role-Based Access Control (RBAC), and permission-based systems used by senior engineers.
        </Text>
      </div>

      {/* JWT Deep Dive */}
      <section id="jwt-deep-dive" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                1. JWT Deep Dive
              </Heading>
              <Text className={styles.sectionDescription}>
                JSON Web Tokens (JWT) are the foundation of modern stateless authentication. Understand their structure, security considerations, and production patterns.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                <strong>JWT Structure:</strong> Header.Payload.Signature
                <br />• <strong>Header:</strong> Algorithm and token type
                <br />• <strong>Payload:</strong> Claims (user data, expiration, etc.)
                <br />• <strong>Signature:</strong> Verifies token integrity
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ JWT Structure Explained
// Header: {"alg":"HS256","typ":"JWT"}
// Payload: {"sub":"user123","exp":1735689600,"iat":1735603200}
// Signature: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)

// ✅ JWT Implementation (Node.js/TypeScript)
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
}

// Generate secure secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const JWT_EXPIRES_IN = '15m'; // Access token: 15 minutes
const JWT_REFRESH_EXPIRES_IN = '7d'; // Refresh token: 7 days

// ✅ Create Access Token
function createAccessToken(payload: TokenPayload): string {
  return jwt.sign(
    {
      sub: payload.userId,
      email: payload.email,
      role: payload.role,
      sessionId: payload.sessionId,
      type: 'access'
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'my-app',
      audience: 'my-app-users'
    }
  );
}

// ✅ Create Refresh Token (longer expiration, stored in database)
function createRefreshToken(payload: TokenPayload): string {
  return jwt.sign(
    {
      sub: payload.userId,
      sessionId: payload.sessionId,
      type: 'refresh',
      tokenVersion: payload.sessionId // For token rotation
    },
    JWT_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'my-app',
      audience: 'my-app-users'
    }
  );
}

// ✅ Verify Token
interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  sessionId: string;
  type: string;
  exp: number;
  iat: number;
}

function verifyToken(token: string): DecodedToken {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'my-app',
      audience: 'my-app-users'
    }) as DecodedToken;
    
    // Additional validation
    if (decoded.exp < Date.now() / 1000) {
      throw new Error('Token expired');
    }
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw error;
  }
}

// ✅ Token Refresh Endpoint
async function refreshTokens(refreshToken: string) {
  // 1. Verify refresh token
  const decoded = verifyToken(refreshToken);
  
  if (decoded.type !== 'refresh') {
    throw new Error('Invalid token type');
  }
  
  // 2. Check if refresh token exists in database (token rotation)
  const session = await db.sessions.findUnique({
    where: { id: decoded.sessionId }
  });
  
  if (!session || session.refreshToken !== refreshToken) {
    throw new Error('Invalid refresh token');
  }
  
  // 3. Check if session is still valid
  if (session.revoked || session.expiresAt < new Date()) {
    throw new Error('Session expired');
  }
  
  // 4. Generate new tokens
  const newPayload = {
    userId: decoded.sub,
    email: session.user.email,
    role: session.user.role,
    sessionId: session.id
  };
  
  const newAccessToken = createAccessToken(newPayload);
  const newRefreshToken = createRefreshToken(newPayload);
  
  // 5. Update session with new refresh token (token rotation)
  await db.sessions.update({
    where: { id: session.id },
    data: {
      refreshToken: newRefreshToken,
      lastUsedAt: new Date()
    }
  });
  
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
}

// ✅ Secure Token Storage (Client-side)
// ❌ NEVER store tokens in localStorage (XSS vulnerable)
// ✅ Store in httpOnly cookies (recommended) or memory

// Client-side: Store in memory (React example)
const tokenStore = {
  accessToken: null as string | null,
  refreshToken: null as string | null,
  
  setTokens(access: string, refresh: string) {
    this.accessToken = access;
    // Refresh token should be in httpOnly cookie, not memory
    this.refreshToken = refresh;
  },
  
  getAccessToken(): string | null {
    return this.accessToken;
  },
  
  clear() {
    this.accessToken = null;
    this.refreshToken = null;
  }
};

// ✅ Axios Interceptor for Token Refresh
import axios, { AxiosError } from 'axios';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axios.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken();
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = \`Bearer \${token}\`;
            return axios(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const { data } = await axios.post('/api/auth/refresh', {
          refreshToken: tokenStore.refreshToken
        });
        
        const { accessToken, refreshToken } = data;
        tokenStore.setTokens(accessToken, refreshToken);
        processQueue(null, accessToken);
        
        originalRequest.headers.Authorization = \`Bearer \${accessToken}\`;
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        tokenStore.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* OAuth 2.0 / OpenID Connect */}
      <section id="oauth-oidc" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                2. OAuth 2.0 / OpenID Connect
              </Heading>
              <Text className={styles.sectionDescription}>
                Implement OAuth 2.0 and OpenID Connect for secure third-party authentication. Learn authorization flows, PKCE, and production patterns.
              </Text>
            </div>

            <CodeComparison
              language="markdown"
              wrong={`# ❌ WRONG: Authorization Code Flow without PKCE
# Vulnerable to authorization code interception attacks
# No code verifier/challenge
# Client secret exposed in frontend`}
              good={`# ✅ CORRECT: Authorization Code Flow with PKCE
# 1. Generate code verifier (random string)
# 2. Generate code challenge (SHA256 hash)
# 3. Exchange authorization code for tokens
# 4. Verify code verifier matches challenge
# Protects against authorization code interception`}
            />

            <CodeEditor
              code={`// ✅ OAuth 2.0 Authorization Code Flow with PKCE

// Step 1: Generate PKCE Code Verifier and Challenge
import crypto from 'crypto';

function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier: string): string {
  return crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');
}

// Step 2: Initiate Authorization (Client-side)
const oauthConfig = {
  clientId: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!,
  redirectUri: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI!,
  authorizationEndpoint: 'https://oauth-provider.com/authorize',
  tokenEndpoint: 'https://oauth-provider.com/token',
  scopes: ['openid', 'profile', 'email']
};

function initiateOAuthFlow() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  
  // Store verifier in session storage (will be used later)
  sessionStorage.setItem('oauth_code_verifier', codeVerifier);
  
  // Build authorization URL
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: oauthConfig.clientId,
    redirect_uri: oauthConfig.redirectUri,
    scope: oauthConfig.scopes.join(' '),
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state: crypto.randomBytes(16).toString('hex') // CSRF protection
  });
  
  // Store state for verification
  sessionStorage.setItem('oauth_state', params.get('state')!);
  
  // Redirect to authorization server
  window.location.href = \`\${oauthConfig.authorizationEndpoint}?\${params.toString()}\`;
}

// Step 3: Handle OAuth Callback (Server-side)
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, state } = req.query;
  
  // Verify state (CSRF protection)
  const storedState = req.cookies.oauth_state;
  if (state !== storedState) {
    return res.status(400).json({ error: 'Invalid state parameter' });
  }
  
  // Get code verifier from session
  const codeVerifier = req.cookies.oauth_code_verifier;
  if (!codeVerifier) {
    return res.status(400).json({ error: 'Code verifier not found' });
  }
  
  // Exchange authorization code for tokens
  try {
    const tokenResponse = await fetch(oauthConfig.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: oauthConfig.redirectUri,
        client_id: oauthConfig.clientId,
        code_verifier: codeVerifier
      })
    });
    
    const tokens = await tokenResponse.json();
    
    // tokens = {
    //   access_token: "...",
    //   refresh_token: "...",
    //   id_token: "...", // OpenID Connect
    //   expires_in: 3600,
    //   token_type: "Bearer"
    // }
    
    // Step 4: Verify ID Token (OpenID Connect)
    const idToken = await verifyIdToken(tokens.id_token);
    
    // Step 5: Create or update user session
    const user = await createOrUpdateUser({
      providerId: idToken.sub,
      email: idToken.email,
      name: idToken.name,
      picture: idToken.picture
    });
    
    // Step 6: Create application session
    const session = await createSession({
      userId: user.id,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      provider: 'oauth'
    });
    
    // Step 7: Set secure cookies
    res.setHeader('Set-Cookie', [
      \`sessionId=\${session.id}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600\`,
      \`accessToken=\${tokens.access_token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600\`
    ]);
    
    res.redirect('/dashboard');
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

// ✅ Verify ID Token (OpenID Connect)
import jwt from 'jsonwebtoken';

async function verifyIdToken(idToken: string) {
  // 1. Decode without verification to get header
  const decoded = jwt.decode(idToken, { complete: true });
  if (!decoded) {
    throw new Error('Invalid ID token');
  }
  
  // 2. Get public key from JWKS endpoint
  const jwksResponse = await fetch('https://oauth-provider.com/.well-known/jwks.json');
  const jwks = await jwksResponse.json();
  
  const key = jwks.keys.find((k: any) => k.kid === decoded.header.kid);
  if (!key) {
    throw new Error('Key not found');
  }
  
  // 3. Verify token
  const publicKey = convertJWKToPEM(key);
  const verified = jwt.verify(idToken, publicKey, {
    audience: oauthConfig.clientId,
    issuer: 'https://oauth-provider.com'
  });
  
  return verified as {
    sub: string;
    email: string;
    name: string;
    picture?: string;
    exp: number;
    iat: number;
  };
}

// ✅ OAuth Provider Implementation (Server-side)
// Example: Google OAuth with NextAuth.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at * 1000,
          user
        };
      }
      
      // Return previous token if still valid
      if (Date.now() < token.expiresAt) {
        return token;
      }
      
      // Token expired, refresh it
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    }
  }
});

// ✅ Refresh OAuth Token
async function refreshAccessToken(token: any) {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken
      })
    });
    
    const refreshedTokens = await response.json();
    
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Session Management */}
      <section id="session-management" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                3. Session Management
              </Heading>
              <Text className={styles.sectionDescription}>
                Implement secure session management with proper storage, rotation, and invalidation strategies.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Session Management Implementation

interface Session {
  id: string;
  userId: string;
  refreshToken: string;
  accessToken: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  expiresAt: Date;
  lastUsedAt: Date;
  revoked: boolean;
}

// ✅ Create Session
async function createSession(userId: string, req: Request): Promise<Session> {
  const sessionId = crypto.randomUUID();
  const accessToken = createAccessToken({ userId, sessionId });
  const refreshToken = createRefreshToken({ userId, sessionId });
  
  const session = await db.sessions.create({
    data: {
      id: sessionId,
      userId,
      refreshToken: await hashToken(refreshToken), // Store hashed
      accessToken: await hashToken(accessToken),
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent'] || '',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      lastUsedAt: new Date()
    }
  });
  
  return session;
}

// ✅ Validate Session
async function validateSession(sessionId: string, accessToken: string): Promise<Session | null> {
  const session = await db.sessions.findUnique({
    where: { id: sessionId },
    include: { user: true }
  });
  
  if (!session) {
    return null;
  }
  
  // Check if session is revoked
  if (session.revoked) {
    return null;
  }
  
  // Check if session expired
  if (session.expiresAt < new Date()) {
    await db.sessions.update({
      where: { id: sessionId },
      data: { revoked: true }
    });
    return null;
  }
  
  // Verify access token matches
  const tokenHash = await hashToken(accessToken);
  if (tokenHash !== session.accessToken) {
    return null;
  }
  
  // Update last used timestamp
  await db.sessions.update({
    where: { id: sessionId },
    data: { lastUsedAt: new Date() }
  });
  
  return session;
}

// ✅ Session Rotation (Security Best Practice)
async function rotateSession(oldSessionId: string, refreshToken: string): Promise<Session> {
  // 1. Validate old session
  const oldSession = await db.sessions.findUnique({
    where: { id: oldSessionId }
  });
  
  if (!oldSession || oldSession.revoked) {
    throw new Error('Invalid session');
  }
  
  // 2. Verify refresh token
  const refreshTokenHash = await hashToken(refreshToken);
  if (refreshTokenHash !== oldSession.refreshToken) {
    throw new Error('Invalid refresh token');
  }
  
  // 3. Revoke old session
  await db.sessions.update({
    where: { id: oldSessionId },
    data: { revoked: true }
  });
  
  // 4. Create new session
  const newSession = await createSession(oldSession.userId, req);
  
  return newSession;
}

// ✅ Revoke Session (Logout)
async function revokeSession(sessionId: string): Promise<void> {
  await db.sessions.update({
    where: { id: sessionId },
    data: { revoked: true }
  });
}

// ✅ Revoke All User Sessions (Password Change, Security Breach)
async function revokeAllUserSessions(userId: string, exceptSessionId?: string): Promise<void> {
  await db.sessions.updateMany({
    where: {
      userId,
      id: exceptSessionId ? { not: exceptSessionId } : undefined,
      revoked: false
    },
    data: { revoked: true }
  });
}

// ✅ Session Middleware (Express/Next.js)
import { NextApiRequest, NextApiResponse } from 'next';

export async function sessionMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  const sessionId = req.cookies.sessionId;
  const accessToken = req.headers.authorization?.replace('Bearer ', '');
  
  if (!sessionId || !accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const session = await validateSession(sessionId, accessToken);
  
  if (!session) {
    res.setHeader('Set-Cookie', 'sessionId=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');
    return res.status(401).json({ error: 'Invalid session' });
  }
  
  // Attach session to request
  (req as any).session = session;
  (req as any).user = session.user;
  
  next();
}

// ✅ Session Security Headers
function setSecurityHeaders(res: NextApiResponse) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
}

// ✅ Session Storage Options Comparison
const sessionStorageOptions = {
  // Option 1: Database (Recommended for production)
  database: {
    pros: [
      'Can revoke sessions server-side',
      'Can track active sessions',
      'Can implement session rotation',
      'Works across multiple servers'
    ],
    cons: [
      'Database query on every request',
      'Requires database connection'
    ]
  },
  
  // Option 2: Redis (Recommended for high-traffic)
  redis: {
    pros: [
      'Fast in-memory access',
      'Built-in expiration',
      'Can revoke sessions',
      'Works across multiple servers'
    ],
    cons: [
      'Requires Redis infrastructure',
      'Sessions lost on Redis restart (unless persisted)'
    ]
  },
  
  // Option 3: JWT (Stateless, but limited)
  jwt: {
    pros: [
      'No server-side storage needed',
      'Scalable',
      'Works across servers'
    ],
    cons: [
      'Cannot revoke sessions until expiration',
      'Cannot track active sessions',
      'Larger token size'
    ]
  }
};

// ✅ Redis Session Store Implementation
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

async function createRedisSession(sessionId: string, data: Session, ttl: number = 3600) {
  await redis.setex(
    \`session:\${sessionId}\`,
    ttl,
    JSON.stringify(data)
  );
}

async function getRedisSession(sessionId: string): Promise<Session | null> {
  const data = await redis.get(\`session:\${sessionId}\`);
  return data ? JSON.parse(data) : null;
}

async function deleteRedisSession(sessionId: string) {
  await redis.del(\`session:\${sessionId}\`);
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Refresh Token Strategies */}
      <section id="refresh-tokens" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                4. Refresh Token Strategies
              </Heading>
              <Text className={styles.sectionDescription}>
                Implement secure refresh token patterns: rotation, reuse detection, and automatic token refresh.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Refresh Token Rotation (Security Best Practice)
// When refresh token is used, invalidate it and issue new one

async function refreshTokensWithRotation(
  oldRefreshToken: string,
  sessionId: string
) {
  // 1. Find session
  const session = await db.sessions.findUnique({
    where: { id: sessionId }
  });
  
  if (!session || session.revoked) {
    throw new Error('Invalid session');
  }
  
  // 2. Verify refresh token
  const tokenHash = await hashToken(oldRefreshToken);
  if (tokenHash !== session.refreshToken) {
    // Potential token reuse attack - revoke all sessions
    await revokeAllUserSessions(session.userId);
    throw new Error('Invalid refresh token - security breach detected');
  }
  
  // 3. Check if token was already used (reuse detection)
  if (session.refreshTokenUsed) {
    // Token reuse detected - revoke all sessions
    await revokeAllUserSessions(session.userId);
    throw new Error('Refresh token reuse detected - security breach');
  }
  
  // 4. Mark old refresh token as used
  await db.sessions.update({
    where: { id: sessionId },
    data: { refreshTokenUsed: true }
  });
  
  // 5. Generate new tokens
  const newAccessToken = createAccessToken({
    userId: session.userId,
    sessionId: session.id
  });
  
  const newRefreshToken = createRefreshToken({
    userId: session.userId,
    sessionId: session.id
  });
  
  // 6. Update session with new refresh token
  await db.sessions.update({
    where: { id: sessionId },
    data: {
      refreshToken: await hashToken(newRefreshToken),
      refreshTokenUsed: false,
      lastUsedAt: new Date()
    }
  });
  
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
}

// ✅ Automatic Token Refresh (Client-side)
class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;
  
  async getAccessToken(): Promise<string> {
    // If token exists and not expired, return it
    if (this.accessToken && !this.isTokenExpired(this.accessToken)) {
      return this.accessToken;
    }
    
    // If refresh in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    
    // Start refresh
    this.refreshPromise = this.refreshTokens();
    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }
  
  private async refreshTokens(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      });
      
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      
      const { accessToken, refreshToken } = await response.json();
      
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      
      return accessToken;
    } catch (error) {
      // Refresh failed - redirect to login
      this.clearTokens();
      window.location.href = '/login';
      throw error;
    }
  }
  
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
  
  private clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
  }
}

// ✅ Refresh Token Sliding Window
// Extend expiration on each use (up to max lifetime)

async function refreshWithSlidingWindow(
  refreshToken: string,
  sessionId: string
) {
  const session = await db.sessions.findUnique({
    where: { id: sessionId }
  });
  
  if (!session) {
    throw new Error('Invalid session');
  }
  
  // Calculate new expiration (sliding window)
  const now = new Date();
  const maxLifetime = new Date(session.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days max
  const newExpiration = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  
  const expiresAt = newExpiration > maxLifetime ? maxLifetime : newExpiration;
  
  // Generate new tokens
  const newAccessToken = createAccessToken({
    userId: session.userId,
    sessionId: session.id
  });
  
  const newRefreshToken = createRefreshToken({
    userId: session.userId,
    sessionId: session.id
  });
  
  // Update session
  await db.sessions.update({
    where: { id: sessionId },
    data: {
      refreshToken: await hashToken(newRefreshToken),
      expiresAt,
      lastUsedAt: now
    }
  });
  
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    expiresAt
  };
}

// ✅ Refresh Token Family (Prevent Token Replay)
// Track token family to detect stolen token usage

interface TokenFamily {
  id: string;
  userId: string;
  currentToken: string;
  createdAt: Date;
}

async function refreshWithFamily(
  refreshToken: string,
  sessionId: string
) {
  const session = await db.sessions.findUnique({
    where: { id: sessionId },
    include: { tokenFamily: true }
  });
  
  if (!session) {
    throw new Error('Invalid session');
  }
  
  // Check if token matches current family token
  const tokenHash = await hashToken(refreshToken);
  if (tokenHash !== session.tokenFamily.currentToken) {
    // Token from different family - potential attack
    await revokeAllUserSessions(session.userId);
    throw new Error('Token family mismatch');
  }
  
  // Generate new tokens
  const newAccessToken = createAccessToken({
    userId: session.userId,
    sessionId: session.id
  });
  
  const newRefreshToken = createRefreshToken({
    userId: session.userId,
    sessionId: session.id
  });
  
  // Update token family
  await db.tokenFamilies.update({
    where: { id: session.tokenFamily.id },
    data: {
      currentToken: await hashToken(newRefreshToken),
      lastUsedAt: new Date()
    }
  });
  
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Role-Based Access Control (RBAC) */}
      <section id="rbac" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                5. Role-Based Access Control (RBAC)
              </Heading>
              <Text className={styles.sectionDescription}>
                Implement hierarchical role-based access control with role inheritance and permission checking.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ RBAC Implementation

enum Role {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  EDITOR = 'editor',
  USER = 'user',
  GUEST = 'guest'
}

// Role hierarchy (higher = more permissions)
const roleHierarchy: Record<Role, number> = {
  [Role.ADMIN]: 100,
  [Role.MODERATOR]: 75,
  [Role.EDITOR]: 50,
  [Role.USER]: 25,
  [Role.GUEST]: 0
};

// Permissions per role
const rolePermissions: Record<Role, string[]> = {
  [Role.ADMIN]: [
    'users.create',
    'users.read',
    'users.update',
    'users.delete',
    'posts.create',
    'posts.read',
    'posts.update',
    'posts.delete',
    'posts.moderate',
    'system.configure'
  ],
  [Role.MODERATOR]: [
    'posts.read',
    'posts.moderate',
    'comments.moderate',
    'users.read'
  ],
  [Role.EDITOR]: [
    'posts.create',
    'posts.read',
    'posts.update',
    'posts.delete'
  ],
  [Role.USER]: [
    'posts.read',
    'posts.create',
    'comments.create',
    'comments.read'
  ],
  [Role.GUEST]: [
    'posts.read',
    'comments.read'
  ]
};

// ✅ Check Permission
function hasPermission(userRole: Role, permission: string): boolean {
  const permissions = rolePermissions[userRole] || [];
  return permissions.includes(permission);
}

// ✅ Check if Role Has Higher Privileges
function hasHigherRole(role1: Role, role2: Role): boolean {
  return roleHierarchy[role1] > roleHierarchy[role2];
}

// ✅ RBAC Middleware
import { NextApiRequest, NextApiResponse } from 'next';

export function requirePermission(permission: string) {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!hasPermission(user.role, permission)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
}

// ✅ Usage Example
app.get('/api/posts/:id/delete',
  sessionMiddleware,
  requirePermission('posts.delete'),
  async (req, res) => {
    // User has permission, proceed
    await deletePost(req.params.id);
    res.json({ success: true });
  }
);

// ✅ Resource-Based RBAC
// Check if user owns the resource or has admin role

async function canAccessResource(
  userId: string,
  userRole: Role,
  resourceId: string,
  resourceType: 'post' | 'comment' | 'user'
): Promise<boolean> {
  // Admins can access everything
  if (userRole === Role.ADMIN) {
    return true;
  }
  
  // Check ownership
  const resource = await db[resourceType].findUnique({
    where: { id: resourceId }
  });
  
  if (!resource) {
    return false;
  }
  
  // Check if user owns the resource
  const ownerField = resourceType === 'user' ? 'id' : 'userId';
  return resource[ownerField] === userId;
}

// ✅ RBAC Decorator (TypeScript)
function RequireRole(...roles: Role[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const req = args[0] as NextApiRequest;
      const user = (req as any).user;
      
      if (!user) {
        throw new Error('Unauthorized');
      }
      
      if (!roles.includes(user.role)) {
        throw new Error('Forbidden');
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

// Usage
class PostController {
  @RequireRole(Role.ADMIN, Role.MODERATOR)
  async moderatePost(req: NextApiRequest, res: NextApiResponse) {
    // Only admins and moderators can access
  }
}

// ✅ Dynamic Role Assignment
interface RoleAssignment {
  userId: string;
  role: Role;
  resourceType?: string;
  resourceId?: string;
  expiresAt?: Date;
}

async function assignRole(assignment: RoleAssignment) {
  await db.roleAssignments.create({
    data: {
      userId: assignment.userId,
      role: assignment.role,
      resourceType: assignment.resourceType,
      resourceId: assignment.resourceId,
      expiresAt: assignment.expiresAt
    }
  });
}

// ✅ Check User's Effective Role (considering assignments)
async function getEffectiveRole(
  userId: string,
  resourceType?: string,
  resourceId?: string
): Promise<Role> {
  // Get base role from user
  const user = await db.users.findUnique({
    where: { id: userId }
  });
  
  let effectiveRole = user.role;
  
  // Check for resource-specific role assignments
  if (resourceType && resourceId) {
    const assignment = await db.roleAssignments.findFirst({
      where: {
        userId,
        resourceType,
        resourceId,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    if (assignment && hasHigherRole(assignment.role, effectiveRole)) {
      effectiveRole = assignment.role;
    }
  }
  
  return effectiveRole;
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Permission-Based Systems */}
      <section id="permission-based" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                6. Permission-Based Systems
              </Heading>
              <Text className={styles.sectionDescription}>
                Fine-grained permission systems that go beyond roles, allowing granular control over user actions.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Permission-Based Access Control (PBAC)

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}

interface UserPermission {
  userId: string;
  permissionId: string;
  granted: boolean;
  resourceId?: string; // Optional: resource-specific permission
  expiresAt?: Date;
}

// ✅ Permission Structure
const permissions: Permission[] = [
  { id: '1', name: 'posts.create', resource: 'posts', action: 'create', description: 'Create posts' },
  { id: '2', name: 'posts.read', resource: 'posts', action: 'read', description: 'Read posts' },
  { id: '3', name: 'posts.update', resource: 'posts', action: 'update', description: 'Update posts' },
  { id: '4', name: 'posts.delete', resource: 'posts', action: 'delete', description: 'Delete posts' },
  { id: '5', name: 'posts.moderate', resource: 'posts', action: 'moderate', description: 'Moderate posts' },
  { id: '6', name: 'users.manage', resource: 'users', action: 'manage', description: 'Manage users' },
  { id: '7', name: 'system.configure', resource: 'system', action: 'configure', description: 'Configure system' }
];

// ✅ Check User Permission
async function hasUserPermission(
  userId: string,
  permissionName: string,
  resourceId?: string
): Promise<boolean> {
  // Get user's role
  const user = await db.users.findUnique({
    where: { id: userId },
    include: { role: true }
  });
  
  // Check role-based permissions first
  const rolePermissions = rolePermissions[user.role.name] || [];
  if (rolePermissions.includes(permissionName)) {
    return true;
  }
  
  // Check explicit user permissions
  const userPermission = await db.userPermissions.findFirst({
    where: {
      userId,
      permission: { name: permissionName },
      granted: true,
      OR: [
        { resourceId: resourceId || null },
        { resourceId: null } // Global permission
      ],
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    }
  });
  
  return !!userPermission;
}

// ✅ Grant Permission to User
async function grantPermission(
  userId: string,
  permissionName: string,
  resourceId?: string,
  expiresAt?: Date
) {
  const permission = await db.permissions.findUnique({
    where: { name: permissionName }
  });
  
  if (!permission) {
    throw new Error('Permission not found');
  }
  
  await db.userPermissions.create({
    data: {
      userId,
      permissionId: permission.id,
      granted: true,
      resourceId,
      expiresAt
    }
  });
}

// ✅ Revoke Permission
async function revokePermission(
  userId: string,
  permissionName: string,
  resourceId?: string
) {
  const permission = await db.permissions.findUnique({
    where: { name: permissionName }
  });
  
  await db.userPermissions.updateMany({
    where: {
      userId,
      permissionId: permission.id,
      resourceId: resourceId || null
    },
    data: { granted: false }
  });
}

// ✅ Permission Middleware
export function requirePermission(permissionName: string) {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const user = (req as any).user;
    const resourceId = req.params.id || req.query.resourceId;
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const hasPermission = await hasUserPermission(
      user.id,
      permissionName,
      resourceId
    );
    
    if (!hasPermission) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
}

// ✅ Permission Check Hook (React)
function usePermission(permissionName: string, resourceId?: string) {
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      setHasPermission(false);
      setLoading(false);
      return;
    }
    
    checkPermission(user.id, permissionName, resourceId)
      .then(setHasPermission)
      .finally(() => setLoading(false));
  }, [user, permissionName, resourceId]);
  
  return { hasPermission, loading };
}

// Usage in component
function DeletePostButton({ postId }: { postId: string }) {
  const { hasPermission } = usePermission('posts.delete', postId);
  
  if (!hasPermission) {
    return null;
  }
  
  return <button onClick={() => deletePost(postId)}>Delete</button>;
}

// ✅ Permission Groups
interface PermissionGroup {
  id: string;
  name: string;
  permissions: string[];
}

const permissionGroups: PermissionGroup[] = [
  {
    id: 'content-manager',
    name: 'Content Manager',
    permissions: [
      'posts.create',
      'posts.read',
      'posts.update',
      'posts.delete'
    ]
  },
  {
    id: 'moderator',
    name: 'Moderator',
    permissions: [
      'posts.read',
      'posts.moderate',
      'comments.moderate'
    ]
  }
];

// ✅ Assign Permission Group
async function assignPermissionGroup(
  userId: string,
  groupId: string
) {
  const group = permissionGroups.find(g => g.id === groupId);
  if (!group) {
    throw new Error('Permission group not found');
  }
  
  // Grant all permissions in the group
  for (const permissionName of group.permissions) {
    await grantPermission(userId, permissionName);
  }
}

// ✅ Conditional Permissions (Based on Resource State)
async function canPerformAction(
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string
): Promise<boolean> {
  // Get resource
  const resource = await db[resourceType].findUnique({
    where: { id: resourceId }
  });
  
  if (!resource) {
    return false;
  }
  
  // Check base permission
  const hasBasePermission = await hasUserPermission(
    userId,
    \`\${resourceType}.\${action}\`,
    resourceId
  );
  
  if (!hasBasePermission) {
    return false;
  }
  
  // Check resource-specific conditions
  if (resourceType === 'post') {
    // Can't delete published posts unless admin
    if (action === 'delete' && resource.published) {
      const user = await db.users.findUnique({ where: { id: userId } });
      return user.role === Role.ADMIN;
    }
    
    // Can't edit posts older than 30 days
    if (action === 'update') {
      const daysSinceCreation = (Date.now() - resource.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCreation > 30) {
        return false;
      }
    }
  }
  
  return true;
}

// ✅ Permission Caching (Performance Optimization)
import NodeCache from 'node-cache';

const permissionCache = new NodeCache({ stdTTL: 300 }); // 5 minutes

async function hasUserPermissionCached(
  userId: string,
  permissionName: string,
  resourceId?: string
): Promise<boolean> {
  const cacheKey = \`\${userId}:\${permissionName}:\${resourceId || 'global'}\`;
  
  const cached = permissionCache.get<boolean>(cacheKey);
  if (cached !== undefined) {
    return cached;
  }
  
  const hasPermission = await hasUserPermission(userId, permissionName, resourceId);
  permissionCache.set(cacheKey, hasPermission);
  
  return hasPermission;
}

// ✅ Invalidate Permission Cache
function invalidatePermissionCache(userId: string) {
  const keys = permissionCache.keys();
  keys.forEach(key => {
    if (key.startsWith(\`\${userId}:\`)) {
      permissionCache.del(key);
    }
  });
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}

