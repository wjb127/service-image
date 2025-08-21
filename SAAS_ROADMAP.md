# 🚀 SaaS 전환 로드맵 - Service Image Generator

## 📋 프로젝트 개요

현재의 썸네일/이미지 생성 도구를 완전한 SaaS 플랫폼으로 전환하기 위한 상세 로드맵입니다.

### 🎯 비전
"마케터와 디자이너를 위한 AI 기반 비주얼 컨텐츠 생성 플랫폼"

### 💰 목표 지표
- **6개월 목표**: MAU 10,000명, 유료 전환율 5%, MRR $5,000
- **1년 목표**: MAU 50,000명, 유료 전환율 8%, MRR $25,000

---

## 📊 Phase 1: 기획 및 설계 (2-3주)

### 1.1 비즈니스 모델 설계

#### 가격 정책
| 플랜 | 가격 | 기능 | 타겟 |
|------|------|------|------|
| **Free** | $0/월 | • 월 5장 생성<br>• 기본 템플릿<br>• 워터마크 포함 | 개인 사용자 |
| **Pro** | $19/월 | • 월 100장 생성<br>• AI 어시스턴트<br>• 프리미엄 템플릿<br>• 워터마크 제거 | 프리랜서, 소규모 팀 |
| **Enterprise** | $99/월 | • 무제한 생성<br>• 팀 협업<br>• API 액세스<br>• 우선 지원 | 기업, 에이전시 |

#### 퍼널 메트릭 정의
```
방문자 → 회원가입 (30% CVR)
   ↓
무료 사용자 → 활성 사용자 (50% Activation)
   ↓
활성 사용자 → 유료 전환 (5% Paid Conversion)
   ↓
유료 사용자 → 리텐션 (80% Monthly Retention)
```

### 1.2 데이터베이스 스키마

```sql
-- Users 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  subscription_tier ENUM('free', 'pro', 'enterprise'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Projects 테이블
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255),
  template_type VARCHAR(50),
  config JSONB,
  thumbnail_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Templates 테이블
CREATE TABLE templates (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  category VARCHAR(50),
  is_premium BOOLEAN DEFAULT false,
  config JSONB,
  preview_url TEXT,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP
);

-- Subscriptions 테이블
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  status VARCHAR(50),
  current_period_end TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Usage 테이블
CREATE TABLE usage (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP
);
```

### 1.3 API 엔드포인트 설계

```typescript
// 인증 관련
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

// 사용자 관련
GET    /api/users/me
PUT    /api/users/me
DELETE /api/users/me
GET    /api/users/me/usage
GET    /api/users/me/subscription

// 프로젝트 관련
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/:id/duplicate
POST   /api/projects/:id/export

// 템플릿 관련
GET    /api/templates
GET    /api/templates/:id
POST   /api/templates/:id/use

// 결제 관련
POST   /api/payments/create-checkout-session
POST   /api/payments/webhook
GET    /api/payments/invoices
POST   /api/payments/cancel-subscription

// AI 어시스턴트
POST   /api/ai/generate-design
POST   /api/ai/improve-design
POST   /api/ai/suggest-text
```

---

## 🔐 Phase 2: 인증 시스템 구현 (1-2주)

### 2.1 NextAuth.js 설정

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import KakaoProvider from "next-auth/providers/kakao"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session?.user) {
        session.user.id = user.id
        session.user.subscriptionTier = user.subscriptionTier
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### 2.2 인증 미들웨어

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/projects/:path*",
    "/api/users/:path*",
  ],
}
```

---

## 💳 Phase 3: 결제 시스템 통합 (2-3주)

### 3.1 토스페이먼츠 통합

```typescript
// lib/tosspayments.ts
import { TossPayments } from '@tosspayments/sdk'

const tossPayments = new TossPayments({
  clientKey: process.env.TOSS_CLIENT_KEY!,
  secretKey: process.env.TOSS_SECRET_KEY!,
})

export async function createBillingKey(customerId: string, cardInfo: CardInfo) {
  const billingKey = await tossPayments.billing.createBillingKey({
    customerId,
    cardNumber: cardInfo.number,
    cardExpirationYear: cardInfo.expYear,
    cardExpirationMonth: cardInfo.expMonth,
    cardPassword: cardInfo.password,
    birthOrBusinessRegistrationNumber: cardInfo.birthDate,
    customerName: cardInfo.holderName,
    customerEmail: cardInfo.email,
  })
  return billingKey
}

