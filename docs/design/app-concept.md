# DELF A1 Kids — iPhone App Design

## App Concept: "Le Petit Francais"

A gamified, story-driven French learning app that prepares kids (ages 8–14) for the DELF A1 exam through adventures with a friendly mascot — a little fox named **Rémi** 🦊 who guides them through the streets of Paris.

---

## Core Design Principles

1. **Learn by playing** — Every exercise feels like a game, never a test
2. **Bite-sized sessions** — 5–10 minute daily lessons to match kids' attention spans
3. **Positive reinforcement** — No "wrong answer" shame; encourage retry with hints
4. **Story-driven progression** — Each unit is a "chapter" in Rémi's Paris adventure
5. **Exam-ready without exam anxiety** — Mirror DELF A1 format naturally through gameplay

---

## The 4 Worlds (Mapped to DELF A1 Sections)

| World | DELF Section | Kid-Friendly Name | Theme |
|-------|-------------|-------------------|-------|
| 1 | Compréhension orale | **Listening Lane** | Rémi explores sounds of Paris (metro announcements, café orders, street conversations) |
| 2 | Compréhension écrite | **Reading Garden** | Rémi reads signs, menus, postcards, and notes around the city |
| 3 | Production écrite | **Writing Workshop** | Rémi writes postcards, fills out forms, leaves notes for friends |
| 4 | Production orale | **Speaking Stage** | Rémi meets characters and has conversations, performs in a little theatre |

---

## User Journey

### First-Time Experience (Onboarding)

```
[Parent downloads app]
        |
        v
[Welcome screen — Meet Rémi the fox]
        |
        v
[Age selection: 8-10 / 11-14]
(adjusts vocabulary complexity & UI density)
        |
        v
[Quick placement mini-game: 5 questions]
(determines starting difficulty — beginner or some knowledge)
        |
        v
[Choose your avatar & name]
        |
        v
[Rémi says: "Let's explore Paris together!"]
        |
        v
[Map of Paris appears — Chapter 1 unlocked]
```

### Daily Learning Loop

```
[Open app]
    |
    v
[Daily greeting from Rémi + streak counter]
    |
    v
[See Paris Map with progress]
    |
    +---> [Pick a World / Continue current chapter]
    |         |
    |         v
    |     [3-5 mini activities per lesson, ~5 min each]
    |         |
    |         +---> Listening: audio clips + drag answers
    |         +---> Reading: match words to pictures
    |         +---> Writing: trace/type/arrange words
    |         +---> Speaking: record & compare pronunciation
    |         |
    |         v
    |     [Earn stars (1-3) + coins]
    |         |
    |         v
    |     [Unlock next lesson or bonus game]
    |
    +---> [Visit Shop — spend coins on avatar items]
    |
    +---> [Practice Arena — replay any completed lesson]
    |
    +---> [Mock Exam — unlocks after completing a chapter]
```

### Weekly Cycle

```
Mon-Sat: Daily lessons (one world per day or mixed)
Sunday:  "Challenge Day" — weekly quiz across all 4 skills
         Earn bonus rewards, see weekly report
```

### Exam Preparation Path

```
[Complete all 4 worlds]
        |
        v
[Unlock "Exam Mode" — Rémi says "You're ready!"]
        |
        v
[3 full mock exams that mirror real DELF A1]
(timed, scored with same 25-point scale per section)
        |
        v
[Results dashboard — shows readiness per section]
        |
        v
[Targeted review — app suggests weak areas to revisit]
```

---

## Wireframes

### 1. Home Screen (Paris Map)

```
+------------------------------------------+
|  9:41              Le Petit Français   ⚙️ |
+------------------------------------------+
|                                          |
|   🔥 5-day streak!          ⭐ 142  🪙 85 |
|                                          |
|   +--------------------------------------+
|   |                                      |
|   |          [ PARIS MAP ]               |
|   |                                      |
|   |    🗼                                |
|   |   (Eiffel Tower)                     |
|   |     Chapter 3 ----+                  |
|   |                   |                  |
|   |   🎧 Listening    📖 Reading         |
|   |   Lane ✅✅✅⬜    Garden ✅✅⬜⬜     |
|   |        |                |            |
|   |        +-------+--------+            |
|   |                |                     |
|   |   ✏️ Writing    🎤 Speaking           |
|   |   Workshop ✅⬜⬜ Stage 🔒🔒🔒      |
|   |                                      |
|   +--------------------------------------+
|                                          |
+------------------------------------------+
|  🗺️ Map  |  ⚔️ Practice  |  🏪 Shop  | 👤 |
+------------------------------------------+
```

### 2. Lesson Screen — Listening Activity

