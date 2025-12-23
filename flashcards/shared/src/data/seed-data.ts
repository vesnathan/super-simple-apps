/**
 * Seed data for Simple Flashcards
 * Contains sample public decks for the browse/discovery page
 */

export interface SeedCard {
  id: string;
  question: string;
  answer: string;
}

export interface SeedDeck {
  id: string;
  userId: string;
  title: string;
  cards: SeedCard[];
  isPublic: boolean;
  createdAt: string;
  lastModified: number;
}

// System user ID for public sample decks
export const SYSTEM_USER_ID = "system-seed-user";

// Helper to generate UUIDs (deterministic for seed data)
function generateId(prefix: string, index: number): string {
  return `${prefix}-${String(index).padStart(4, "0")}-seed-data`;
}

/**
 * Sample public decks for browse/discovery
 */
export const SEED_DECKS: SeedDeck[] = [
  {
    id: generateId("deck", 1),
    userId: SYSTEM_USER_ID,
    title: "Basic Spanish Vocabulary",
    isPublic: true,
    createdAt: "2024-01-15T10:00:00.000Z",
    lastModified: Date.now(),
    cards: [
      { id: generateId("card", 101), question: "Hello", answer: "Hola" },
      { id: generateId("card", 102), question: "Goodbye", answer: "Adios" },
      { id: generateId("card", 103), question: "Thank you", answer: "Gracias" },
      { id: generateId("card", 104), question: "Please", answer: "Por favor" },
      { id: generateId("card", 105), question: "Yes", answer: "Si" },
      { id: generateId("card", 106), question: "No", answer: "No" },
      { id: generateId("card", 107), question: "Good morning", answer: "Buenos dias" },
      { id: generateId("card", 108), question: "Good night", answer: "Buenas noches" },
      { id: generateId("card", 109), question: "How are you?", answer: "Como estas?" },
      { id: generateId("card", 110), question: "I don't understand", answer: "No entiendo" },
    ],
  },
  {
    id: generateId("deck", 2),
    userId: SYSTEM_USER_ID,
    title: "JavaScript Fundamentals",
    isPublic: true,
    createdAt: "2024-01-20T14:30:00.000Z",
    lastModified: Date.now(),
    cards: [
      {
        id: generateId("card", 201),
        question: "What is the difference between let and const?",
        answer: "let allows reassignment, const does not. Both are block-scoped.",
      },
      {
        id: generateId("card", 202),
        question: "What is a closure?",
        answer:
          "A closure is a function that has access to variables from its outer (enclosing) function's scope, even after the outer function has returned.",
      },
      {
        id: generateId("card", 203),
        question: "What is the difference between == and ===?",
        answer: "== compares values with type coercion, === compares both value and type (strict equality).",
      },
      {
        id: generateId("card", 204),
        question: "What is hoisting?",
        answer:
          "Hoisting is JavaScript's behavior of moving declarations to the top of their scope before code execution. var declarations are hoisted, let/const are not.",
      },
      {
        id: generateId("card", 205),
        question: "What is the event loop?",
        answer:
          "The event loop is a mechanism that allows JavaScript to perform non-blocking operations by offloading operations to the system kernel when possible.",
      },
      {
        id: generateId("card", 206),
        question: "What is a Promise?",
        answer:
          "A Promise is an object representing the eventual completion or failure of an asynchronous operation. It can be pending, fulfilled, or rejected.",
      },
      {
        id: generateId("card", 207),
        question: "What is async/await?",
        answer:
          "async/await is syntactic sugar over Promises. async functions return Promises, and await pauses execution until a Promise resolves.",
      },
      {
        id: generateId("card", 208),
        question: "What is the spread operator?",
        answer: "The spread operator (...) expands an iterable into individual elements. Used for copying arrays/objects or passing arguments.",
      },
    ],
  },
  {
    id: generateId("deck", 3),
    userId: SYSTEM_USER_ID,
    title: "World Capitals",
    isPublic: true,
    createdAt: "2024-02-01T09:00:00.000Z",
    lastModified: Date.now(),
    cards: [
      { id: generateId("card", 301), question: "What is the capital of France?", answer: "Paris" },
      { id: generateId("card", 302), question: "What is the capital of Japan?", answer: "Tokyo" },
      { id: generateId("card", 303), question: "What is the capital of Australia?", answer: "Canberra" },
      { id: generateId("card", 304), question: "What is the capital of Brazil?", answer: "Brasilia" },
      { id: generateId("card", 305), question: "What is the capital of Canada?", answer: "Ottawa" },
      { id: generateId("card", 306), question: "What is the capital of Germany?", answer: "Berlin" },
      { id: generateId("card", 307), question: "What is the capital of Italy?", answer: "Rome" },
      { id: generateId("card", 308), question: "What is the capital of South Korea?", answer: "Seoul" },
      { id: generateId("card", 309), question: "What is the capital of India?", answer: "New Delhi" },
      { id: generateId("card", 310), question: "What is the capital of Egypt?", answer: "Cairo" },
    ],
  },
  {
    id: generateId("deck", 4),
    userId: SYSTEM_USER_ID,
    title: "React Concepts",
    isPublic: true,
    createdAt: "2024-02-10T16:00:00.000Z",
    lastModified: Date.now(),
    cards: [
      {
        id: generateId("card", 401),
        question: "What is a React component?",
        answer: "A reusable piece of UI that can accept props and manage its own state. Can be a function or class.",
      },
      {
        id: generateId("card", 402),
        question: "What is JSX?",
        answer: "JSX is a syntax extension for JavaScript that looks like HTML. It gets compiled to React.createElement() calls.",
      },
      {
        id: generateId("card", 403),
        question: "What is the useState hook?",
        answer: "useState is a hook that lets you add state to functional components. Returns [state, setState].",
      },
      {
        id: generateId("card", 404),
        question: "What is the useEffect hook?",
        answer: "useEffect lets you perform side effects in functional components. Runs after render, can have cleanup function.",
      },
      {
        id: generateId("card", 405),
        question: "What are props?",
        answer: "Props (properties) are read-only data passed from parent to child components. They cannot be modified by the child.",
      },
      {
        id: generateId("card", 406),
        question: "What is the Virtual DOM?",
        answer:
          "A lightweight JavaScript representation of the real DOM. React uses it to efficiently update only what's changed.",
      },
    ],
  },
  {
    id: generateId("deck", 5),
    userId: SYSTEM_USER_ID,
    title: "Basic Math Formulas",
    isPublic: true,
    createdAt: "2024-02-15T11:00:00.000Z",
    lastModified: Date.now(),
    cards: [
      { id: generateId("card", 501), question: "Area of a circle", answer: "A = pi * r^2" },
      { id: generateId("card", 502), question: "Circumference of a circle", answer: "C = 2 * pi * r" },
      { id: generateId("card", 503), question: "Pythagorean theorem", answer: "a^2 + b^2 = c^2" },
      { id: generateId("card", 504), question: "Area of a triangle", answer: "A = (base * height) / 2" },
      { id: generateId("card", 505), question: "Quadratic formula", answer: "x = (-b +/- sqrt(b^2 - 4ac)) / 2a" },
      { id: generateId("card", 506), question: "Slope of a line", answer: "m = (y2 - y1) / (x2 - x1)" },
      { id: generateId("card", 507), question: "Distance formula", answer: "d = sqrt((x2-x1)^2 + (y2-y1)^2)" },
      { id: generateId("card", 508), question: "Volume of a sphere", answer: "V = (4/3) * pi * r^3" },
    ],
  },
  {
    id: generateId("deck", 6),
    userId: SYSTEM_USER_ID,
    title: "Periodic Table Elements",
    isPublic: true,
    createdAt: "2024-02-20T08:00:00.000Z",
    lastModified: Date.now(),
    cards: [
      { id: generateId("card", 601), question: "Symbol for Gold", answer: "Au (Aurum)" },
      { id: generateId("card", 602), question: "Symbol for Silver", answer: "Ag (Argentum)" },
      { id: generateId("card", 603), question: "Symbol for Iron", answer: "Fe (Ferrum)" },
      { id: generateId("card", 604), question: "Symbol for Sodium", answer: "Na (Natrium)" },
      { id: generateId("card", 605), question: "Symbol for Potassium", answer: "K (Kalium)" },
      { id: generateId("card", 606), question: "Atomic number of Carbon", answer: "6" },
      { id: generateId("card", 607), question: "Atomic number of Oxygen", answer: "8" },
    ],
  },
  {
    id: generateId("deck", 7),
    userId: SYSTEM_USER_ID,
    title: "US History",
    isPublic: true,
    createdAt: "2024-02-25T10:00:00.000Z",
    lastModified: Date.now(),
    cards: [
      { id: generateId("card", 701), question: "Year the Declaration of Independence was signed", answer: "1776" },
      { id: generateId("card", 702), question: "First US President", answer: "George Washington" },
      { id: generateId("card", 703), question: "President who freed the slaves", answer: "Abraham Lincoln" },
      { id: generateId("card", 704), question: "Year World War II ended", answer: "1945" },
      { id: generateId("card", 705), question: "Number of original US colonies", answer: "13" },
    ],
  },
  {
    id: generateId("deck", 8),
    userId: SYSTEM_USER_ID,
    title: "French Vocabulary",
    isPublic: true,
    createdAt: "2024-03-01T09:00:00.000Z",
    lastModified: Date.now(),
    cards: [
      { id: generateId("card", 801), question: "Hello", answer: "Bonjour" },
      { id: generateId("card", 802), question: "Thank you", answer: "Merci" },
      { id: generateId("card", 803), question: "Goodbye", answer: "Au revoir" },
      { id: generateId("card", 804), question: "Please", answer: "S'il vous plait" },
      { id: generateId("card", 805), question: "Yes", answer: "Oui" },
      { id: generateId("card", 806), question: "No", answer: "Non" },
    ],
  },
  {
    id: generateId("deck", 9),
    userId: SYSTEM_USER_ID,
    title: "German Vocabulary",
    isPublic: true,
    createdAt: "2024-03-05T14:00:00.000Z",
    lastModified: Date.now(),
    cards: [
      { id: generateId("card", 901), question: "Hello", answer: "Hallo" },
      { id: generateId("card", 902), question: "Thank you", answer: "Danke" },
      { id: generateId("card", 903), question: "Goodbye", answer: "Auf Wiedersehen" },
      { id: generateId("card", 904), question: "Please", answer: "Bitte" },
      { id: generateId("card", 905), question: "Good morning", answer: "Guten Morgen" },
    ],
  },
  {
    id: generateId("deck", 10),
    userId: SYSTEM_USER_ID,
    title: "Solar System",
    isPublic: true,
    createdAt: "2024-03-10T11:00:00.000Z",
    lastModified: Date.now(),
    cards: [
      { id: generateId("card", 1001), question: "Closest planet to the Sun", answer: "Mercury" },
      { id: generateId("card", 1002), question: "Largest planet in our Solar System", answer: "Jupiter" },
      { id: generateId("card", 1003), question: "Planet known for its rings", answer: "Saturn" },
      { id: generateId("card", 1004), question: "The Red Planet", answer: "Mars" },
      { id: generateId("card", 1005), question: "Number of planets in the Solar System", answer: "8" },
      { id: generateId("card", 1006), question: "Hottest planet in the Solar System", answer: "Venus" },
    ],
  },
  {
    id: generateId("deck", 11),
    userId: SYSTEM_USER_ID,
    title: "Human Anatomy",
    isPublic: true,
    createdAt: "2024-03-15T09:00:00.000Z",
    lastModified: Date.now(),
    cards: [
      { id: generateId("card", 1101), question: "Largest organ in the human body", answer: "Skin" },
      { id: generateId("card", 1102), question: "Number of bones in adult human body", answer: "206" },
      { id: generateId("card", 1103), question: "Organ that pumps blood", answer: "Heart" },
      { id: generateId("card", 1104), question: "Organ responsible for filtering blood", answer: "Kidneys" },
      { id: generateId("card", 1105), question: "Number of chambers in the heart", answer: "4" },
    ],
  },
  {
    id: generateId("deck", 12),
    userId: SYSTEM_USER_ID,
    title: "Music Theory Basics",
    isPublic: true,
    createdAt: "2024-03-20T16:00:00.000Z",
    lastModified: Date.now(),
    cards: [
      { id: generateId("card", 1201), question: "How many notes in a standard octave?", answer: "8" },
      { id: generateId("card", 1202), question: "What does 'forte' mean?", answer: "Loud" },
      { id: generateId("card", 1203), question: "What does 'piano' mean in music?", answer: "Soft/Quiet" },
      { id: generateId("card", 1204), question: "How many lines in a musical staff?", answer: "5" },
      { id: generateId("card", 1205), question: "What is a treble clef also called?", answer: "G clef" },
    ],
  },
  {
    id: generateId("deck", 13),
    userId: SYSTEM_USER_ID,
    title: "Famous Inventors",
    isPublic: true,
    createdAt: "2024-03-25T10:00:00.000Z",
    lastModified: Date.now(),
    cards: [
      { id: generateId("card", 1301), question: "Who invented the light bulb?", answer: "Thomas Edison" },
      { id: generateId("card", 1302), question: "Who invented the telephone?", answer: "Alexander Graham Bell" },
      { id: generateId("card", 1303), question: "Who invented the World Wide Web?", answer: "Tim Berners-Lee" },
      { id: generateId("card", 1304), question: "Who invented the airplane?", answer: "Wright Brothers" },
      { id: generateId("card", 1305), question: "Who invented the printing press?", answer: "Johannes Gutenberg" },
    ],
  },
  {
    id: generateId("deck", 14),
    userId: SYSTEM_USER_ID,
    title: "Australian Animals",
    isPublic: true,
    createdAt: "2024-03-30T08:00:00.000Z",
    lastModified: Date.now(),
    cards: [
      { id: generateId("card", 1401), question: "Marsupial that hops", answer: "Kangaroo" },
      { id: generateId("card", 1402), question: "Egg-laying mammal with a bill", answer: "Platypus" },
      { id: generateId("card", 1403), question: "Bear-like marsupial that eats eucalyptus", answer: "Koala" },
      { id: generateId("card", 1404), question: "Large flightless bird native to Australia", answer: "Emu" },
      { id: generateId("card", 1405), question: "Marsupial known as the Tasmanian Devil", answer: "Sarcophilus harrisii" },
    ],
  },
  {
    id: generateId("deck", 15),
    userId: SYSTEM_USER_ID,
    title: "Japanese Basics",
    isPublic: true,
    createdAt: "2024-04-01T12:00:00.000Z",
    lastModified: Date.now(),
    cards: [
      { id: generateId("card", 1501), question: "Hello (daytime)", answer: "Konnichiwa" },
      { id: generateId("card", 1502), question: "Thank you", answer: "Arigatou" },
      { id: generateId("card", 1503), question: "Goodbye", answer: "Sayounara" },
      { id: generateId("card", 1504), question: "Good morning", answer: "Ohayou gozaimasu" },
      { id: generateId("card", 1505), question: "Good evening", answer: "Konbanwa" },
      { id: generateId("card", 1506), question: "Excuse me / Sorry", answer: "Sumimasen" },
    ],
  },
];