export async function createSubscription(
  customerId: string,
  planId: string,
  billingKey: string
) {
  const subscription = await tossPayments.billing.requestBilling({
    billingKey,
    customerKey: customerId,
    amount: getPlanPrice(planId),
    orderId: generateOrderId(),
    orderName: `${planId} 플랜 구독`,
    successUrl: `${process.env.NEXT_PUBLIC_URL}/api/payments/success`,
    failUrl: `${process.env.NEXT_PUBLIC_URL}/api/payments/fail`,
  })
  return subscription
}
```

### 3.2 Stripe 대안 구현

```typescript
// lib/stripe.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function createCheckoutSession(
  userId: string,
  priceId: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: userId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing?canceled=true`,
  })
  return session
}

export async function handleWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object)
      break
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object)
      break
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object)
      break
  }
}
```

---

## 👤 Phase 4: 사용자 대시보드 (3주)

### 4.1 대시보드 레이아웃

```typescript
// app/dashboard/layout.tsx
import { Sidebar } from '@/components/dashboard/sidebar'
import { TopBar } from '@/components/dashboard/topbar'
import { UsageWidget } from '@/components/dashboard/usage-widget'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="flex-1 p-6 overflow-auto">
          <UsageWidget />
          {children}
        </div>
      </div>
    </div>
  )
}
```

### 4.2 프로젝트 관리 페이지

```typescript
// app/dashboard/projects/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { ProjectCard } from '@/components/projects/project-card'
import { CreateProjectDialog } from '@/components/projects/create-dialog'
import { useProjects } from '@/hooks/use-projects'

export default function ProjectsPage() {
  const { projects, loading, createProject, deleteProject } = useProjects()
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">내 프로젝트</h1>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          새 프로젝트
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={() => deleteProject(project.id)}
          />
        ))}
      </div>

      {showCreateDialog && (
        <CreateProjectDialog
          onClose={() => setShowCreateDialog(false)}
          onCreate={createProject}
        />
      )}
    </div>
  )
}
```

---

## 📊 Phase 5: 퍼널 분석 시스템 (1-2주)

### 5.1 Mixpanel 통합

```typescript
// lib/analytics.ts
import mixpanel from 'mixpanel-browser'

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!, {
  debug: process.env.NODE_ENV === 'development',
  track_pageview: true,
  persistence: 'localStorage',
})

export const Analytics = {
  identify: (userId: string, traits?: Record<string, any>) => {
    mixpanel.identify(userId)
    if (traits) mixpanel.people.set(traits)
  },

  track: (event: string, properties?: Record<string, any>) => {
    mixpanel.track(event, properties)
  },

  // 퍼널 이벤트
  trackSignup: (method: string) => {
    mixpanel.track('Sign Up', { method })
  },

  trackProjectCreated: (templateType: string) => {
    mixpanel.track('Project Created', { template_type: templateType })
  },

  trackImageExported: (format: string) => {
    mixpanel.track('Image Exported', { format })
  },

  trackSubscriptionStarted: (plan: string) => {
    mixpanel.track('Subscription Started', { plan })
  },

  trackSubscriptionCancelled: (reason?: string) => {
    mixpanel.track('Subscription Cancelled', { reason })
  },
}
```

### 5.2 퍼널 리포트 대시보드

```typescript
// components/admin/funnel-report.tsx
import { useEffect, useState } from 'react'
import { Line, Funnel } from 'react-chartjs-2'

interface FunnelData {
  visitors: number
  signups: number
  activated: number
  paid: number
  retained: number
}

export function FunnelReport() {
  const [data, setData] = useState<FunnelData | null>(null)

  useEffect(() => {
    fetchFunnelData().then(setData)
  }, [])

  if (!data) return <div>Loading...</div>

  const conversionRates = {
    signup: ((data.signups / data.visitors) * 100).toFixed(1),
    activation: ((data.activated / data.signups) * 100).toFixed(1),
    payment: ((data.paid / data.activated) * 100).toFixed(1),
    retention: ((data.retained / data.paid) * 100).toFixed(1),
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">전환 퍼널 분석</h2>
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="방문자 → 가입"
          value={`${conversionRates.signup}%`}
          count={data.signups}
        />
        <MetricCard
          title="가입 → 활성화"
          value={`${conversionRates.activation}%`}
          count={data.activated}
        />
        <MetricCard
          title="활성화 → 결제"
          value={`${conversionRates.payment}%`}
          count={data.paid}
        />
        <MetricCard
          title="결제 → 리텐션"
          value={`${conversionRates.retention}%`}
          count={data.retained}
        />
      </div>

      <FunnelChart data={data} />
    </div>
  )
}
```