```
+------------------------------------------+
|  ← Back        Listening Lane      ⭐ 2/3|
+------------------------------------------+
|                                          |
|         +------------------------+       |
|         |                        |       |
|         |    🦊 Rémi is at the   |       |
|         |    boulangerie!        |       |
|         |                        |       |
|         |   [illustration of     |       |
|         |    a bakery scene]     |       |
|         |                        |       |
|         +------------------------+       |
|                                          |
|   🔊  "Bonjour, je voudrais..."          |
|        [  ▶️  Play again  ]              |
|                                          |
|   What did the customer order?           |
|                                          |
|   +------------------+ +---------------+ |
|   | 🥐 un croissant  | | 🍞 une baguette| |
|   +------------------+ +---------------+ |
|   +------------------+ +---------------+ |
|   | 🍰 un gâteau     | | 🥖 un pain    | |
|   +------------------+ +---------------+ |
|                                          |
|          Question 2 of 5                 |
|          ○ ● ○ ○ ○                       |
+------------------------------------------+
```

### 3. Lesson Screen — Reading Activity

```
+------------------------------------------+
|  ← Back        Reading Garden      ⭐ 1/3|
+------------------------------------------+
|                                          |
|   Rémi found a note! Can you read it?    |
|                                          |
|   +--------------------------------------+
|   |  ╔══════════════════════════════╗    |
|   |  ║  Cher Rémi,                  ║    |
|   |  ║                              ║    |
|   |  ║  Je suis à la maison.        ║    |
|   |  ║  Le chat est sur la table.   ║    |
|   |  ║  À bientôt!                  ║    |
|   |  ║                              ║    |
|   |  ║  - Marie                     ║    |
|   |  ╚══════════════════════════════╝    |
|   +--------------------------------------+
|                                          |
|   Where is Marie?                        |
|                                          |
|   +--------------------------------------+
|   |  🏠  At home                         |
|   +--------------------------------------+
|   |  🏫  At school                       |
|   +--------------------------------------+
|   |  🏪  At the store                    |
|   +--------------------------------------+
|                                          |
|          Question 3 of 5                 |
|          ○ ○ ● ○ ○                       |
+------------------------------------------+
```

### 4. Lesson Screen — Writing Activity

```
+------------------------------------------+
|  ← Back       Writing Workshop     ⭐ 0/3|
+------------------------------------------+
|                                          |
|   Rémi is writing a postcard!            |
|   Help him fill in the blanks.           |
|                                          |
|   +--------------------------------------+
|   |  ╔══════════════════════════════╗    |
|   |  ║  Bonjour!                    ║    |
|   |  ║                              ║    |
|   |  ║  Je m'appelle [___________]  ║    |
|   |  ║  J'ai [____] ans.            ║    |
|   |  ║  J'habite à [___________].   ║    |
|   |  ║  J'aime [___________].       ║    |
|   |  ║                              ║    |
|   |  ║  À bientôt!                  ║    |
|   |  ╚══════════════════════════════╝    |
|   +--------------------------------------+
|                                          |
|   +--------------------------------------+
|   |  Type here...                   🎤   |
|   +--------------------------------------+
|                                          |
|   Word bank:                             |
|   [ Paris ] [ 10 ] [ le football ]       |
|                                          |
+------------------------------------------+
```

### 5. Lesson Screen — Speaking Activity

```
+------------------------------------------+
|  ← Back       Speaking Stage       ⭐ 0/3|
+------------------------------------------+
|                                          |
|         +------------------------+       |
|         |                        |       |
|         |   🦊        👩          |       |
|         |   Rémi    Madame       |       |
|         |           Dupont       |       |
|         |                        |       |
|         |  [café scene]          |       |
|         +------------------------+       |
|                                          |
|   Mme Dupont: "Comment tu t'appelles?"   |
|                                          |
|   Your turn! Say:                        |
|   "Je m'appelle [your name]"             |
|                                          |
|         +------------------------+       |
|         |                        |       |
|         |     🎙️ Hold to speak   |       |
|         |                        |       |
|         +------------------------+       |
|                                          |
|   💡 Hint: tap to hear an example        |
|                                          |
|          Part 1 of 3                     |
|          ● ○ ○                           |
+------------------------------------------+
```

### 6. Correct Answer — Celebration

```
+------------------------------------------+
|                                          |
|                                          |
|                                          |
|             ⭐ ⭐ ⭐                      |
|           ✨ BRAVO! ✨                    |
|                                          |
|              🦊                          |
|         Rémi is happy!                   |
|                                          |
|          + 10 coins 🪙                   |
|          + 1 star ⭐                     |
|                                          |
|                                          |
|   Fun fact:                              |
|   "Boulangerie" means bakery!            |
|   France has over 33,000 of them!        |
|                                          |
|                                          |
|   +--------------------------------------+
|   |          [ Continue → ]              |
|   +--------------------------------------+
|                                          |
+------------------------------------------+
```

### 7. Wrong Answer — Encouragement

```
+------------------------------------------+
|                                          |
|                                          |
|          Hmm, pas tout à fait!           |
|          (Not quite!)                    |
|                                          |
|              🦊                          |
|        Rémi believes in you!             |
|                                          |
|   The answer was:                        |
|   🥐 "un croissant"                     |
|                                          |
|   +--------------------------------------+
|   | 🔊 Listen again                     |
|   +--------------------------------------+
|                                          |
|   +--------------------------------------+
|   |          [ Try next → ]              |
|   +--------------------------------------+
|                                          |
+------------------------------------------+
```

