import type { QuizQuestion } from '../../../types';

export const questions: QuizQuestion[] = [
  {
    id: 'kt_q1',
    scenario: 'Die Morgendämmerung bricht an...',
    text: 'Was weckt dich wirklich auf?',
    options: [
      {
        id: 'kt_q1_a',
        text: 'Der Ruf des Abenteuers – etwas Neues wartet',
        markers: [
          { id: 'marker.cognition.creativity', weight: 0.15 },
          { id: 'marker.values.autonomy', weight: 0.12 },
        ],
      },
      {
        id: 'kt_q1_b',
        text: 'Die Stille vor dem ersten Licht',
        markers: [
          { id: 'marker.cognition.system_thinking', weight: 0.12 },
          { id: 'marker.aura.mystery', weight: 0.15 },
        ],
      },
      {
        id: 'kt_q1_c',
        text: 'Das Wissen, dass meine Liebsten sicher sind',
        markers: [
          { id: 'marker.values.connection', weight: 0.15 },
          { id: 'marker.values.security', weight: 0.12 },
        ],
      },
      {
        id: 'kt_q1_d',
        text: 'Die Vorfreude auf spielerische Momente',
        markers: [
          { id: 'marker.eq.social_skill', weight: 0.15 },
          { id: 'marker.lifestyle.spontaneity', weight: 0.12 },
        ],
      },
    ],
  },
  {
    id: 'kt_q2',
    scenario: 'Der Wald ruft...',
    text: 'Wie bewegst du dich durch unbekanntes Terrain?',
    options: [
      {
        id: 'kt_q2_a',
        text: 'Mit wachsamen Sinnen – ich spüre jede Veränderung',
        markers: [
          { id: 'marker.eq.self_awareness', weight: 0.15 },
          { id: 'marker.social.reserve', weight: 0.12 },
        ],
      },
      {
        id: 'kt_q2_b',
        text: 'Von oben betrachtet – ich verschaffe mir zuerst Überblick',
        markers: [
          { id: 'marker.cognition.system_thinking', weight: 0.15 },
          { id: 'marker.values.autonomy', weight: 0.12 },
        ],
      },
      {
        id: 'kt_q2_c',
        text: 'Mit spielerischer Neugier – jeder Pfad ist eine Entdeckung',
        markers: [
          { id: 'marker.cognition.creativity', weight: 0.15 },
          { id: 'marker.lifestyle.spontaneity', weight: 0.12 },
        ],
      },
      {
        id: 'kt_q2_d',
        text: 'Bedächtig und verwurzelt – Schritt für Schritt',
        markers: [
          { id: 'marker.values.security', weight: 0.15 },
          { id: 'marker.lifestyle.structure', weight: 0.1 },
        ],
      },
    ],
  },
  {
    id: 'kt_q3',
    scenario: 'Ein Fremder taucht auf...',
    text: 'Wie reagierst du auf unerwartete Begegnungen?',
    options: [
      {
        id: 'kt_q3_a',
        text: 'Prüfend, aber offen – mein Instinkt wird mir zeigen, ob ich vertrauen kann',
        markers: [
          { id: 'marker.eq.self_awareness', weight: 0.12 },
          { id: 'marker.values.connection', weight: 0.15 },
        ],
      },
      {
        id: 'kt_q3_b',
        text: 'Aus sicherer Distanz beobachtend',
        markers: [
          { id: 'marker.social.reserve', weight: 0.15 },
          { id: 'marker.aura.mystery', weight: 0.1 },
        ],
      },
      {
        id: 'kt_q3_c',
        text: 'Neugierig – jede Begegnung trägt eine Geschichte',
        markers: [
          { id: 'marker.cognition.creativity', weight: 0.15 },
          { id: 'marker.eq.social_skill', weight: 0.1 },
        ],
      },
      {
        id: 'kt_q3_d',
        text: 'Direkt und selbstbewusst – ich zeige, wer ich bin',
        markers: [
          { id: 'marker.social.dominance', weight: 0.15 },
          { id: 'marker.values.autonomy', weight: 0.12 },
        ],
      },
    ],
  },
  {
    id: 'kt_q4',
    scenario: 'Die Nacht bricht herein...',
    text: 'Wo findest du Frieden?',
    options: [
      {
        id: 'kt_q4_a',
        text: 'Im Kreise derer, die mir am Herzen liegen',
        markers: [
          { id: 'marker.values.connection', weight: 0.15 },
          { id: 'marker.eq.social_skill', weight: 0.1 },
        ],
      },
      {
        id: 'kt_q4_b',
        text: 'In der Stille meiner eigenen Gedanken',
        markers: [
          { id: 'marker.cognition.system_thinking', weight: 0.15 },
          { id: 'marker.aura.mystery', weight: 0.12 },
        ],
      },
      {
        id: 'kt_q4_c',
        text: 'Im Gefühl absoluter Freiheit',
        markers: [
          { id: 'marker.values.autonomy', weight: 0.15 },
          { id: 'marker.lifestyle.spontaneity', weight: 0.1 },
        ],
      },
      {
        id: 'kt_q4_d',
        text: 'Im spielerischen Moment des Hier und Jetzt',
        markers: [
          { id: 'marker.eq.social_skill', weight: 0.15 },
          { id: 'marker.lifestyle.spontaneity', weight: 0.15 },
        ],
      },
    ],
  },
  {
    id: 'kt_q5',
    scenario: 'Gefahr nähert sich...',
    text: 'Wie reagierst du auf Bedrohungen?',
    options: [
      {
        id: 'kt_q5_a',
        text: 'Ich stelle mich schützend vor die Meinen',
        markers: [
          { id: 'marker.social.dominance', weight: 0.15 },
          { id: 'marker.values.connection', weight: 0.15 },
        ],
      },
      {
        id: 'kt_q5_b',
        text: 'Ich analysiere die Lage mit klarem Verstand',
        markers: [
          { id: 'marker.cognition.system_thinking', weight: 0.15 },
          { id: 'marker.social.reserve', weight: 0.12 },
        ],
      },
      {
        id: 'kt_q5_c',
        text: 'Ich vertraue meinen Instinkten und handle blitzschnell',
        markers: [
          { id: 'marker.eq.self_awareness', weight: 0.15 },
          { id: 'marker.values.autonomy', weight: 0.1 },
        ],
      },
      {
        id: 'kt_q5_d',
        text: 'Ich finde einen kreativen Ausweg',
        markers: [
          { id: 'marker.lifestyle.spontaneity', weight: 0.15 },
          { id: 'marker.cognition.creativity', weight: 0.12 },
        ],
      },
    ],
  },
  {
    id: 'kt_q6',
    scenario: 'Ein Traum ruft...',
    text: 'Was treibt dich wirklich an?',
    options: [
      {
        id: 'kt_q6_a',
        text: 'Die Sehnsucht nach wahrer Verbundenheit',
        markers: [
          { id: 'marker.values.connection', weight: 0.15 },
          { id: 'marker.eq.empathy', weight: 0.1 },
        ],
      },
      {
        id: 'kt_q6_b',
        text: 'Die Suche nach tieferer Wahrheit',
        markers: [
          { id: 'marker.cognition.system_thinking', weight: 0.15 },
          { id: 'marker.aura.mystery', weight: 0.12 },
        ],
      },
      {
        id: 'kt_q6_c',
        text: 'Die Freiheit, meinen eigenen Weg zu gehen',
        markers: [
          { id: 'marker.values.autonomy', weight: 0.15 },
          { id: 'marker.cognition.creativity', weight: 0.1 },
        ],
      },
      {
        id: 'kt_q6_d',
        text: 'Der Wunsch, etwas Bleibendes zu schaffen',
        markers: [
          { id: 'marker.values.achievement', weight: 0.15 },
          { id: 'marker.lifestyle.structure', weight: 0.1 },
        ],
      },
    ],
  },
  {
    id: 'kt_q7',
    scenario: 'Die Schatten werden länger...',
    text: 'Wie verarbeitest du schwierige Zeiten?',
    options: [
      {
        id: 'kt_q7_a',
        text: 'Ich ziehe mich zurück und reflektiere',
        markers: [
          { id: 'marker.aura.mystery', weight: 0.15 },
          { id: 'marker.social.reserve', weight: 0.12 },
        ],
      },
      {
        id: 'kt_q7_b',
        text: 'Ich suche Trost bei meinen Liebsten',
        markers: [
          { id: 'marker.values.connection', weight: 0.15 },
          { id: 'marker.eq.empathy', weight: 0.1 },
        ],
      },
      {
        id: 'kt_q7_c',
        text: 'Ich handle – Bewegung heilt',
        markers: [
          { id: 'marker.eq.self_awareness', weight: 0.15 },
          { id: 'marker.lifestyle.spontaneity', weight: 0.1 },
        ],
      },
      {
        id: 'kt_q7_d',
        text: 'Ich finde Humor und Leichtigkeit',
        markers: [
          { id: 'marker.eq.social_skill', weight: 0.15 },
          { id: 'marker.lifestyle.spontaneity', weight: 0.12 },
        ],
      },
    ],
  },
  {
    id: 'kt_q8',
    scenario: 'Der Wind trägt Geschichten...',
    text: 'Welche Eigenschaft bewunderst du am meisten?',
    options: [
      {
        id: 'kt_q8_a',
        text: 'Unerschütterliche Loyalität',
        markers: [
          { id: 'marker.values.connection', weight: 0.15 },
          { id: 'marker.values.security', weight: 0.12 },
        ],
      },
      {
        id: 'kt_q8_b',
        text: 'Scharfsinnige Weisheit',
        markers: [
          { id: 'marker.cognition.system_thinking', weight: 0.15 },
          { id: 'marker.aura.mystery', weight: 0.1 },
        ],
      },
      {
        id: 'kt_q8_c',
        text: 'Grenzenlose Freiheit',
        markers: [
          { id: 'marker.values.autonomy', weight: 0.15 },
          { id: 'marker.social.dominance', weight: 0.1 },
        ],
      },
      {
        id: 'kt_q8_d',
        text: 'Ansteckende Lebensfreude',
        markers: [
          { id: 'marker.eq.social_skill', weight: 0.15 },
          { id: 'marker.aura.warmth', weight: 0.1 },
        ],
      },
    ],
  },
  {
    id: 'kt_q9',
    scenario: 'Am Scheideweg...',
    text: 'Wie triffst du wichtige Entscheidungen?',
    options: [
      {
        id: 'kt_q9_a',
        text: 'Aus dem Bauch heraus – mein Instinkt täuscht selten',
        markers: [
          { id: 'marker.eq.self_awareness', weight: 0.15 },
          { id: 'marker.lifestyle.spontaneity', weight: 0.1 },
        ],
      },
      {
        id: 'kt_q9_b',
        text: 'Nach gründlicher Analyse aller Optionen',
        markers: [
          { id: 'marker.cognition.system_thinking', weight: 0.15 },
          { id: 'marker.lifestyle.structure', weight: 0.12 },
        ],
      },
      {
        id: 'kt_q9_c',
        text: 'Im Gespräch mit Menschen, denen ich vertraue',
        markers: [
          { id: 'marker.values.connection', weight: 0.15 },
          { id: 'marker.eq.empathy', weight: 0.1 },
        ],
      },
      {
        id: 'kt_q9_d',
        text: 'Ich probiere einfach aus und lerne daraus',
        markers: [
          { id: 'marker.cognition.creativity', weight: 0.15 },
          { id: 'marker.lifestyle.spontaneity', weight: 0.12 },
        ],
      },
    ],
  },
  {
    id: 'kt_q10',
    scenario: 'Das Echo deiner Seele...',
    text: 'Was ist deine größte Gabe?',
    options: [
      {
        id: 'kt_q10_a',
        text: 'Mut – ich gehe, wohin andere nicht wagen',
        markers: [
          { id: 'marker.social.dominance', weight: 0.15 },
          { id: 'marker.values.autonomy', weight: 0.12 },
        ],
      },
      {
        id: 'kt_q10_b',
        text: 'Empathie – ich fühle, was andere verbergen',
        markers: [
          { id: 'marker.eq.empathy', weight: 0.15 },
          { id: 'marker.aura.warmth', weight: 0.1 },
        ],
      },
      {
        id: 'kt_q10_c',
        text: 'Klarheit – ich sehe durch den Nebel',
        markers: [
          { id: 'marker.cognition.system_thinking', weight: 0.15 },
          { id: 'marker.eq.self_awareness', weight: 0.1 },
        ],
      },
      {
        id: 'kt_q10_d',
        text: 'Anpassung – ich fließe wie Wasser',
        markers: [
          { id: 'marker.lifestyle.spontaneity', weight: 0.15 },
          { id: 'marker.eq.social_skill', weight: 0.1 },
        ],
      },
    ],
  },
  {
    id: 'kt_q11',
    scenario: 'Das Feuer brennt...',
    text: 'Was gibt dir Kraft, wenn alles dunkel scheint?',
    options: [
      {
        id: 'kt_q11_a',
        text: 'Der Glaube an mich selbst',
        markers: [
          { id: 'marker.social.dominance', weight: 0.15 },
          { id: 'marker.eq.self_regulation', weight: 0.1 },
        ],
      },
      {
        id: 'kt_q11_b',
        text: 'Die Verbindung zu meinem Rudel',
        markers: [
          { id: 'marker.values.connection', weight: 0.15 },
          { id: 'marker.eq.empathy', weight: 0.1 },
        ],
      },
      {
        id: 'kt_q11_c',
        text: 'Das Wissen, dass alles seinen Sinn hat',
        markers: [
          { id: 'marker.cognition.system_thinking', weight: 0.15 },
          { id: 'marker.aura.mystery', weight: 0.12 },
        ],
      },
      {
        id: 'kt_q11_d',
        text: 'Die Hoffnung auf neue Abenteuer',
        markers: [
          { id: 'marker.cognition.creativity', weight: 0.15 },
          { id: 'marker.lifestyle.spontaneity', weight: 0.12 },
        ],
      },
    ],
  },
  {
    id: 'kt_q12',
    scenario: 'Die Vision wird klar...',
    text: 'Welches Element ruft am lautesten nach dir?',
    options: [
      {
        id: 'kt_q12_a',
        text: 'Erde – stark, beständig, verwurzelt',
        markers: [
          { id: 'marker.values.security', weight: 0.15 },
          { id: 'marker.lifestyle.structure', weight: 0.12 },
        ],
      },
      {
        id: 'kt_q12_b',
        text: 'Luft – frei, erhaben, klar',
        markers: [
          { id: 'marker.values.autonomy', weight: 0.15 },
          { id: 'marker.cognition.system_thinking', weight: 0.12 },
        ],
      },
      {
        id: 'kt_q12_c',
        text: 'Wasser – fließend, spielerisch, tief',
        markers: [
          { id: 'marker.lifestyle.spontaneity', weight: 0.15 },
          { id: 'marker.eq.social_skill', weight: 0.12 },
        ],
      },
      {
        id: 'kt_q12_d',
        text: 'Schatten – mysteriös, weise, verborgen',
        markers: [
          { id: 'marker.aura.mystery', weight: 0.15 },
          { id: 'marker.cognition.system_thinking', weight: 0.12 },
        ],
      },
    ],
  },
];