---

## ⚡ Phase 6: 성능 최적화 (2주)

### 6.1 Rate Limiting

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// API Rate Limiting 설정
export const rateLimiter = {
  free: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'), // 시간당 5회
    analytics: true,
  }),
  pro: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 h'), // 시간당 100회
    analytics: true,
  }),
  enterprise: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1000, '1 h'), // 시간당 1000회
    analytics: true,
  }),
}

// 미들웨어에서 사용
export async function checkRateLimit(
  userId: string,
  tier: 'free' | 'pro' | 'enterprise'
) {
  const { success, limit, reset, remaining } = await rateLimiter[tier].limit(
    userId
  )
  
  return {
    success,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': new Date(reset).toISOString(),
    },
  }
}
```

### 6.2 이미지 생성 큐

```typescript
// lib/queue.ts
import { Queue, Worker } from 'bullmq'
import { Redis } from 'ioredis'

const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!),
  password: process.env.REDIS_PASSWORD,
})

// 이미지 생성 큐
export const imageQueue = new Queue('image-generation', {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
})

// 워커 설정
const imageWorker = new Worker(
  'image-generation',
  async (job) => {
    const { projectId, config, userId } = job.data
    
    // 이미지 생성 로직
    const imageUrl = await generateImage(config)
    
    // S3 업로드
    const s3Url = await uploadToS3(imageUrl, projectId)
    
    // DB 업데이트
    await updateProject(projectId, { thumbnail_url: s3Url })
    
    // 사용자에게 알림
    await notifyUser(userId, 'IMAGE_READY', { projectId, imageUrl: s3Url })
    
    return { success: true, imageUrl: s3Url }
  },
  { connection }
)

// 이미지 생성 요청
export async function requestImageGeneration(
  projectId: string,
  config: any,
  userId: string
) {
  const job = await imageQueue.add('generate', {
    projectId,
    config,
    userId,
  })
  
  return job.id
}
```

---

## 🎨 Phase 7: 랜딩 페이지 (1주)

### 7.1 메인 랜딩 페이지

```typescript
// app/page.tsx
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Templates } from '@/components/landing/templates'
import { Pricing } from '@/components/landing/pricing'
import { Testimonials } from '@/components/landing/testimonials'
import { CTA } from '@/components/landing/cta'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Templates />
      <Pricing />
      <Testimonials />
      <CTA />
    </>
  )
}
```

### 7.2 온보딩 플로우

```typescript
// app/onboarding/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const steps = [
  { id: 'welcome', title: '환영합니다!' },
  { id: 'usage', title: '어떤 용도로 사용하시나요?' },
  { id: 'templates', title: '관심있는 템플릿을 선택하세요' },
  { id: 'first-project', title: '첫 프로젝트를 만들어보세요' },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [userData, setUserData] = useState({})
  const router = useRouter()

  const handleComplete = async () => {
    await saveOnboardingData(userData)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="w-full max-w-2xl p-8"
      >
        <StepIndicator steps={steps} current={currentStep} />
        
        {currentStep === 0 && <WelcomeStep />}
        {currentStep === 1 && <UsageStep onSelect={(usage) => setUserData({...userData, usage})} />}
        {currentStep === 2 && <TemplatesStep onSelect={(templates) => setUserData({...userData, templates})} />}
        {currentStep === 3 && <FirstProjectStep onComplete={handleComplete} />}
        
        <NavigationButtons
          onPrev={() => setCurrentStep(Math.max(0, currentStep - 1))}
          onNext={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          canPrev={currentStep > 0}
          canNext={currentStep < steps.length - 1}
        />
      </motion.div>
    </div>
  )
}
```

---

## 📧 Phase 8: 이메일 시스템 (1주)

### 8.1 이메일 템플릿

```typescript
// lib/email/templates.tsx
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// 웰컴 이메일
export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: 'Service Image <hello@serviceimage.com>',
    to,
    subject: '🎉 Service Image에 오신 것을 환영합니다!',
    react: <WelcomeEmail name={name} />,
  })
}