### 8. Parent Dashboard

```
+------------------------------------------+
|  ← Back       Parent Zone          🔒    |
+------------------------------------------+
|                                          |
|   Weekly Report for: Emma                |
|   Week of Jan 13, 2026                   |
|                                          |
|   📊 Time spent: 42 min (6 days)         |
|   🔥 Current streak: 12 days            |
|   ⭐ Lessons completed: 8               |
|                                          |
|   Skills Breakdown:                      |
|   +--------------------------------------+
|   | Listening   ████████████░░  80%      |
|   | Reading     ██████████░░░░  70%      |
|   | Writing     ████████░░░░░░  55%      |
|   | Speaking    ██████░░░░░░░░  40%      |
|   +--------------------------------------+
|                                          |
|   📝 Recommendation:                     |
|   "Emma is doing great with listening!   |
|    Let's practice more speaking this     |
|    week."                                |
|                                          |
|   [ Set daily time limit ]               |
|   [ Manage notifications ]               |
|   [ View exam readiness  ]              |
+------------------------------------------+
```

### 9. Mock Exam Mode

```
+------------------------------------------+
|  9:41            Exam Mode           ⏱️   |
+------------------------------------------+
|                                          |
|              🦊                          |
|   "You've trained hard! Let's see        |
|    how ready you are!"                   |
|                                          |
|   +--------------------------------------+
|   |                                      |
|   |  DELF A1 — Practice Exam #1         |
|   |                                      |
|   |  🎧 Listening     20 min    [ → ]   |
|   |  📖 Reading        30 min    [ → ]   |
|   |  ✏️ Writing        30 min    [ → ]   |
|   |  🎤 Speaking       10 min    [ → ]   |
|   |                                      |
|   |  ⏱️  Total: ~90 minutes              |
|   |                                      |
|   +--------------------------------------+
|                                          |
|   ⚙️ Options:                            |
|   [ ] Timed mode (like real exam)        |
|   [ ] Relaxed mode (no timer)            |
|                                          |
|   +--------------------------------------+
|   |        [ Start Exam → ]             |
|   +--------------------------------------+
|                                          |
+------------------------------------------+
```

---

## Gamification System

### Rewards

| Action | Reward |
|--------|--------|
| Complete a lesson | 10 coins + 1-3 stars |
| Daily login | 5 coins |
| 7-day streak | 50 bonus coins + badge |
| Complete a chapter | New avatar item unlocked |
| Pass a mock exam | Special badge + new map area |

### Avatar Shop Items

- Hats (beret, chef hat, artist hat)
- Accessories (baguette, paint brush, camera)
- Backgrounds (Eiffel Tower, beach, mountains)
- Pet companions (cat, bird, hamster)

### Badges Collection

- "Première Étoile" — Complete first lesson
- "Petit Lecteur" — Finish all Reading lessons in a chapter
- "Oreilles d'Or" — Get 3 stars on 5 Listening lessons
- "Écrivain en Herbe" — Write 10 postcards
- "Bavard(e)" — Complete 10 speaking activities
- "Prêt pour le DELF!" — Pass all 3 mock exams

---

## Content Structure Per Chapter

Each chapter = 1 story arc in Paris (e.g., "Rémi's first day at school")

```
Chapter
├── Listening Lane     (4 lessons)
├── Reading Garden     (4 lessons)
├── Writing Workshop   (4 lessons)
├── Speaking Stage     (4 lessons)
├── Bonus Game         (unlocked after completing all 4 worlds)
└── Chapter Quiz       (mini mock exam covering all 4 skills)
```

**Total: 8 chapters = 128 core lessons + 8 bonus games + 8 quizzes**

---

## DELF A1 Topic Coverage (Mapped to Chapters)

| Chapter | Story | DELF A1 Topics Covered |
|---------|-------|----------------------|
| 1 | Rémi arrives in Paris | Greetings, introductions, numbers 1-20 |
| 2 | Rémi goes to school | Classroom, days of week, school subjects |
| 3 | Rémi visits the market | Food, shopping, prices, quantities |
| 4 | Rémi's family dinner | Family members, descriptions, home |
| 5 | Rémi explores the city | Directions, transportation, places |
| 6 | Rémi's weekend | Hobbies, sports, weather, time |
| 7 | Rémi plans a party | Invitations, dates, clothing, colors |
| 8 | Rémi says "au revoir" | Review + travel, holidays, future plans |

---

## Technical Considerations (iOS)

- **Target**: iOS 17+, iPhone-only (iPad later)
- **Framework**: SwiftUI for UI, AVFoundation for audio
- **Speech**: Speech framework for pronunciation evaluation
- **Offline**: Core lessons downloadable for offline use
- **Accessibility**: VoiceOver support, Dynamic Type
- **Parental controls**: Screen Time API integration
- **Analytics**: Track progress locally, optional cloud sync
