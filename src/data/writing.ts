export interface Article {
  title: string;
  date: string; // ISO yyyy-mm-dd; rendered newest first
  readTime: string;
  summary: string;
  url: string;
  where: 'Medium' | 'Notion' | 'LinkedIn';
}

export const articles: Article[] = [
  {
    title: 'Precision and Pen: Why Specificity and Note-Taking Matter More Than You Think',
    date: '2025-06-16',
    readTime: '2 min',
    summary:
      'Most people consume far more than they retain, and the result is a brittle kind of knowledge. The fix is unglamorous: be specific, and write things down.',
    url: 'https://medium.com/@dwang0816/precision-and-pen-why-specificity-and-note-taking-matter-more-than-you-think-1486f1fbd788',
    where: 'Medium',
  },
  {
    title: "Creating Without a Cause: What The Beginner's Guide Teaches Us About Escaping Creative Paralysis",
    date: '2025-06-10',
    readTime: '6 min',
    summary:
      'Most people wait for a reason to create. This piece looks at what happens when you remove the reason, and why creating without a cause might be the only way some people ever create at all.',
    url: 'https://www.notion.so/Creating-Without-a-Cause-What-The-Beginner-s-Guide-Teaches-Us-About-Escaping-Creative-Paralysis-214d1d71cfeb8024adc0c4e293cd8ad8',
    where: 'Notion',
  },
  {
    title: 'Why Moving to Pomona, California Might Be the Smartest Decision You Make',
    date: '2025-06-04',
    readTime: '5 min',
    summary:
      'A case study of Pomona’s real estate market: location at the crossroads of major freeways, prices well under neighbouring cities, and the city’s revitalisation plans.',
    url: 'https://www.notion.so/Why-Moving-to-Pomona-California-Might-Be-the-Smartest-Decision-You-Make-208d1d71cfeb8068ace6c8bb79d85b3b',
    where: 'Notion',
  },
  {
    title: 'How AI is Revolutionizing Product Development and Boosting ROI',
    date: '2025-05-24',
    readTime: '6 min',
    summary:
      'Real examples from BMW, PepsiCo and Netflix of AI changing how products get built, and why it now matters for long-term growth rather than just cost-cutting.',
    url: 'https://www.linkedin.com/pulse/how-ai-revolutionizing-product-development-boosting-roi-dennis-wang-2e9ke',
    where: 'LinkedIn',
  },
  {
    title: "You're Being Lied to About AI's Purpose: What Simon Sinek Teaches Us About Being Human in a Digital Age",
    date: '2025-05-15',
    readTime: '4 min',
    summary:
      'AI is not only about efficiency or replacing jobs. Drawing on Simon Sinek, this is about meaning, connection and purpose in a digital world.',
    url: 'https://medium.com/@dwang0816/youre-being-lied-to-about-ai-s-purpose-what-simon-sinek-teaches-us-about-being-human-in-a-digital-99105b23e3dc',
    where: 'Medium',
  },
  {
    title: 'Mental Gyms for the AI Age: Why Humanity Still Needs Conflict',
    date: '2025-05-10',
    readTime: '5 min',
    summary:
      'As AI takes over more daily tasks we lose the struggle that keeps us sharp. On why we still need challenges, disagreement and mental friction to grow.',
    url: 'https://medium.com/@dwang0816/mental-gyms-for-the-ai-age-why-humanity-still-needs-conflict-b1ae3fde043b',
    where: 'Medium',
  },
  {
    title: 'New Year Chaos',
    date: '2024-01-01',
    readTime: '3 min',
    summary: 'A reflection on the chaos and clarity that comes with a new year.',
    url: 'https://medium.com/@dwang0816/new-year-chaos-41e8e56cb342',
    where: 'Medium',
  },
  {
    title: 'React Hooks: A Gentle Introduction',
    date: '2023-12-10',
    readTime: '7 min',
    summary: 'A beginner-friendly guide to React Hooks with practical examples.',
    url: 'https://medium.com/@dwang0816/react-hooks-4aacf161c564',
    where: 'Medium',
  },
  {
    title: 'Anagram: A Fun Coding Challenge',
    date: '2023-11-02',
    readTime: '4 min',
    summary: 'Step-by-step reasoning and code for an anagram challenge.',
    url: 'https://medium.com/@dwang0816/anagram-c39da2e4224',
    where: 'Medium',
  },
];

export const caseStudy = {
  title: 'Automating inventory updates for Hadson Toko',
  summary:
    'A fully automated inventory pipeline for a local distributor: Azure Data Factory with a self-hosted integration runtime moves data from an on-premises SQL Server into Airtable every hour, with error handling, logging and a six-month maintenance plan.',
  url: 'https://www.notion.so/Case-Study-Automating-Inventory-Updates-for-Hadson-Toko-24bd1d71cfeb80fc9230db9d763d2475',
};

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
