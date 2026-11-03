/**
 * Every figure on the site comes from the venture project write-up (Amazon review study, U.S. Census analysis,
 * OASIS AI focus group, Mission 2 pricing intelligence, Mission 3 pricing & cost laboratory).
 * Nothing here is estimated or invented; derived values say how they were derived.
 */

export const brand = {
  name: 'Travel Jewelry Organizer',
  mission:
    'Help travelers protect, organize, and easily access their jewelry with a compact, reliable organizer designed to reduce tangling.',
}

export const features = [
  { id: 'necklace', n: 1, title: 'Necklace supports', short: 'Long necklaces hang separately', detail: 'Extra necklace supports keep chains apart, including long necklaces that do not fit in small pouches.', why: 'Poor fit for long necklaces was a recurring frustration with existing organizers.' },
  { id: 'snaps', n: 2, title: 'Tested closures', short: 'Snaps built to last', detail: 'Closures will be tested through repeated opening and closing before launch.', why: 'Faulty snaps were the top defect in the review sample: 7 of 80 Amazon reviews reported them.' },
  { id: 'page', n: 3, title: 'Separate storage page', short: 'A divider for every piece', detail: 'A separate storage page adds room for different jewelry sizes and keeps pieces from rubbing against each other.', why: 'Customers complained about pockets that were too small.' },
  { id: 'small', n: 4, title: 'Rings & earrings', short: 'Secure small-piece storage', detail: 'Dedicated spots for rings and earrings make loading and unpacking quick.', why: 'Secure storage and easy loading are the core benefits the target customer looks for.' },
  { id: 'compact', n: 5, title: 'Compact fold', short: 'Space-saving packing', detail: 'The organizer folds flat for carry-ons, weekend bags and business travel.', why: 'Target customers pack jewelry for vacations, weddings, weekend trips and business travel.' },
] as const

export const reviews = {
  source: 'Amazon',
  total: 80,
  sentiment: [
    { label: 'Positive', value: 59, color: '#d6b67a' },
    { label: 'Mixed', value: 15, color: '#8a7a64' },
    { label: 'Negative', value: 6, color: '#b5564a' },
  ],
  checked: 14,
  snapDefects: 7,
  themes: [
    { title: 'Materials & quality', text: 'Reviewers paid close attention to how the organizer was made and the materials used.' },
    { title: 'Faulty snaps', text: 'The most common defect: 7 of the 80 reviews reported snaps that failed.' },
    { title: 'Pocket size', text: 'Pockets that were too small for some pieces.' },
    { title: 'Long necklaces', text: 'Poor fit for longer chains.' },
  ],
  limitation: 'The 80 reviews are a self-selected sample from one competing product, so they may not represent all potential customers.',
}

export const census = {
  source: 'U.S. Census Bureau, American Community Survey (ACS) API',
  locations: '50 states, Washington, D.C., and Puerto Rico',
  rows: 52,
  largest: ['CA', 'TX', 'FL'],
  largestNames: 'California, Texas and Florida',
  r2: 0.188,
  finding: 'Higher-income states tend to have a slightly larger percentage of women ages 18–54, but income explains only 18.8% of the variation.',
  limitation: 'Population does not equal demand. These data do not show whether residents travel, own jewelry, or would buy the organizer.',
}

export const segments = [
  { id: 'geo', label: 'Geographic', text: 'Start with U.S. online shoppers, testing demand in selected states before expanding.' },
  { id: 'demo', label: 'Demographic', text: 'Primarily adult jewelry wearers, with an initial focus on women ages 18–54 with discretionary income. Gift buyers are a secondary audience.' },
  { id: 'psycho', label: 'Psychographic', text: 'Values organization, convenience, style, and protecting meaningful belongings. Prefers practical products that make travel less stressful.' },
  { id: 'benefits', label: 'Benefits', text: 'Separated necklaces, secure storage, easy loading, space-saving packing, and room for different jewelry sizes.' },
  { id: 'behavior', label: 'Behavioral', text: 'Packs jewelry for vacations, weddings, weekend trips or business travel. Compares reviews, price, size and durability before buying, for personal use or as a gift.' },
]

