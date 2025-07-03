// models/fighter.js

const fighters = [
  {
    name: "Zohran Mamdani",
    office: "NY State Assembly - District 36",
    state: "NY",
    party: "Democratic Socialist",
    photoUrl: "/images/fighters/zohran.jpg",
    issues: ["housing", "palestine", "labor"],
    endorsements: ["DSA", "WFP"],
    quote: "We must stop evictions, not enable them.",
    donationLink: "https://secure.actblue.com/donate/zohranforassembly",
    socialLinks: {
      twitter: "https://twitter.com/ZohranKMamdani",
      website: "https://zohranforassembly.com",
      instagram: "https://instagram.com/zohrankmamdani"
    },
    status: "incumbent",
    runningForReelection: true,
    tags: ["fighter", "DSA-endorsed", "incumbent"],
    bio: "Zohran Mamdani is a housing organizer turned legislator fighting for a just New York.",
    alignmentScore: 95
  },
  {
    name: "Summer Lee",
    office: "U.S. House - PA 12th District",
    state: "PA",
    party: "Democratic",
    photoUrl: "/images/fighters/summer.jpg",
    issues: ["climate", "healthcare", "voting rights"],
    endorsements: ["Justice Democrats", "WFP"],
    quote: "We must legislate with the urgency working people live with every day.",
    donationLink: "https://secure.actblue.com/donate/summerlee",
    socialLinks: {
      twitter: "https://twitter.com/SummerForPA",
      website: "https://summerforpa.com",
      instagram: "https://instagram.com/summerforpa"
    },
    status: "incumbent",
    runningForReelection: true,
    tags: ["fighter", "Justice Democrat", "progressive"],
    bio: "Summer Lee is a community organizer and civil rights advocate representing Pennsylvania’s 12th district.",
    alignmentScore: 93
  },
  {
    name: "Greg Casar",
    office: "U.S. House - TX 35th District",
    state: "TX",
    party: "Democratic Socialist",
    photoUrl: "/images/fighters/greg.jpg",
    issues: ["labor", "immigration", "abortion"],
    endorsements: ["DSA", "WFP"],
    quote: "Everyone deserves dignity at work, healthcare, and a home.",
    donationLink: "https://secure.actblue.com/donate/gregcasar",
    socialLinks: {
      twitter: "https://twitter.com/GregCasar",
      website: "https://gregcasar.com",
      instagram: "https://instagram.com/gregcasar"
    },
    status: "incumbent",
    runningForReelection: true,
    tags: ["fighter", "DSA-endorsed", "labor champion"],
    bio: "Greg Casar is a former city council member now fighting for working Texans in Congress.",
    alignmentScore: 96
  },
  {
    name: "Sarahana Shrestha",
    office: "NY State Assembly - District 103",
    state: "NY",
    party: "Democratic Socialist",
    photoUrl: "/images/fighters/sarahana.jpg",
    issues: ["climate", "energy democracy", "housing"],
    endorsements: ["DSA", "WFP"],
    quote: "We need public power, not corporate monopolies.",
    donationLink: "https://secure.actblue.com/donate/sarahana",
    socialLinks: {
      twitter: "https://twitter.com/SarahanaNY",
      website: "https://sarahanaforassembly.com",
      instagram: "https://instagram.com/sarahanaforny"
    },
    status: "incumbent",
    runningForReelection: true,
    tags: ["fighter", "climate", "DSA"],
    bio: "Sarahana is organizing for climate justice and publicly owned energy systems in New York.",
    alignmentScore: 94
  },
  {
    name: "Alexandria Ocasio-Cortez",
    office: "U.S. House - NY 14th District",
    state: "NY",
    party: "Democratic Socialist",
    photoUrl: "/images/fighters/aoc.jpg",
    issues: ["green new deal", "tax justice", "immigration"],
    endorsements: ["Justice Democrats", "DSA"],
    quote: "Courage is contagious.",
    donationLink: "https://secure.actblue.com/donate/aoc",
    socialLinks: {
      twitter: "https://twitter.com/AOC",
      website: "https://ocasio-cortez.house.gov",
      instagram: "https://instagram.com/aoc"
    },
    status: "incumbent",
    runningForReelection: true,
    tags: ["fighter", "progressive icon", "green new deal"],
    bio: "AOC is a national leader in progressive politics and the author of the Green New Deal.",
    alignmentScore: 98
  },
  // Add more mock fighters here as needed...
]

export default fighters
