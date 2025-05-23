### **0 · Document Meta**

| Item | Value |
| ----- | ----- |
| Project code‑name | **“GemFlash”** |
| Author / PM | *SpecSmith AI (draft)* |
| Stakeholders | Vibe‑Coding Instructors, Engineering Lead, UX Lead |
| Target release (MVP) | **Sprint 6 – July 11 2025** |
| Status | **Baseline ➀** (signed‑off) |
| Change log | 0.9 draft 05‑13‑25 → 1.0 baseline 05‑14‑25 |

---

## **1 · Objective (Purpose & “Why”)**

Build a **mobile‑first, swipe‑driven web app** that helps self‑learners internalise core AI concepts in short sessions and immediately apply them through **LLM‑generated challenges**. The MVP targets single‑device use, zero back‑end ops, and \< 5‑minute onboarding.

---

## **2 · Success Metrics (KPIs)**

| Goal ID | Metric | Target @ 30 days post‑launch |
| ----- | ----- | ----- |
|  K‑01 | First‑session completion rate | **≥ 75 %** users review ≥ 10 cards |
|  K‑02 | Challenge engagement | **≥ 40 %** of reviewed cards trigger ≥ 1 AI challenge |
|  K‑03 | Perceived learning impact (in‑app CSAT 1‑5) | **≥ 4.2** avg |
|  K‑04 | Performance | Lighthouse mobile FMP **≤ 2 s** on 4 G |
|  K‑05 | Crash‑free sessions | **≥ 99.5 %** |

---

## **3 · User Personas**

| Persona | Needs / Pain | Goals |
| ----- | ----- | ----- |
| **P‑01 “Newbie Nia”** CS freshman on Android | Dense AI theory feels abstract | Quick, tactile review & confidence boosts |
| **P‑02 “Upskiller Uri”** Working data‑analyst on iPhone | Time‑boxed commute learning | Micro‑lessons that fit subway rides |
| **P‑03 “Tutor Tara”** Community instructor on laptop | Wants demo‑ready, offline‑safe tool | Show concepts live without setup |

---

## **4 · Scope**

### **4.1 In‑Scope (MVP)**

* 20 pre‑seeded AI flashcards (mockData.ts)

* Swipe R = “understood”, L = “review” (animation ≤ 350 ms)

* Local progress persistence (localStorage)

* Badge engine (thresholds in mockData.ts)

* Genkit \+ Gemini flow for challenge generation

* Loading / error UX & duplicate‑call lockout (60 s)

* Optional category filter toggle

\#\#\# 4.2 Out‑of‑Scope / Non‑Goals

* Multi‑device sync, social leaderboards, paid upsells

* Native app stores; PWA install prompt only

* Accessibility beyond WCAG 2.1 AA critical path (stretch SR‑04)

---

## **5 · Features & Requirements Matrix**

| Trace ID | User Story (INVEST) | Acceptance Criteria (A/C) | Origin (FR‑xx) |
| ----- | ----- | ----- | ----- |
| **US‑01 Deck display** | *As a learner, I see the next AI concept card immediately on load so I can start swiping without extra taps.* | Card deck rendered with ≥ 20 items from mockData.ts; top card fully visible; zero console errors. | FR‑01 |
| **US‑02 Swipe interactions** | *As a learner, I mark understanding by swiping right or review by swiping left so my progress is recorded intuitively.* | Gesture recognised within 350 ms; emits UNDERSTOOD/REVIEW; vibrates (12 ms) on left swipe for feedback. | FR‑02, FR‑03 |
| **US‑03 Persistence** | *When I reload the page, my last state should persist so I never lose progress.* | localStorage key `gemFlash.cardState` exists; cards restore on load; Lighthouse storage quota check passes. | FR‑04 |
| **US‑04 Badge unlock** | *After I master a concept, I earn a badge so I feel rewarded.* | Badge toast appears once thresholds met; stored in `badges[]`; persists after reload. | FR‑05 |
| **US‑05 Challenge generation** | *I can tap “Generate Challenge” on any card to receive a contextual exercise.* | Button shows spinner; POST to Genkit with cardId+progress; modal renders Gemini text ≤ 4 s; duplicate blocked \< 60 s. | FR‑06→FR‑09 |
| **US‑06 Filter toggle** | *I can filter cards by category to focus on specific topics.* | Category chips rendered; selecting filters deck; persists filter until session end. | FR‑10 |