// 결제 성공 이메일
export async function sendPaymentSuccessEmail(
  to: string,
  plan: string,
  amount: number
) {
  await resend.emails.send({
    from: 'Service Image <billing@serviceimage.com>',
    to,
    subject: '✅ 결제가 완료되었습니다',
    react: <PaymentSuccessEmail plan={plan} amount={amount} />,
  })
}

// 사용량 경고 이메일
export async function sendUsageWarningEmail(
  to: string,
  usage: number,
  limit: number
) {
  await resend.emails.send({
    from: 'Service Image <notifications@serviceimage.com>',
    to,
    subject: '⚠️ 월간 사용량 80% 도달',
    react: <UsageWarningEmail usage={usage} limit={limit} />,
  })
}
```

---

## 🛠️ Phase 9: 관리자 패널 (2주)

### 9.1 관리자 대시보드

```typescript
// app/admin/page.tsx
import { Stats } from '@/components/admin/stats'
import { UserManagement } from '@/components/admin/user-management'
import { RevenueChart } from '@/components/admin/revenue-chart'
import { SystemHealth } from '@/components/admin/system-health'

export default async function AdminDashboard() {
  const stats = await getAdminStats()
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">관리자 대시보드</h1>
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="총 사용자" value={stats.totalUsers} change={stats.userGrowth} />
        <StatCard title="유료 사용자" value={stats.paidUsers} change={stats.paidGrowth} />
        <StatCard title="MRR" value={`$${stats.mrr}`} change={stats.mrrGrowth} />
        <StatCard title="이탈률" value={`${stats.churnRate}%`} change={stats.churnChange} />
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <RevenueChart />
        <SystemHealth />
      </div>
      
      <UserManagement />
    </div>
  )
}
```

---

## 🧪 Phase 10: 테스트 및 QA (2주)

### 10.1 E2E 테스트

```typescript
// tests/e2e/user-journey.spec.ts
import { test, expect } from '@playwright/test'

test.describe('사용자 여정 테스트', () => {
  test('회원가입 → 프로젝트 생성 → 결제', async ({ page }) => {
    // 1. 랜딩 페이지 방문
    await page.goto('/')
    await expect(page).toHaveTitle('Service Image - AI 썸네일 생성')
    
    // 2. 회원가입
    await page.click('text=무료로 시작하기')
    await page.fill('[name=email]', 'test@example.com')
    await page.fill('[name=password]', 'Test123!@#')
    await page.click('button[type=submit]')
    
    // 3. 온보딩 완료
    await page.click('text=다음')
    await page.click('text=마케터')
    await page.click('text=다음')
    await page.click('[data-template=youtube]')
    await page.click('text=시작하기')
    
    // 4. 프로젝트 생성
    await page.click('text=새 프로젝트')
    await page.fill('[name=title]', '테스트 프로젝트')
    await page.click('text=생성')
    
    // 5. 이미지 다운로드
    await page.click('text=다운로드')
    const download = await page.waitForEvent('download')
    expect(download.suggestedFilename()).toContain('.png')
    
    // 6. 프로 플랜 구독
    await page.click('text=프로 플랜 시작')
    await page.fill('[data-stripe-card]', '4242424242424242')
    await page.click('text=구독 시작')
    await expect(page).toHaveURL('/dashboard?success=true')
  })
})
```

### 10.2 부하 테스트

```javascript
// tests/load/k6-test.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '5m', target: 100 }, // 5분 동안 100 사용자까지 증가
    { duration: '10m', target: 100 }, // 10분 동안 100 사용자 유지
    { duration: '5m', target: 0 }, // 5분 동안 0으로 감소
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99%의 요청이 1.5초 이내
    http_req_failed: ['rate<0.1'], // 에러율 10% 미만
  },
}

export default function () {
  // 이미지 생성 API 테스트
  const payload = JSON.stringify({
    template: 'youtube',
    config: {
      title: 'Load Test',
      subtitle: 'Performance Testing',
    },
  })
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + __ENV.API_TOKEN,
    },
  }
  
  const res = http.post('https://api.serviceimage.com/generate', payload, params)
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
    'image url exists': (r) => JSON.parse(r.body).imageUrl !== undefined,
  })
  
  sleep(1)
}
```

---

## 🚀 Phase 11: 배포 및 모니터링 (1주)

### 11.1 CI/CD 파이프라인

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run E2E tests
        run: npm run test:e2e

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 11.2 모니터링 설정

```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs'

