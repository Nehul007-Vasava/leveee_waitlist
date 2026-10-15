
# Ember — Product Spec

*A relationship app built around the moments that actually change outcomes.*

---

## 2. The thesis

> **The relationship is the unit, not the partner. Ember helps you notice what's happening between you two, and intervene in the ten seconds that matter.**

Three things Ember does that a general chatbot cannot:

|                             | Why it's defensible                                              |
| --------------------------- | ---------------------------------------------------------------- |
| **Continuity**        | Remembers the fight from March when the same one recurs in June. |
| **Interception**      | Present at the moment of drafting an angry text, not after.      |
| **Pattern detection** | Sees the loop the user is inside and can't see.                  |

Everything in this spec serves one of those three. Anything that doesn't is cut.

## 3. Principles

1. **Intervene before, not process after.** Prevention beats post-mortem.
2. **The user is the only variable they control.** Every insight about the partner comes paired with a user-side move.
3. **Hold uncertainty out loud.** "One reading of this is…" never "Your partner feels…"
4. **Success is needing the app less.** Optimise for resolved conflicts, not session count.
5. **Never take money from anything the user does for their partner.** No affiliate links.
6. **Know the ceiling.** Ember is not therapy and says so, clearly, at the right moments.

---

# 4. The feature set

## 4.0 Platform parity

Web and mobile run the same API and the same prompts. Where they differ, it's because
the platform forces it.

| Feature             | Web                              | Mobile                | Note                                                     |
| ------------------- | -------------------------------- | --------------------- | -------------------------------------------------------- |
| Decoder             | ✅ incl. signed-out              | ✅                    | Signed-out web version is the free public tool           |
| Cooldown            | ✅                               | ✅                    | Mobile gets a share-sheet entry point; web is paste-only |
| Repair Loop         | ⚠️ email or in-app only        | ✅ push               | Web push is unreliable; don't depend on it               |
| Patterns            | ✅                               | ⚠️ Synced mode only | Local-only mobile users don't get it — see §4.4        |
| Conversation Prep   | ✅**better on web**        | ✅                    | It's a document you write and print. Keyboard wins       |
| Profiles            | ✅                               | ✅                    |                                                          |
| Local-only storage  | ❌                               | ✅                    | No keychain in a browser                                 |
| Storage-mode choice | ❌ always Synced                 | ✅ Local or Synced    | Asked once at onboarding                                 |
| Panic delete        | ⚠️ session clear + server wipe | ✅ full               | Web can't clear what the OS cached                       |
| Biometric lock      | ⚠️ passkey / timeout           | ✅                    |                                                          |

Two things this matrix decides. **Conversation Prep is a web-first feature** — it's a
prep sheet you walk in with, and nobody drafts that on a phone. And **the Repair Loop's
retention mechanic is weaker on web**, so a web-only user is a structurally worse
retention prospect. Mobile install is the real conversion event, not signup.

## Tier 1 — Build first (the wedge)

### 4.1 Cooldown — *"Before you send that"*

**The single highest-leverage feature in the product.** The user has typed something in anger and hasn't hit send.

**Flow**

1. Paste or type the draft. One box, no menus.
2. Ember returns three panels:

| Panel                       | Content                                                                                                                    |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **What you mean**     | The legitimate need underneath. "You're saying you felt dismissed when plans changed without you."                         |
| **What they'll hear** | The likely landing. "The word*always* will read as a verdict on their character, and they'll defend rather than listen." |
| **Try this**          | 2–3 rewrites that keep the anger's*substance* and drop its *shrapnel*.                                                |

3. Footer: **Send anyway** / **Use a rewrite** / **Wait an hour** (sets a silent 60-min nudge).

**Non-negotiables**

- Never tells the user their feeling is wrong. Only that the packaging will cost them the outcome they want.
- Rewrites must not be sanitised into passivity. If the draft says "this is a dealbreaker," the rewrite still says that.
- If the draft contains threats, ultimatums about self-harm, or contempt/degradation, Ember does **not** rewrite — it stops and addresses that directly.

**Why it wins:** sharp trigger, seconds to value, immediately shareable ("this app stopped me sending something stupid"), and high frequency in exactly the relationships that need it.

---

### 4.2 Message Decoder — *"Help me respond"*

Already in v1, buried as one of six. It should be a primary tab.

**Flow**

1. Paste what they sent. Optional one-line context ("we'd argued the night before").
2. Output:
   - **Possible readings** — 2–3 interpretations, ranked, each with what would make it more or less likely. Never one confident answer.
   - **What's the actual ask?** — separates the complaint from the request underneath.
   - **Response drafts** — tone-tagged: *Warm · Direct · Curious · Buy time · Hold the boundary*

