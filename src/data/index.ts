export const brand = {
  name: 'Northvane',
  report: 'Inference Buildout Index 2026',
  site: 'https://northvane-index.pages.dev',
  description:
    'Northvane tracked 212 modular AI data center sites and 1.9 GW of contracted capacity for twelve months. The Inference Buildout Index 2026 is what the field data says about speed, power, cooling and where the next gigawatt lands.',
};

export const chapters = [
  { id: 'overview', label: 'Overview' },
  { id: 'deployment', label: 'Deployment' },
  { id: 'power', label: 'Power & cooling' },
  { id: 'phases', label: 'Build phases' },
  { id: 'revenue', label: 'Time to revenue' },
  { id: 'next', label: 'Next-gen sites' },
  { id: 'conclusion', label: 'Conclusion' },
];

export const nav = [
  { label: 'Overview', href: '#overview' },
  { label: 'Deployment', href: '#deployment' },
  { label: 'Method', href: '#method' },
];

// Orb cards: 30 slots cycling through six site photographs
export const cardImages = ['snow', 'desert', 'harbour', 'farm', 'valley', 'rooftop'];
export const ORB_COUNT = 48;
export const orbCards = Array.from({ length: ORB_COUNT }, (_, i) => ({
  src: `/media/card-${cardImages[i % cardImages.length]}.jpg`,
  alt: 'Modular site',
}));

// Chapter 1 — share of contracted capacity energized, by site size
export const capacityTicks = ['3 years ago', '2 years ago', '1 year ago', '6 months ago', '1 month ago', 'Today'];
export const capacitySeries = [
  { key: 'single', label: 'Single unit', color: '#D9622B', values: [8, 14, 27, 48, 66, 74.2] },
  { key: 'campus', label: 'Campus', color: '#2F55C9', values: [4, 9, 19, 36, 53, 61.8] },
  { key: 'network', label: 'Networked sites', color: '#119A88', values: [2, 5, 12, 27, 44, 55.3] },
];

// Chapter 1 — phased revenue tabs
export const phasedTabs = [
  {
    key: 'phased',
    label: 'Phased sites',
    title: 'Revenue before full energization',
    unit: '% of final capacity billing',
    months: ['Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26'],
    values: [0, 0, 6, 11, 14, 19, 22, 24, 27, 31, 34, 36, 39, 41, 43, 46],
  },
  {
    key: 'single-phase',
    label: 'Single-phase sites',
    title: 'Revenue before full energization',
    unit: '% of final capacity billing',
    months: ['Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26'],
    values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 9, 16, 21, 25],
  },
];

export const methodology = [
  ['212', 'live sites tracked'],
  ['1.9 GW', 'contracted capacity'],
  ['14', 'countries'],
  ['12', 'months of readings'],
];