// Sentry 초기화
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event, hint) {
    // 민감한 정보 필터링
    if (event.request) {
      delete event.request.cookies
      delete event.request.headers
    }
    return event
  },
})

// 커스텀 에러 로깅
export function logError(error: Error, context?: Record<string, any>) {
  console.error(error)
  Sentry.captureException(error, {
    extra: context,
  })
}

// 성능 모니터링
export function trackPerformance(name: string, fn: () => Promise<any>) {
  const transaction = Sentry.startTransaction({ name })
  Sentry.getCurrentHub().getScope().setSpan(transaction)
  
  return fn()
    .then((result) => {
      transaction.setStatus('ok')
      return result
    })
    .catch((error) => {
      transaction.setStatus('internal_error')
      throw error
    })
    .finally(() => {
      transaction.finish()
    })
}
```

---

## 📅 타임라인 및 마일스톤

### Month 1: Foundation
- [x] Week 1-2: 기획 및 설계
- [ ] Week 3: 인증 시스템
- [ ] Week 4: 데이터베이스 설정

### Month 2: Core Features
- [ ] Week 5-6: 결제 시스템
- [ ] Week 7-8: 사용자 대시보드

### Month 3: Growth & Optimization
- [ ] Week 9: 퍼널 분석
- [ ] Week 10: 성능 최적화
- [ ] Week 11: 랜딩 페이지
- [ ] Week 12: 이메일 시스템

### Month 4: Launch Preparation
- [ ] Week 13: 관리자 패널
- [ ] Week 14: 테스트 및 QA
- [ ] Week 15: 배포 준비
- [ ] Week 16: 공식 런칭 🚀

---

## 💡 추가 고려사항

### 보안
- [ ] SSL 인증서 설정
- [ ] OWASP Top 10 보안 점검
- [ ] 정기적인 보안 감사
- [ ] 데이터 암호화 (at rest & in transit)

### 법적 준수사항
- [ ] 이용약관 작성
- [ ] 개인정보처리방침 작성
- [ ] GDPR 컴플라이언스
- [ ] 전자상거래법 준수

### 마케팅
- [ ] Product Hunt 런칭
- [ ] SEO 최적화
- [ ] 콘텐츠 마케팅 전략
- [ ] 소셜 미디어 캠페인
- [ ] 인플루언서 파트너십

### 고객 지원
- [ ] 도움말 센터 구축
- [ ] 실시간 채팅 지원
- [ ] 커뮤니티 포럼
- [ ] 비디오 튜토리얼

---

## 📚 기술 스택

### Frontend
- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Forms**: React Hook Form
- **Animation**: Framer Motion

### Backend
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Payment**: Stripe / TossPayments
- **Queue**: BullMQ
- **Cache**: Redis (Upstash)

### Infrastructure
- **Hosting**: Vercel
- **Storage**: AWS S3 / Cloudinary
- **CDN**: Cloudflare
- **Monitoring**: Sentry
- **Analytics**: Mixpanel

### AI/ML
- **LLM**: Claude API
- **Image Gen**: Stable Diffusion API
- **Vector DB**: Pinecone

---

## 🎯 성공 지표 (KPIs)

### 비즈니스 메트릭
- **MRR** (Monthly Recurring Revenue)
- **CAC** (Customer Acquisition Cost)
- **LTV** (Lifetime Value)
- **Churn Rate**
- **NPS** (Net Promoter Score)

### 제품 메트릭
- **DAU/MAU** (Daily/Monthly Active Users)
- **Feature Adoption Rate**
- **Time to First Value**
- **Session Duration**
- **Retention Rate** (D1, D7, D30)

### 기술 메트릭
- **Page Load Time** (< 2s)
- **API Response Time** (< 200ms)
- **Error Rate** (< 1%)
- **Uptime** (> 99.9%)
- **Apdex Score** (> 0.9)

---

## 🔗 유용한 리소스

- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Integration Guide](https://stripe.com/docs)
- [TossPayments API](https://docs.tosspayments.com)
- [Prisma Best Practices](https://www.prisma.io/docs/guides)
- [SaaS Metrics Calculator](https://saasfirst.com/calculator)

---

*이 문서는 지속적으로 업데이트됩니다. 최종 수정: 2025년 1월*