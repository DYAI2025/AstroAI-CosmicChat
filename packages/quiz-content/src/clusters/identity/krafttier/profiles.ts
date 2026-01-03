import type { QuizProfile } from '../../../types';

export const profiles: QuizProfile[] = [
  {
    id: 'wolf',
    title: 'Der Wolf',
    icon: '🐺',
    tagline: 'Loyal, instinktiv und zutiefst verbunden mit deinem Rudel',
    description:
      'Der Wolf erwacht in dir – loyal, instinktiv und zutiefst verbunden mit deinem Rudel. Du führst nicht durch Dominanz, sondern durch das tiefe Verständnis, dass wahre Stärke in der Gemeinschaft liegt.',
    stats: [
      { label: 'Loyalität', value: 98 },
      { label: 'Instinkt', value: 94 },
      { label: 'Führung', value: 91 },
      { label: 'Intuition', value: 87 },
    ],
    markers: [
      { id: 'marker.values.connection', weight: 0.4 },
      { id: 'marker.social.dominance', weight: 0.3 },
      { id: 'marker.eq.empathy', weight: 0.2 },
    ],
  },
  {
    id: 'owl',
    title: 'Die Eule',
    icon: '🦉',
    tagline: 'Weise, geduldig und mit Augen, die durch jeden Schleier blicken',
    description:
      'Die Eule hat dich erwählt – still, geduldig und mit Augen, die durch jeden Schleier blicken. Du verstehst, dass wahre Weisheit im Zuhören liegt, nicht im Sprechen.',
    stats: [
      { label: 'Weisheit', value: 97 },
      { label: 'Geduld', value: 95 },
      { label: 'Durchblick', value: 93 },
      { label: 'Intuition', value: 89 },
    ],
    markers: [
      { id: 'marker.cognition.system_thinking', weight: 0.4 },
      { id: 'marker.aura.mystery', weight: 0.35 },
      { id: 'marker.social.reserve', weight: 0.2 },
    ],
  },
  {
    id: 'eagle',
    title: 'Der Adler',
    icon: '🦅',
    tagline: 'Frei, mutig und mit einem Blick, der Horizonte überwindet',
    description:
      'Der Adler erhebt sich in dir – majestätisch, frei und mit einem Blick, der Horizonte überwindet. Du lebst für die Freiheit und scheust keine Höhen.',
    stats: [
      { label: 'Freiheit', value: 98 },
      { label: 'Weitblick', value: 96 },
      { label: 'Mut', value: 94 },
      { label: 'Präzision', value: 91 },
    ],
    markers: [
      { id: 'marker.values.autonomy', weight: 0.4 },
      { id: 'marker.cognition.system_thinking', weight: 0.3 },
      { id: 'marker.social.dominance', weight: 0.2 },
    ],
  },
  {
    id: 'bear',
    title: 'Der Bär',
    icon: '🐻',
    tagline: 'Stark, verwurzelt und mit einer Stärke aus tiefer innerer Ruhe',
    description:
      'Der Bär erwacht in dir – geerdet, besonnen und mit einer Stärke, die aus tiefer innerer Ruhe kommt. Du brauchst keinen Lärm, um deine Präsenz zu zeigen.',
    stats: [
      { label: 'Stärke', value: 97 },
      { label: 'Erdung', value: 96 },
      { label: 'Besonnenheit', value: 93 },
      { label: 'Schutzinstinkt', value: 91 },
    ],
    markers: [
      { id: 'marker.values.security', weight: 0.4 },
      { id: 'marker.lifestyle.structure', weight: 0.3 },
      { id: 'marker.social.dominance', weight: 0.2 },
    ],
  },
  {
    id: 'fox',
    title: 'Der Fuchs',
    icon: '🦊',
    tagline: 'Neugierig, clever und mit einem Lächeln, das Türen öffnet',
    description:
      'Der Fuchs tanzt durch deine Seele – neugierig, anpassungsfähig und mit einem Lächeln, das Türen öffnet. Du findest Wege, wo andere nur Mauern sehen.',
    stats: [
      { label: 'Cleverness', value: 97 },
      { label: 'Anpassung', value: 95 },
      { label: 'Neugier', value: 94 },
      { label: 'Charme', value: 92 },
    ],
    markers: [
      { id: 'marker.cognition.creativity', weight: 0.4 },
      { id: 'marker.lifestyle.spontaneity', weight: 0.3 },
      { id: 'marker.eq.social_skill', weight: 0.2 },
    ],
  },
  {
    id: 'dolphin',
    title: 'Der Delphin',
    icon: '🐬',
    tagline: 'Spielerisch, verbunden und in ständigem Flow mit dem Leben',
    description:
      'Der Delphin spielt in deiner Seele – lebendig, spielerisch und in ständigem Flow mit dem Ozean des Lebens. Du erinnerst andere daran, dass Freude keine Schwäche ist.',
    stats: [
      { label: 'Lebensfreude', value: 98 },
      { label: 'Spielfreude', value: 96 },
      { label: 'Verbundenheit', value: 93 },
      { label: 'Anpassung', value: 91 },
    ],
    markers: [
      { id: 'marker.eq.social_skill', weight: 0.4 },
      { id: 'marker.lifestyle.spontaneity', weight: 0.35 },
      { id: 'marker.aura.warmth', weight: 0.2 },
    ],
  },
];