**Change from v1:** drop "Funny" and "Romantic" as tones. They're what people reach for to *avoid* the conversation. Add **"Buy time"** — a genuinely useful, underserved option ("I want to answer this properly, can we talk tonight?").

---

### 4.3 Repair Loop

The retention mechanic, and the thing that makes everything else possible.

- 48–72h after any conflict-related session, one push: **"How did the money conversation land?"**
- Three taps: **Resolved · Still open · Went worse**
- If *Resolved* → one question: "What worked?" (This becomes the user's personal playbook.)
- If *Went worse* → straight into a short session, no menu.

**Why it matters:** nobody follows up. It's cheap, it feels like being cared about, and it converts one-off sessions into a longitudinal record — which is the raw material for §4.4.

---

## Tier 2 — The moat

### 4.4 Patterns

Passive detection across sessions. Surfaced sparingly — **max one per two weeks**, or it becomes nagging.

Detect and surface:

- **Recurring topic** — "Money has come up 4 times in 9 weeks. Each time it starts about a purchase and ends about respect. The purchase probably isn't the issue."
- **Escalation shape** — "Your conflicts tend to turn at the point you bring up something from a previous argument."
- **Timing** — "Most of these happen on Sunday nights."
- **Repair speed** — "You used to take 4 days to reconnect. Now it's about a day."
- **Asymmetry** — "You've described yourself apologising first in 6 of the last 7. Worth looking at."

**Rules**

- Only after ≥5 logged sessions. Below that it's astrology.
- Always framed as observation + question, never diagnosis. Ends with "Does that match how it feels?"
- One-tap **"That's not right"** that actually suppresses the pattern.
- Never delivered mid-conflict. Only in calm windows.

**Storage dependency — decided here, not left open.** Patterns needs ≥5 sessions of
history, so on a Local-only device that history dies with a reinstall and the paywalled
feature has nothing to work on. Patterns therefore **requires Synced mode**, and the
mobile storage-mode screen says so: *choosing local-only means Patterns won't be
available.* Better to surface that at the choice than at the paywall.

Gating rules run client-side in both modes, because only the client can see the history.

This is the feature a user cannot get from ChatGPT, a journal, or a friend.

---

### 4.5 Two Profiles, Not One

**Partner Context** — 10 fields max, all of which measurably change AI output:

| Field                       | Type                             | Why it's kept                        |
| --------------------------- | -------------------------------- | ------------------------------------ |
| Name, pronouns              | text                             | Basic                                |
| Relationship stage & length | select                           | Calibrates stakes                    |
| After conflict they need…  | Space / To talk it out / Depends | Changes every repair suggestion      |
| They express care by…      | 5 love languages                 | Reframes "they don't care"           |
| Best reached by             | Text / Call / In person          | Changes channel advice               |
| Topics that go badly        | free text                        | Hard guardrail                       |
| Their current stressors     | free text                        | Explains 60% of unexplained friction |
| Key dates                   | date                             | Reminders                            |

Cut entirely: favourite colour, flower, animal, dessert, movie genre, "is your partner funny/emotional/patient." These existed to feel thorough and to feed the gifts feature. They don't change advice quality.

**Your Profile** — the thing v1 was missing:

- What you do when you're hurt: *withdraw / escalate / fix immediately / go quiet then blow up*
- What lands hardest on you: *being ignored / being criticised / feeling controlled / feeling unappreciated*
- What you're carrying right now (work, family, health)
- What you're working on: one self-set goal, e.g. *"Stop bringing up old fights"*

**Onboarding: 6 questions, ≤90 seconds, all skippable.** Everything else is asked contextually in-session ("quick one — do they usually want space after this kind of thing?") and written back to the profile. Profile completeness becomes a byproduct of use, not a toll gate.

---

### 4.6 Conversation Prep

For the ones that are planned, not reactive: money, moving in, kids, boundaries, family, the future.

Not a chat — a **structured prep sheet** the user can actually walk in with:

1. **What outcome do you want?** — forces separating *being heard* from *changing their mind*. Most people haven't decided.
2. **What's the one sentence?** — the thing that must be said, refined to something sayable.
3. **What will they likely say?** — 2–3 predicted responses, drawn from partner context, with a way through each.
4. **What are you willing to move on?** — pre-committed flexibility, decided while calm.
5. **When and where** — with concrete guidance (not late at night, not over text, not when either of you is leaving in 20 minutes).

Exportable as a note. Follows up afterwards via the Repair Loop.

---

## Tier 3 — Later

### 4.7 Anchors

Small proactive prompts based on real signal, not a daily-tip content treadmill:

- After a hard week: *"You've had three tense days. What's one thing they did this week that you haven't mentioned?"*
- Long quiet stretch: *"Two weeks, nothing logged. That's usually good — is it?"*
- Before a known-hard date (an anniversary of a loss, a family visit).

Kill criterion: if <15% engage after 4 weeks, delete it. Don't let it rot into notification spam.

### 4.8 Endings

Every user eventually breaks up, or outgrows the app. Handle it deliberately.

- Detect breakup language → offer a mode switch, don't barrel on with anniversary reminders.
- Breakup mode: processing support, a hard "no contact" check before Cooldown will rewrite anything, and a clean **archive or delete everything** choice.
- The relationship data is intimate. Deletion must be real, immediate, and one screen deep.

---

## 5. Cut list

| Cut                                           | Reason                                                                                  |
| --------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Gifts & affiliate links**             | ~$6/user/year. Buys nothing, costs the emotional trust the rest of the product runs on. |
| **Date ideas**                          | Google does this. No continuity advantage.                                              |
| **Calendar integration**                | Heavy permissions, low payoff. Reminders alone cover it.                                |
| **Dashboard stats ("chats this week")** | Shows the user a number that goes up when things go badly.                              |
| **Six chat modes**                      | Collapses to: Cooldown, Decoder, Prep, and one open "Something's going on."             |
| **35 profile questions**                | Onboarding death.                                                                       |
| **Daily relationship tip**              | Generic content, zero personalisation, trains users to ignore notifications.            |

---

## 6. Safety

Non-optional. An app about conflict *will* receive disclosures.

**Detect and route on:** self-harm or suicidal ideation · physical violence or fear of a partner · coercive control (monitoring, financial control, isolation) · child safety concerns.

**Behaviour:**

- **Stop the normal flow.** Never respond to "he grabbed me" with a rewrite suggestion.
- Name it plainly, without diagnosing. Offer region-appropriate resources.
- **Never suggest a communication strategy for de-escalating an abusive partner.** That framing puts responsibility for another person's violence on the user, and can raise their risk.
- Coercive-control screening runs on *the user's own drafts too*. Ember must not help someone write a manipulative or controlling message. If a draft is designed to guilt, monitor, or corner, Cooldown says so instead of polishing it.

**Ceiling disclosure.** After ~3 sessions on the same unresolved theme: *"This one keeps coming back, which usually means it's bigger than a conversation can fix. A couples therapist is the right tool here — Ember isn't."* Say this even though it costs sessions. Especially then.

---

## 7. Privacy

The most sensitive data category outside health, about a person who never consented.

Ember ships on **web and mobile**. Web has no keychain and no guarantee the same browser
returns, so it needs server-side storage. Server-side storage is not the same as
server-readable storage — the browser encrypts before upload.

### 7.1 Two storage modes

|                                  | **Local** | **Synced**                         |
| -------------------------------- | --------------- | ---------------------------------------- |
| Platforms                        | mobile only     | mobile + web                             |
| Server holds                     | nothing         | ciphertext it cannot open                |
| Keys held by                     | device keychain | passphrase + device keys + recovery code |
| Multi-device                     | no              | yes                                      |
| Patterns (§4.4)                 | unavailable     | available                                |
| Recovery if all credentials lost | n/a             | **data is gone**                   |
| Default for                      | mobile          | web                                      |

**The server can never read user content.** There is no mode in which it can. That is a
product commitment, not a configuration.

**Mobile asks at onboarding.** One screen, two options, plain language: *keep everything
on this phone* or *sync so you can use Ember on the web too*. No dark patterns, no
pre-ticked box, the choice is reversible, and the screen states that local-only means
Patterns won't be available.

**Web defaults to Synced**, because it has no other option. A passphrase is set at
signup, a 24-word recovery code is shown once with a forced confirmation, and the copy
says plainly that losing both means losing the data.

**A server-readable mode was considered and cut.** It would have allowed password-reset
style recovery, but it reinstates the exact problem this section exists to avoid:
readable intimate data about a partner who never consented. The cost is accepted openly —
a user who loses their passphrase, recovery code and every device loses their history,
and support genuinely cannot help. That is the same fact that makes the privacy claim
true, so never soften it.

### 7.2 Everything else

- **PIN / biometric lock**, on by default. This app gets opened while a partner is in
  the room. Web gets a short session timeout for the same reason.
- **Panic delete** — clears everything from the lock screen, no confirmation chain, and
  fires a best-effort server delete so device wipe and cloud wipe are one action.
- **No training on user content.** Plain language on the marketing site, not buried in
  a policy.
- **Real GDPR posture.** The answer to "the partner is a data subject whose rights you
  cannot service" is that you hold nothing readable, in either mode, on either platform.
  That makes the DPIA a short document and makes a breach a non-event. It is worth
  protecting against every future feature that would find a content column convenient.
- **The web app is structurally weaker than the mobile app.** No secure enclave means
  XSS reaches key material. Strict CSP, zero third-party scripts on authenticated pages,
  non-extractable keys, no analytics behind login. These are launch blockers, not
  hardening tasks.

---

## 8. Metrics

**Primary:** % of logged conflicts marked *Resolved* within 7 days. This is the only number that means the product works.

**Supporting:** Cooldown draft → rewrite-used rate · repair-loop response rate · pattern "that's right" rate · time-to-reconnect trend per user · week-8 retention.

**Explicitly not optimised:** session count, time in app, messages sent. If those rise while resolution rate is flat, the product is making things worse.

---

## 9. Business model

Subscription. ~$19/mo or $99/yr.

- **Free:** 3 Cooldowns/month, 3 Decodes/month, basic profiles, reminders, **sync**.
- **Paid:** unlimited, Patterns, Conversation Prep, history and search.

**Sync moved to the free tier and this is forced, not a choice.** Web requires
server-side storage to work at all, so a paywalled sync means a free web user has no
product. Paywalling the thing that makes the web version function would also be the
worst possible first impression.

Patterns carries the paywall instead, which was always the better line anyway — it
requires accumulated history, so it only exists for users who already stayed.

Free-tier limits are a **server-side config value**, not a client or code constant. You
will want to test 3 vs 1 vs trial-only without shipping an App Store review.

Couples plan later (two accounts, shared calendar, private journals) — but only after the single-player product proves out. Two-sided onboarding will halve conversion.

---

## 10. Build order

| Phase       | Platform      | Ship                                                                                                                                                         |
| ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1** | **web** | Free public**Decoder** — no signup, no storage, paste-only. Cooldown second. *Test: does anyone come back within 14 days?*                          |
| **2** | web + mobile  | Accounts, storage-mode choice, Synced mode (WebCrypto + keychain), recovery codes, 6-question onboarding.*Test: what share of mobile users choose Synced?* |
| **3** | both          | Repair Loop, reminders, session history.*Test: does resolution rate move?*                                                                                 |
| **4** | both          | Patterns, Conversation Prep, self-profile depth, paywall.                                                                                                    |
| **5** | both          | Anchors, Endings, couples mode.                                                                                                                              |

**Two reorderings from v1, both deliberate.**

**Decoder ships before Cooldown.** §11.2 asks whether anger is the state in which nobody
opens an app. The research says acute arousal suppresses help-seeking, so mid-fight is
the *hardest* moment to reach, not the easiest. Interpreting a message you received is a
lower-arousal state, it is the behaviour already happening at volume in public, and it is
the one that can be seeded. Cooldown becomes the retention layer once the app is already
trusted enough to be open.

**Web ships before mobile.** The free Decoder is the validation instrument and it costs
days rather than weeks — no signup, no storage, no App Store review cycle. It runs on
the same API mobile will use, so nothing is thrown away.

---

## 11. Open questions

1. **Does the resolution metric survive self-report?** People say "resolved" to stop being asked. Needs a validation pass.
2. **Does Cooldown get used, or is anger the exact state in which nobody opens an app?** This is the riskiest assumption in the whole spec. Test it before building anything else.
3. **Where does the wedge come from?** Cooldown is the shareable moment, but nobody screenshots their own worst text. Distribution is unsolved.
4. **Do Patterns feel insightful or invasive?** Same output, opposite reception, depending on delivery. Needs live testing, not a design decision.

---

## Appendix — Visual direction

The existing palette is soft and reads as *pleasant*, which is wrong for the primary use case. Someone opening this at 11pm mid-fight needs calm and grounded, not cheerful.

- Deepen the base: `#0077b6` as anchor, with a near-black navy ground for dark mode (which should be the default — this app gets used at night).
- `#00b4d8` for actions only, sparingly.
- `#9991be` / `#d7b9d5` for calm, reflective surfaces (Patterns, profiles).
- `#f4cae0` reserved for warmth moments — repair confirmed, reconnection. Rare enough that it means something.
- No hearts, no pink gradients, no cute mascot. The tone is a steady friend at midnight, not a greeting card.