---

## **6 · User Experience & Design**

* **Figma file:** `GemFlash_MVP/v1.0`

  * Mobile 375 × 812 & Tablet 768 × 1024 frames

  * Motion spec: spring `duration‑350ms`, `ease‑out‑quad`

* **Accessibility:** All interactive controls have ARIA labels; swipe actions mirrored by on‑screen buttons for keyboard users.

---

## **7 · Architecture & Tech Notes**

| Layer | Tech | Rationale |
| ----- | ----- | ----- |
| Front end | **Next.js 14 (App Router, RSC)** \+ TypeScript | Fast SPA, tree‑shaking, classroom alignment |
| State | React Context \+ useReducer | Simple local flow, no Redux overhead |
| Persistence | browser localStorage | Single‑device MVP; fallback to in‑memory if quota error |
| AI Backend | **Genkit 0.6** ⇢ **Gemini 2.5** (`challengePrompt.ts`) | LLM orchestration, streaming support |
| Deployment | Vercel Hobby | CI preview per PR; edge caching of static assets |

Secrets stored in `.env.local`; no keys leak to client bundle (checked at build).

---

## **8 · Non‑Functional Requirements (NFR)**

| ID | Category | Requirement | Measure |
| ----- | ----- | ----- | ----- |
| NFR‑01 | Performance | FMP ≤ 2 s, TTI ≤ 3 s (Moto G 4 G) | Lighthouse mobile ≥ 85 |
| NFR‑02 | Availability | Genkit endpoint uptime ≥ 99 % | StatusCake monitor |
| NFR‑03 | Usability | Zero‑tutorial discoverability of swipe; plain‑language errors | 5‑user guerrilla test |
| NFR‑04 | Security | Tokenised secrets; no PII stored | Repo secret scan |
| NFR‑05 | Accessibility | WCAG 2.1 AA critical path | axe‑linter CI |
| NFR‑06 | Offline | Flashcard review functional after first load | Chrome DevTools offline test |

---

## **9 · Dependencies & Assumptions**

* Google Gemini free‑tier quota (10 req/min)

* Classroom devices: Chrome 119+, Safari 17+

* Students have intermittent 4 G connectivity

* Next.js 14 remains in LTS during semester

---

## **10 · Risks & Mitigations**

| Risk ID | Description | Severity | Mitigation |
| ----- | ----- | ----- | ----- |
|  R‑01 | Gemini quota exhaustion demo day | High | Prefetch 3 challenges per card; static fallback set |
|  R‑02 | Safari Private‑mode storage failure | Medium | JSON compress; catch quota error → sessionStorage |
|  R‑03 | Variable challenge difficulty | Medium | Add few‑shot examples; include `difficulty` param |

---

## **11 · Release Checklist**

| Area | Done? |
| ----- | ----- |
| Success KPIs & monitoring dashboards configured |  |
| CI/CD pipeline with Lighthouse & accessibility gates |  |
| Classroom demo script & fallback static dataset |  |
| README with local dev, env vars, and coding guidelines |  |
| Stakeholder sign‑off record archived (Confluence) |  |

---

## **12 · Traceability Matrix (snapshot)**

| FR‑ID → Test Case ID | Linked User Story | Status |
| ----- | ----- | ----- |
| FR‑01 → TC‑01‑renderDeck | US‑01 | 🟡 in‑dev |
| FR‑02/3 → TC‑02‑swipe | US‑02 | 🔵 passed |
| ... | … | … |

---

## **13 · Glossary**

* **Genkit** – OSS framework orchestrating LLM calls

* **Gemini** – Google’s multimodal LLM

* **Swipe‑right / left** – Gestures to mark “understood” / “review”

---

### **Stakeholder Sign‑off**

| Name / Role | Approval | Date |
| ----- | ----- | ----- |
| Product Lead | ✔ | 05‑14‑25 |
| Eng Lead | ✔ | 05‑14‑25 |
| UX Lead | ✔ | 05‑14‑25 |

