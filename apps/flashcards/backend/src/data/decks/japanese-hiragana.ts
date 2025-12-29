import { createDeck, mcCard, SeedDeck } from "./types";

export const japaneseHiragana: SeedDeck = createDeck(
  "a1b2c3d4-1111-4000-8000-000000000009",
  "Japanese Hiragana",
  "Master the Japanese Hiragana alphabet. Covers all 46 basic characters plus dakuten (voiced) and handakuten variations. Essential foundation for reading and writing Japanese.",
  ["languages", "japanese"],
  [
  // Vowels (a, i, u, e, o)
  mcCard("What is the reading of あ?", ["a", "i", "u"], 0, { explanation: "あ (a) is the first hiragana character." }),
  mcCard("What is the reading of い?", ["i", "e", "a"], 0, { explanation: "い (i) is the second vowel." }),
  mcCard("What is the reading of う?", ["u", "o", "e"], 0, { explanation: "う (u) is the third vowel." }),
  mcCard("What is the reading of え?", ["e", "i", "a"], 0, { explanation: "え (e) is the fourth vowel." }),
  mcCard("What is the reading of お?", ["o", "u", "a"], 0, { explanation: "お (o) is the fifth vowel." }),

  // K-row (ka, ki, ku, ke, ko)
  mcCard("What is the reading of か?", ["ka", "ki", "ko"], 0, { explanation: "か (ka) starts the K-row." }),
  mcCard("What is the reading of き?", ["ki", "ka", "ku"], 0, { explanation: "き (ki) is in the K-row." }),
  mcCard("What is the reading of く?", ["ku", "ko", "ka"], 0, { explanation: "く (ku) is in the K-row." }),
  mcCard("What is the reading of け?", ["ke", "ki", "ko"], 0, { explanation: "け (ke) is in the K-row." }),
  mcCard("What is the reading of こ?", ["ko", "ka", "ku"], 0, { explanation: "こ (ko) ends the K-row." }),

  // S-row (sa, shi, su, se, so)
  mcCard("What is the reading of さ?", ["sa", "shi", "so"], 0, { explanation: "さ (sa) starts the S-row." }),
  mcCard("What is the reading of し?", ["shi", "su", "sa"], 0, { explanation: "し (shi) - note the 'shi' not 'si' sound." }),
  mcCard("What is the reading of す?", ["su", "so", "sa"], 0, { explanation: "す (su) is in the S-row." }),
  mcCard("What is the reading of せ?", ["se", "sa", "so"], 0, { explanation: "せ (se) is in the S-row." }),
  mcCard("What is the reading of そ?", ["so", "su", "sa"], 0, { explanation: "そ (so) ends the S-row." }),

  // T-row (ta, chi, tsu, te, to)
  mcCard("What is the reading of た?", ["ta", "te", "to"], 0, { explanation: "た (ta) starts the T-row." }),
  mcCard("What is the reading of ち?", ["chi", "ti", "tsu"], 0, { explanation: "ち (chi) - note the 'chi' not 'ti' sound." }),
  mcCard("What is the reading of つ?", ["tsu", "tu", "chi"], 0, { explanation: "つ (tsu) - this unique sound is common in Japanese." }),
  mcCard("What is the reading of て?", ["te", "ta", "to"], 0, { explanation: "て (te) is in the T-row." }),
  mcCard("What is the reading of と?", ["to", "ta", "te"], 0, { explanation: "と (to) ends the T-row." }),

  // N-row (na, ni, nu, ne, no)
  mcCard("What is the reading of な?", ["na", "ni", "no"], 0, { explanation: "な (na) starts the N-row." }),
  mcCard("What is the reading of に?", ["ni", "na", "nu"], 0, { explanation: "に (ni) is in the N-row." }),
  mcCard("What is the reading of ぬ?", ["nu", "no", "na"], 0, { explanation: "ぬ (nu) is in the N-row." }),
  mcCard("What is the reading of ね?", ["ne", "na", "no"], 0, { explanation: "ね (ne) is in the N-row." }),
  mcCard("What is the reading of の?", ["no", "nu", "na"], 0, { explanation: "の (no) ends the N-row. It's also the possessive particle." }),

  // H-row (ha, hi, fu, he, ho)
  mcCard("What is the reading of は?", ["ha", "hi", "ho"], 0, { explanation: "は (ha) starts the H-row. As a particle, it's pronounced 'wa'." }),
  mcCard("What is the reading of ひ?", ["hi", "ha", "fu"], 0, { explanation: "ひ (hi) is in the H-row." }),
  mcCard("What is the reading of ふ?", ["fu", "hu", "ho"], 0, { explanation: "ふ (fu) - pronounced between 'fu' and 'hu'." }),
  mcCard("What is the reading of へ?", ["he", "ha", "ho"], 0, { explanation: "へ (he) - as a particle, pronounced 'e'." }),
  mcCard("What is the reading of ほ?", ["ho", "ha", "fu"], 0, { explanation: "ほ (ho) ends the H-row." }),

  // M-row (ma, mi, mu, me, mo)
  mcCard("What is the reading of ま?", ["ma", "mi", "mo"], 0, { explanation: "ま (ma) starts the M-row." }),
  mcCard("What is the reading of み?", ["mi", "ma", "mu"], 0, { explanation: "み (mi) is in the M-row." }),
  mcCard("What is the reading of む?", ["mu", "mo", "ma"], 0, { explanation: "む (mu) is in the M-row." }),
  mcCard("What is the reading of め?", ["me", "ma", "mo"], 0, { explanation: "め (me) is in the M-row." }),
  mcCard("What is the reading of も?", ["mo", "mu", "ma"], 0, { explanation: "も (mo) ends the M-row." }),

  // Y-row (ya, yu, yo)
  mcCard("What is the reading of や?", ["ya", "yu", "yo"], 0, { explanation: "や (ya) starts the Y-row." }),
  mcCard("What is the reading of ゆ?", ["yu", "ya", "yo"], 0, { explanation: "ゆ (yu) is in the Y-row." }),
  mcCard("What is the reading of よ?", ["yo", "ya", "yu"], 0, { explanation: "よ (yo) ends the Y-row." }),

  // R-row (ra, ri, ru, re, ro)
  mcCard("What is the reading of ら?", ["ra", "ri", "ro"], 0, { explanation: "ら (ra) starts the R-row. Japanese R is between L and R." }),
  mcCard("What is the reading of り?", ["ri", "ra", "ru"], 0, { explanation: "り (ri) is in the R-row." }),
  mcCard("What is the reading of る?", ["ru", "ro", "ra"], 0, { explanation: "る (ru) is in the R-row." }),
  mcCard("What is the reading of れ?", ["re", "ra", "ro"], 0, { explanation: "れ (re) is in the R-row." }),
  mcCard("What is the reading of ろ?", ["ro", "ru", "ra"], 0, { explanation: "ろ (ro) ends the R-row." }),

  // W-row and N
  mcCard("What is the reading of わ?", ["wa", "wo", "wi"], 0, { explanation: "わ (wa) is one of only two W-row characters still used." }),
  mcCard("What is the reading of を?", ["wo", "o", "wa"], 0, { explanation: "を (wo) is the object marker particle, often pronounced 'o'." }),
  mcCard("What is the reading of ん?", ["n", "nu", "na"], 0, { explanation: "ん (n) is the only consonant that can end a syllable in Japanese." }),

  // Dakuten (voiced) - G
  mcCard("What is the reading of が?", ["ga", "ka", "gi"], 0, { explanation: "が (ga) - voiced version of か (ka)." }),
  mcCard("What is the reading of ぎ?", ["gi", "ki", "gu"], 0, { explanation: "ぎ (gi) - voiced version of き (ki)." }),
  mcCard("What is the reading of ぐ?", ["gu", "ku", "go"], 0, { explanation: "ぐ (gu) - voiced version of く (ku)." }),
  mcCard("What is the reading of げ?", ["ge", "ke", "go"], 0, { explanation: "げ (ge) - voiced version of け (ke)." }),
  mcCard("What is the reading of ご?", ["go", "ko", "ga"], 0, { explanation: "ご (go) - voiced version of こ (ko)." }),

  // Dakuten - Z
  mcCard("What is the reading of ざ?", ["za", "sa", "zi"], 0, { explanation: "ざ (za) - voiced version of さ (sa)." }),
  mcCard("What is the reading of じ?", ["ji", "zi", "zu"], 0, { explanation: "じ (ji) - voiced version of し (shi)." }),
  mcCard("What is the reading of ず?", ["zu", "su", "zo"], 0, { explanation: "ず (zu) - voiced version of す (su)." }),
  mcCard("What is the reading of ぜ?", ["ze", "se", "za"], 0, { explanation: "ぜ (ze) - voiced version of せ (se)." }),
  mcCard("What is the reading of ぞ?", ["zo", "so", "zu"], 0, { explanation: "ぞ (zo) - voiced version of そ (so)." }),

  // Dakuten - D
  mcCard("What is the reading of だ?", ["da", "ta", "de"], 0, { explanation: "だ (da) - voiced version of た (ta)." }),
  mcCard("What is the reading of ぢ?", ["ji", "chi", "di"], 0, { explanation: "ぢ (ji/di) - voiced version of ち (chi). Rarely used." }),
  mcCard("What is the reading of づ?", ["zu", "tsu", "du"], 0, { explanation: "づ (zu/du) - voiced version of つ (tsu). Rarely used." }),
  mcCard("What is the reading of で?", ["de", "te", "do"], 0, { explanation: "で (de) - voiced version of て (te)." }),
  mcCard("What is the reading of ど?", ["do", "to", "da"], 0, { explanation: "ど (do) - voiced version of と (to)." }),

  // Dakuten - B
  mcCard("What is the reading of ば?", ["ba", "ha", "bi"], 0, { explanation: "ば (ba) - voiced version of は (ha)." }),
  mcCard("What is the reading of び?", ["bi", "hi", "bu"], 0, { explanation: "び (bi) - voiced version of ひ (hi)." }),
  mcCard("What is the reading of ぶ?", ["bu", "fu", "bo"], 0, { explanation: "ぶ (bu) - voiced version of ふ (fu)." }),
  mcCard("What is the reading of べ?", ["be", "he", "bo"], 0, { explanation: "べ (be) - voiced version of へ (he)." }),
  mcCard("What is the reading of ぼ?", ["bo", "ho", "ba"], 0, { explanation: "ぼ (bo) - voiced version of ほ (ho)." }),

  // Handakuten - P
  mcCard("What is the reading of ぱ?", ["pa", "ha", "ba"], 0, { explanation: "ぱ (pa) - H-row with handakuten becomes P." }),
  mcCard("What is the reading of ぴ?", ["pi", "hi", "bi"], 0, { explanation: "ぴ (pi) - H-row with handakuten becomes P." }),
  mcCard("What is the reading of ぷ?", ["pu", "fu", "bu"], 0, { explanation: "ぷ (pu) - H-row with handakuten becomes P." }),
  mcCard("What is the reading of ぺ?", ["pe", "he", "be"], 0, { explanation: "ぺ (pe) - H-row with handakuten becomes P." }),
  mcCard("What is the reading of ぽ?", ["po", "ho", "bo"], 0, { explanation: "ぽ (po) - H-row with handakuten becomes P." }),
],
  { researchUrl: "https://www.tofugu.com/japanese/learn-hiragana/" }
);