export const focusGroup = {
  note: 'OASIS AI focus group. Participants are fictional personas simulated by a local model. Their comments generate ideas; they are not evidence of real customer demand.',
  quotes: [
    { who: 'Morgan (P1)', persona: 'Fictional budget-conscious student', round: 'Round 2', quote: 'I’d likely stick with them unless this option is cheaper and smaller.', insight: 'A new organizer must justify replacing inexpensive alternatives. The competition includes simple zip bags, not just other organizers.' },
    { who: 'Jordan (P2)', persona: 'Fictional frequent traveler', round: 'Round 2', quote: '…without established materials or performance, I’m uncertain if it improves my current method without added hassle.', insight: 'Benefits need evidence before people trust the product: test durability and ease of use, then demonstrate them.' },
  ],
  themes: ['Keeping an existing packing method', 'Space and fit', 'Missing product details'],
  action: 'Show a short side-by-side demonstration of the organizer versus a basic jewelry pouch: necklace tangling and ease of access.',
}

export const pricing = {
  price: 49,
  range: [45, 59],
  band: 0.15,
  competitors: [
    { name: 'BAGSMART Dazzling', short: 'Dazzling', price: 22.99, note: 'Promotional price; selected variant unavailable, so not used as a regular-price benchmark', promo: true },
    { name: 'BAGSMART Crush', short: 'Crush', price: 39.99, note: 'Necklace and earring storage', promo: false },
    { name: 'Quince leather case', short: 'Quince', price: 40, note: 'Verified on official product page; no promotion; available to buy', promo: false },
    { name: 'Mark & Graham case', short: 'M&G', price: 69, note: 'Higher-priced brand', promo: false },
  ],
  reportedCounts: { cheaper: 2, comparable: 0, expensive: 2, of: 4 },
  unit: { manufacturing: 16, shipping: 8.4, contribution: 15.98 },
  scenarios: {
    base: { label: 'Base model', manufacturing: 16, contribution: 15.98, breakEven: 50, annualManufacturing: 19200 },
    up20: { label: 'Manufacturing +20%', manufacturing: 19.2, contribution: 12.78, breakEven: 63, annualManufacturing: 23040 },
  },
  assumedMonthlySales: 100,
  fixedExample: { name: 'Founder administration allowance', monthly: 300 },
}

export const swot = [
  { key: 'S', title: 'Strengths', tone: 'internal', items: ['Clear focus on preventing tangles, protecting jewelry and simplifying packing', 'Customer feedback can guide improvements to closures, pockets and necklace storage'] },
  { key: 'W', title: 'Weaknesses', tone: 'internal', items: ['Limited brand recognition and startup resources', 'Durability, manufacturing costs and customer demand still need testing'] },
  { key: 'O', title: 'Opportunities', tone: 'external', items: ['Fix frustrations with broken snaps, small pockets and poor fit for long necklaces', 'Gifting, personalization and partnerships with jewelry brands'] },
  { key: 'T', title: 'Threats', tone: 'external', items: ['Established competitors and inexpensive alternatives', 'Easily copied designs', 'Negative reviews if quality falls short'] },
]

export const nextSteps = [
  { title: 'Keep the idea', text: 'Mostly positive reviews (59 of 80) suggest customers value this type of product.' },
  { title: 'Make snaps last', text: 'Test closures through repeated use, since faulty snaps were the top reported defect.' },
  { title: 'Prioritize materials', text: 'Materials and construction quality came up again and again in reviews.' },
  { title: 'Show, don’t tell', text: 'Film a side-by-side demo against a basic pouch: tangling and ease of access.' },
  { title: 'Test where people are', text: 'Run small online ad tests in California, Texas and Florida before committing a larger budget.' },
  { title: 'Lead with benefits, test price', text: 'Emphasize less tangling, secure storage and easier packing, and test price points rather than assume a premium position.' },
]
