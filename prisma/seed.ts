/* eslint-disable no-console */
// ─── MEDOS SEED RUNNER ───
import { PrismaClient } from '@prisma/client'
import { subjects, topics, allConcepts, allEdges } from './seed-data'
import { questions, flashcards, confusions } from './seed-questions'
import { cases } from './seed-cases'

const db = new PrismaClient()

const DAY = 24 * 3600 * 1000
const now = Date.now()
const ago = (d: number) => new Date(now - d * DAY)

async function main() {
  console.log('⏳ Clearing old data…')
  await db.$transaction([
    db.questionAttempt.deleteMany(), db.flashcardReview.deleteMany(), db.revisionItem.deleteMany(),
    db.studySession.deleteMany(), db.errorPattern.deleteMany(), db.caseRun.deleteMany(),
    db.knowledgeState.deleteMany(), db.resourceLog.deleteMany(), db.logbookEntry.deleteMany(),
    db.studentProfile.deleteMany(),
    db.conceptEdge.deleteMany(), db.question.deleteMany(), db.flashcard.deleteMany(),
    db.concept.deleteMany(), db.topic.deleteMany(), db.subject.deleteMany(),
    db.clinicalCase.deleteMany(), db.confusionPair.deleteMany(),
  ])

  console.log('📚 Seeding subjects, topics, concepts…')
  for (const s of subjects) await db.subject.create({ data: { ...s } })
  for (const t of topics) await db.topic.create({ data: { ...t } })
  for (const c of allConcepts) {
    await db.concept.create({
      data: {
        id: c.id, topicId: c.topicId, name: c.name, kind: c.kind ?? 'concept', summary: c.summary,
        whyMatters: c.whyMatters ?? '', mnemonic: c.mnemonic ?? '',
        difficulty: c.difficulty ?? 2, examRelevance: c.examRelevance ?? 3, clinicalRelevance: c.clinicalRelevance ?? 3,
        detail: (c.detail ?? undefined) as object | undefined,
      },
    })
  }
  let ei = 0
  for (const e of allEdges) {
    await db.conceptEdge.create({ data: { id: `edge-${++ei}`, fromId: e.from, toId: e.to, type: e.type, label: e.label ?? '' } })
  }

  console.log('❓ Seeding questions…')
  for (const q of questions) {
    await db.question.create({
      data: {
        id: q.id, stem: q.stem, options: q.options.map((text, i) => ({ id: String.fromCharCode(97 + i), text })), answer: String.fromCharCode(97 + q.answer),
        explanation: q.explanation, teaching: q.teaching, subjectCode: q.subjectCode, system: q.system ?? '',
        conceptId: q.conceptId, difficulty: q.difficulty ?? 2, qtype: q.qtype ?? 'sba', tags: (q.tags ?? []) as string[],
      },
    })
  }

  console.log('🃏 Seeding flashcards + confusion pairs…')
  for (const f of flashcards) {
    await db.flashcard.create({
      data: { id: f.id, conceptId: f.conceptId, front: f.front, back: f.back, subjectCode: f.subjectCode, system: f.system ?? '', tags: (f.tags ?? []) as string[] },
    })
  }
  for (const c of confusions) {
    await db.confusionPair.create({
      data: { id: c.id, a: c.a, b: c.b, aCode: c.aCode ?? '', bCode: c.bCode ?? '', aPoints: c.aPoints as string[], bPoints: c.bPoints as string[], mnemonic: c.mnemonic ?? '', subjectCode: c.subjectCode, system: c.system ?? '' },
    })
  }

  console.log('🏥 Seeding clinical cases…')
  for (const c of cases) {
    await db.clinicalCase.create({
      data: {
        id: c.id, title: c.title, specialty: c.specialty, system: c.system, difficulty: c.difficulty,
        patient: c.patient as object, steps: c.steps as unknown as object[], learning: c.learning as string[], diagnosis: c.diagnosis,
      },
    })
  }

  // ─── DEMO STUDENT: Dr. Arpit, 2nd year MBBS, 3-year horizon ───
  console.log('🧑‍⚕️ Creating demo student with realistic knowledge state…')
  const profile = await db.studentProfile.create({
    data: {
      name: 'Arpit', year: 2, semester: 3, collegeName: 'Govt. Medical College', collegeType: 'government',
      gradYear: 2028, internshipDone: false, pastScore: 'Distinction in Anatomy', prepStage: 'serious',
      dailyHours: 2.5, weekdayHours: 2, weekendHours: 4.5, learningStyles: ['visual', 'questions', 'flashcards'],
      resources: ['Marrow', 'PW'], onboarded: true,
    },
  })

  // Knowledge states — mastery across concepts
  const states: [string, number, number, number, number][] = [
    // conceptId, score, stability(days), lastReviewedDaysAgo, attempts
    ['c-raas', 78, 22, 9, 14], ['c-gfr', 72, 18, 6, 11], ['c-htn', 68, 15, 11, 12],
    ['c-acei', 74, 20, 7, 10], ['c-betablock', 44, 6, 17, 9], ['c-cardcycle', 82, 30, 5, 12],
    ['c-coronary', 76, 24, 8, 8], ['c-ami', 58, 9, 13, 15], ['c-troponin', 71, 19, 9, 7],
    ['c-ecg', 52, 8, 14, 16], ['c-antiplatelet', 47, 7, 18, 8], ['c-nephrotic', 38, 5, 20, 14],
    ['c-nephritic', 32, 4, 21, 13], ['c-aki', 55, 10, 12, 10], ['c-diuretics', 61, 12, 10, 9],
    ['c-insulin', 70, 17, 8, 8], ['c-dm', 66, 14, 7, 12], ['c-dka', 29, 3, 24, 6],
    ['c-metformin', 64, 13, 9, 6], ['c-thyroidphys', 51, 9, 15, 7], ['c-graves', 42, 6, 19, 9],
    ['c-thyroidstorm', 26, 3, 26, 4], ['c-cushing', 35, 4, 22, 5], ['c-spirometry', 69, 16, 6, 8],
    ['c-asthma-copd', 73, 21, 5, 10], ['c-tb', 80, 28, 4, 11], ['c-antitb', 76, 25, 4, 9],
    ['c-idacda', 62, 11, 11, 7], ['c-leukemia', 49, 8, 16, 6], ['c-hpylori', 71, 18, 7, 6],
    ['c-ulcer', 65, 12, 8, 5], ['c-epidesign', 56, 10, 13, 9], ['c-vaccines', 60, 13, 10, 6],
    ['c-femoral', 84, 32, 3, 5], ['c-hernia', 70, 16, 6, 6], ['c-preec', 45, 7, 16, 8],
    ['c-diabretino', 52, 8, 15, 5], ['c-inflamm', 78, 26, 6, 7], ['c-neoplasia', 66, 13, 9, 6],
    ['c-heartfail', 54, 9, 12, 9], ['c-hyperk', 48, 7, 14, 8], ['c-hba1c', 74, 20, 5, 5],
  ]
  for (const [conceptId, score, stability, daysAgo, attempts] of states) {
    const estRecall = Math.exp(-daysAgo / (stability * 1.6))
    const status = score >= 70 && estRecall > 0.6 ? 'strong' : score < 45 ? 'weak' : estRecall < 0.55 ? 'unstable' : 'strong'
    await db.knowledgeState.create({
      data: {
        profileId: profile.id, conceptId, score, attemptCount: attempts, correctCount: Math.round(attempts * (score / 100)),
        lastReviewed: ago(daysAgo), lastCorrect: ago(Math.max(1, daysAgo - 2)), stability,
        estRecall: Math.round(estRecall * 100) / 100, status,
      },
    })
  }

  // Attempts over last 30 days (for heatmap + error patterns)
  console.log('📈 Generating attempt history…')
  const weak = ['c-nephrotic', 'c-nephritic', 'c-betablock', 'c-dka', 'c-ecg', 'c-thyroidstorm', 'c-antiplatelet', 'c-graves', 'c-preec', 'c-hyperk']
  const qIds = questions.map(q => q.id)
  let seedNum = 42
  const rand = () => { seedNum = (seedNum * 16807) % 2147483647; return seedNum / 2147483647 }
  for (let d = 29; d >= 1; d--) {
    const perDay = d % 7 === 0 || d % 7 === 6 ? Math.floor(rand() * 10) + 8 : Math.floor(rand() * 8) + 2
    if (d > 6 && rand() < 0.12) continue // guaranteed recent 6-day activity for the demo streak
    for (let i = 0; i < perDay; i++) {
      const q = questions[Math.floor(rand() * questions.length)]
      const isWeak = q.conceptId && weak.includes(q.conceptId)
      const correct = rand() > (isWeak ? 0.55 : 0.28)
      const answerLetter = String.fromCharCode(97 + q.answer)
      const wrongLetter = answerLetter === 'a' ? 'b' : 'a'
      const errorTypes = ['confused', 'forgot', 'didnt_know', 'misread', 'reasoning', 'guess']
      await db.questionAttempt.create({
        data: {
          questionId: q.id, profileId: profile.id, selected: correct ? answerLetter : wrongLetter,
          correct, errorType: correct ? null : errorTypes[Math.floor(rand() * errorTypes.length)],
          timeMs: Math.floor(rand() * 90) + 25 * 1000, confidence: Math.floor(rand() * 4) + 1, createdAt: ago(d),
        },
      })
    }
    const kinds = ['study', 'questions', 'revision', 'case', 'recall']
    const mins = Math.floor(rand() * 90) + 30
    await db.studySession.create({
      data: { profileId: profile.id, minutes: mins, kind: kinds[Math.floor(rand() * kinds.length)], label: 'Auto-logged study', date: ago(d) },
    })
    if (d % 3 === 0) {
      await db.studySession.create({ data: { profileId: profile.id, minutes: Math.floor(rand() * 40) + 15, kind: 'revision', label: 'Flashcard recall', date: ago(d) } })
    }
  }

  // Error patterns — recurring mistakes
  const ep: [string, string, number][] = [
    ['confused', 'c-nephritic', 4], ['confused', 'c-nephrotic', 3], ['forgot', 'c-betablock', 3],
    ['didnt_know', 'c-dka', 2], ['reasoning', 'c-ecg', 3], ['forgot', 'c-thyroidstorm', 2],
  ]
  for (const [errorType, conceptId, count] of ep) {
    await db.errorPattern.create({ data: { profileId: profile.id, errorType, conceptId, count, lastAt: ago(3) } })
  }

  // Flashcard reviews — some due now
  const dueCards = flashcards.slice(0, 14)
  for (let i = 0; i < dueCards.length; i++) {
    const f = dueCards[i]
    await db.flashcardReview.create({
      data: { flashcardId: f.id, profileId: profile.id, dueAt: i < 9 ? ago(1) : new Date(now + (i - 9) * 2 * DAY), intervalDays: i < 9 ? 3 : 1, reps: 2, lapses: i % 3, lastGrade: 2, reviewedAt: ago(4) },
    })
  }
  for (let i = 14; i < flashcards.length; i++) {
    const f = flashcards[i]
    await db.flashcardReview.create({
      data: { flashcardId: f.id, profileId: profile.id, dueAt: new Date(now + (i - 10) * 3 * DAY), intervalDays: 6, reps: 3, lapses: 0, lastGrade: 3, reviewedAt: ago(3) },
    })
  }

  // Revision items (debt)
  const debtConcepts: [string, string, number][] = [
    ['c-nephritic', 'Recall decayed below threshold + 4 repeated confusions with nephrotic syndrome', 3],
    ['c-nephrotic', 'Unstable — accuracy dropped on 3 recent questions', 3],
    ['c-betablock', '3 "forgot" errors in 10 days — contraindication ladder unstable', 2],
    ['c-dka', 'Sequencing errors in management — high exam relevance', 2],
    ['c-thyroidstorm', 'Weak + connected to Graves (currently in your college syllabus)', 2],
    ['c-ecg', 'Ischemia patterns unstable — reasoning errors detected', 2],
    ['c-graves', 'Last reviewed 19 days ago — estimated recall 42%', 1],
    ['c-antiplatelet', 'Mechanism-order questions repeatedly missed', 1],
  ]
  for (const [conceptId, reason, priority] of debtConcepts) {
    await db.revisionItem.create({ data: { profileId: profile.id, conceptId, reason, priority, dueAt: ago(2), minutes: 15 } })
  }

  // Resource logs
  await db.resourceLog.createMany({
    data: [
      { profileId: profile.id, resource: 'Marrow', item: 'Renal pathology — Glomerular diseases lecture', done: true },
      { profileId: profile.id, resource: 'Marrow', item: 'Cardiology — Beta blocker masterclass', done: true },
      { profileId: profile.id, resource: 'PW', item: 'Pathology — Neoplasia rapid revision', done: false },
    ],
  })

  // Case runs
  await db.caseRun.create({
    data: { profileId: profile.id, caseId: 'case-nephrotic', score: 66, correctSteps: 4, totalSteps: 5, detail: [{ stepId: 's4', correct: false, chosen: 2 }] as unknown as object[], completedAt: ago(6) },
  })
  await db.caseRun.create({
    data: { profileId: profile.id, caseId: 'case-dka', score: 100, correctSteps: 5, totalSteps: 5, detail: [], completedAt: ago(2) },
  })

  console.log('✅ Seed complete:', {
    subjects: subjects.length, topics: topics.length, concepts: allConcepts.length, edges: allEdges.length,
    questions: questions.length, flashcards: flashcards.length, cases: cases.length, confusions: confusions.length,
  })
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => db.$disconnect())
