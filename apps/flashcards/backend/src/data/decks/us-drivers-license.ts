import { createDeck, textCard, mcCard, SeedDeck } from "./types";

export const usDriversLicense: SeedDeck = createDeck(
  "a1b2c3d4-1111-4000-8000-000000000002",
  "US Driver's License Test (General)",
  "Study for your US driver's permit and license exam. Covers traffic signs, right-of-way rules, speed limits, parking regulations, and essential road safety knowledge applicable across all states.",
  ["driving", "car-license", "learners-permit", "licensing", "usa"],
  [
  // Signs - Shapes and Colors
  mcCard(
    "What does a red octagonal sign mean?",
    ["STOP completely", "Yield to traffic", "No entry"],
    0,
    { explanation: "The red octagon is universally recognized as a STOP sign.", researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part2/part2b.htm" }
  ),
  mcCard(
    "What does a red triangle pointing down mean?",
    ["Yield", "Stop", "No passing"],
    0,
    { explanation: "The inverted red triangle means yield to other traffic.", researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part2/part2b.htm" }
  ),
  mcCard(
    "What shape is a railroad crossing sign?",
    ["Round (circular)", "Diamond", "Square"],
    0,
    { explanation: "Railroad crossing advance warning signs are round with an X.", researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part8/part8a.htm" }
  ),
  mcCard(
    "What do yellow diamond signs indicate?",
    ["Warning", "Construction", "Regulatory"],
    0,
    { explanation: "Yellow diamond signs warn of hazards or road conditions ahead.", researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part2/part2c.htm" }
  ),
  mcCard(
    "What do orange signs indicate?",
    ["Construction or road work", "Warning", "School zone"],
    0,
    { explanation: "Orange signs indicate construction zones or road work.", researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part6/part6f.htm" }
  ),
  textCard(
    "What does a white rectangular sign indicate?",
    "Regulatory information - speed limits, lane usage, and other rules you must follow.",
    { researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part2/part2b.htm" }
  ),
  textCard(
    "What does a green sign indicate?",
    "Guide/direction information - destinations, distances, and route markers.",
    { researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part2/part2d.htm" }
  ),
  textCard(
    "What does a blue sign indicate?",
    "Motorist services - gas, food, lodging, hospitals, and rest areas.",
    { researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part2/part2d.htm" }
  ),
  textCard(
    "What does a brown sign indicate?",
    "Recreational and cultural interest areas - parks, historic sites, scenic areas.",
    { researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part2/part2d.htm" }
  ),
  mcCard(
    "What shape is a school zone sign?",
    ["Pentagon (5 sides)", "Diamond", "Rectangle"],
    0,
    { explanation: "School zone warning signs are pentagon-shaped.", researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part7/part7a.htm" }
  ),

  // Speed Limits
  mcCard(
    "What is the typical speed limit in a school zone?",
    ["15-25 mph", "35 mph", "10 mph"],
    0,
    { explanation: "School zones typically have 15-25 mph limits when children are present.", researchUrl: "https://www.nhtsa.gov/road-safety/school-bus-safety" }
  ),
  mcCard(
    "What is the typical residential area speed limit?",
    ["25-30 mph", "45 mph", "15 mph"],
    0,
    { explanation: "Residential areas typically have 25-30 mph speed limits.", researchUrl: "https://www.nhtsa.gov/risky-driving/speeding" }
  ),
  textCard(
    "What is the basic speed law?",
    "Never drive faster than is safe for current conditions, regardless of posted limits.",
    { researchUrl: "https://www.nhtsa.gov/risky-driving/speeding" }
  ),
  mcCard(
    "On most highways, the minimum speed is:",
    ["Usually 40-45 mph", "No minimum", "20 mph"],
    0,
    { explanation: "Most highways have minimum speed limits around 40-45 mph.", researchUrl: "https://www.fhwa.dot.gov/policyinformation/statistics/2020/dl22.cfm" }
  ),

  // Right of Way
  mcCard(
    "At a 4-way stop, who goes first?",
    ["The first vehicle to arrive", "The largest vehicle", "Vehicles turning right"],
    0,
    { explanation: "The first vehicle to stop completely has the right of way.", researchUrl: "https://www.nhtsa.gov/road-safety/pedestrian-safety" }
  ),
  mcCard(
    "If two vehicles arrive at a 4-way stop at the same time:",
    ["Vehicle on the right goes first", "Vehicle on the left goes first", "Vehicle going straight goes first"],
    0,
    { explanation: "Yield to the vehicle on your right.", researchUrl: "https://driversed.com/driving-information/signs-signals-and-markings/right-of-way/" }
  ),
  mcCard(
    "When making a left turn, you must yield to:",
    ["Oncoming traffic and pedestrians", "Only pedestrians", "No one if you have a green light"],
    0,
    { explanation: "Always yield to oncoming traffic and pedestrians when turning left.", researchUrl: "https://www.nhtsa.gov/road-safety/pedestrian-safety" }
  ),
  textCard(
    "Who has the right of way at a roundabout?",
    "Traffic already in the roundabout has the right of way. Yield before entering.",
    { researchUrl: "https://safety.fhwa.dot.gov/intersection/roundabouts/" }
  ),
  mcCard(
    "When entering a highway from an on-ramp, you must yield to:",
    ["Traffic already on the highway", "No one - highway traffic must make room", "Trucks only"],
    0,
    { explanation: "You must yield and adjust speed to merge safely with highway traffic.", researchUrl: "https://www.nhtsa.gov/driving-safety" }
  ),
  textCard(
    "Do pedestrians always have the right of way?",
    "Pedestrians have the right of way at marked crosswalks and intersections. Drivers must always try to avoid hitting pedestrians.",
    { researchUrl: "https://www.nhtsa.gov/road-safety/pedestrian-safety" }
  ),

  // Traffic Signals
  mcCard(
    "What does a solid yellow light mean?",
    ["Stop if you can do so safely", "Speed up to clear intersection", "Proceed with caution"],
    0,
    { explanation: "Prepare to stop - the light will turn red. Only proceed if stopping would be unsafe.", researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part4/part4d.htm" }
  ),
  mcCard(
    "What does a flashing yellow light mean?",
    ["Slow down and proceed with caution", "Stop completely then proceed", "Yield to cross traffic"],
    0,
    { explanation: "Slow down and be prepared to stop if necessary.", researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part4/part4d.htm" }
  ),
  mcCard(
    "What does a flashing red light mean?",
    ["Stop completely, then proceed when safe", "Slow down and proceed", "Stop and wait for green"],
    0,
    { explanation: "Treat it as a stop sign - stop completely, yield, then proceed.", researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part4/part4d.htm" }
  ),
  mcCard(
    "What does a green arrow mean?",
    ["You may turn in that direction - protected turn", "Yield then turn", "Stop before turning"],
    0,
    { explanation: "A green arrow means you have a protected turn - oncoming traffic is stopped.", researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part4/part4d.htm" }
  ),
  textCard(
    "Can you turn right on red?",
    "Yes, in most states after coming to a complete stop and yielding, unless a sign prohibits it.",
    { researchUrl: "https://www.iihs.org/topics/red-light-running" }
  ),
  textCard(
    "Can you turn left on red?",
    "Only from a one-way street onto another one-way street, after stopping, in most states.",
    { researchUrl: "https://driversed.com/driving-information/signs-signals-and-markings/traffic-signals/" }
  ),

  // Lane Usage
  mcCard(
    "What is the left lane on a highway typically used for?",
    ["Passing only", "Regular driving", "Slower traffic"],
    0,
    { explanation: "The left lane is for passing - move right after passing.", researchUrl: "https://www.nhtsa.gov/driving-safety" }
  ),
  textCard(
    "What does a solid white line between lanes mean?",
    "Discouraged lane change - stay in your lane unless necessary for safety.",
    { researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part3/part3a.htm" }
  ),
  textCard(
    "What does a solid yellow line mean?",
    "Separates traffic going opposite directions - do not cross to pass.",
    { researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part3/part3a.htm" }
  ),
  mcCard(
    "What does a broken yellow line mean?",
    ["Passing is allowed when safe", "No passing at any time", "Passing only for motorcycles"],
    0,
    { explanation: "You may pass if the broken line is on your side and it's safe.", researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part3/part3a.htm" }
  ),
  textCard(
    "What do double solid yellow lines mean?",
    "No passing in either direction - do not cross for any reason except to turn into a driveway.",
    { researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part3/part3a.htm" }
  ),
  mcCard(
    "What is an HOV lane?",
    ["High Occupancy Vehicle lane requiring 2+ passengers", "Highway Overtake Vehicle lane", "Hazardous Only Vehicle lane"],
    0,
    { explanation: "HOV lanes are for vehicles with 2 or more occupants to reduce traffic.", researchUrl: "https://ops.fhwa.dot.gov/freewaymgmt/hovlanes.htm" }
  ),

  // Passing
  mcCard(
    "When passing a bicycle, leave at least:",
    ["3 feet of space", "1 foot of space", "6 feet of space"],
    0,
    { explanation: "Leave at least 3 feet between your vehicle and a bicycle.", researchUrl: "https://www.nhtsa.gov/road-safety/bicycle-safety" }
  ),
  mcCard(
    "When is it illegal to pass another vehicle?",
    ["On hills, curves, or when view is blocked", "On straight roads", "During daytime"],
    0,
    { explanation: "Never pass when you can't see far enough ahead.", researchUrl: "https://www.nhtsa.gov/driving-safety" }
  ),
  textCard(
    "Can you exceed the speed limit to pass?",
    "No. You must complete your pass within the legal speed limit.",
    { researchUrl: "https://www.nhtsa.gov/risky-driving/speeding" }
  ),
  mcCard(
    "When being passed, you should:",
    ["Maintain speed and stay in your lane", "Speed up", "Move to the shoulder"],
    0,
    { explanation: "Don't speed up when being passed - maintain your speed.", researchUrl: "https://www.nhtsa.gov/driving-safety" }
  ),

  // Parking
  mcCard(
    "How far from a fire hydrant must you park?",
    ["15 feet", "5 feet", "25 feet"],
    0,
    { explanation: "Stay at least 15 feet from a fire hydrant.", researchUrl: "https://www.usfa.fema.gov/prevention/outreach/hydrants.html" }
  ),
  mcCard(
    "How far from a crosswalk must you park?",
    ["20 feet", "10 feet", "30 feet"],
    0,
    { explanation: "Park at least 20 feet from a crosswalk.", researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part3/part3b.htm" }
  ),
  mcCard(
    "How far from a stop sign must you park?",
    ["30 feet", "15 feet", "50 feet"],
    0,
    { explanation: "Park at least 30 feet from a stop sign.", researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part3/part3b.htm" }
  ),
  mcCard(
    "When parking uphill with a curb, turn your wheels:",
    ["Away from curb", "Toward curb", "Straight"],
    0,
    { explanation: "Turn wheels away from curb so car rolls into curb if it moves.", researchUrl: "https://driversed.com/driving-information/driving-techniques/parking-on-hills/" }
  ),
  mcCard(
    "When parking downhill, turn your wheels:",
    ["Toward curb", "Away from curb", "Straight"],
    0,
    { explanation: "Turn wheels toward curb so car rolls into curb if it moves.", researchUrl: "https://driversed.com/driving-information/driving-techniques/parking-on-hills/" }
  ),
  textCard(
    "What does a red curb mean?",
    "No stopping, standing, or parking at any time.",
    { researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part3/part3b.htm" }
  ),
  textCard(
    "What does a yellow curb mean?",
    "Loading zone - stop only to load/unload passengers or freight.",
    { researchUrl: "https://mutcd.fhwa.dot.gov/htm/2009/part3/part3b.htm" }
  ),
  textCard(
    "What does a blue curb mean?",
    "Handicapped parking only - requires valid placard or license plate.",
    { researchUrl: "https://adata.org/factsheet/parking" }
  ),

  // Alcohol and Drugs
  mcCard(
    "What is the legal blood alcohol limit for drivers 21+?",
    ["0.08%", "0.05%", "0.10%"],
    0,
    { explanation: "The legal limit is 0.08% BAC for drivers 21 and older.", researchUrl: "https://www.nhtsa.gov/risky-driving/drunk-driving" }
  ),
  mcCard(
    "What is the legal BAC limit for drivers under 21?",
    ["0.00-0.02% (zero tolerance)", "0.05%", "0.08%"],
    0,
    { explanation: "Most states have zero tolerance - any alcohol is illegal for under 21.", researchUrl: "https://www.nhtsa.gov/risky-driving/drunk-driving" }
  ),
  mcCard(
    "What is implied consent?",
    ["By driving, you agree to chemical testing if arrested for DUI", "You must consent to vehicle searches", "You must identify yourself"],
    0,
    { explanation: "By driving, you've agreed to BAC testing if lawfully arrested for suspected DUI.", researchUrl: "https://www.nhtsa.gov/drunk-driving/resources-states" }
  ),
  textCard(
    "What is the penalty for refusing a BAC test?",
    "Automatic license suspension, often longer than a DUI conviction.",
    { researchUrl: "https://www.nhtsa.gov/drunk-driving/resources-states" }
  ),
  mcCard(
    "How does alcohol affect driving?",
    ["Impairs judgment, reaction time, and coordination", "Only affects reaction time", "No effect below legal limit"],
    0,
    { explanation: "Alcohol impairs all driving abilities even below the legal limit.", researchUrl: "https://www.nhtsa.gov/risky-driving/drunk-driving" }
  ),

  // Safe Following
  mcCard(
    "The recommended following distance in good conditions is:",
    ["3-4 seconds", "1 car length", "1-2 seconds"],
    0,
    { explanation: "Maintain at least 3-4 seconds following distance.", researchUrl: "https://www.nhtsa.gov/driving-safety" }
  ),
  mcCard(
    "In poor conditions, following distance should be:",
    ["6+ seconds", "3 seconds", "Same as normal"],
    0,
    { explanation: "Double or triple your following distance in rain, fog, or snow.", researchUrl: "https://www.nhtsa.gov/driving-safety" }
  ),
  textCard(
    "How do you measure following distance?",
    "Pick a fixed point, when the car ahead passes it, count seconds until you reach it.",
    { researchUrl: "https://www.nhtsa.gov/driving-safety" }
  ),

  // Emergencies
  mcCard(
    "If your brakes fail, you should:",
    ["Pump brakes, use parking brake, shift to lower gear", "Turn off engine immediately", "Jump out of vehicle"],
    0,
    { explanation: "Pump brakes rapidly, apply parking brake gradually, downshift.", researchUrl: "https://www.nhtsa.gov/vehicle-safety" }
  ),
  mcCard(
    "If your tire blows out, you should:",
    ["Hold steering firmly, ease off gas, brake gently when slowed", "Brake hard immediately", "Accelerate out of it"],
    0,
    { explanation: "Keep control with steering, slow gradually, don't slam brakes.", researchUrl: "https://www.nhtsa.gov/equipment/tires" }
  ),
  mcCard(
    "If your car starts to skid, you should:",
    ["Steer in the direction you want to go", "Brake hard", "Steer opposite to the skid"],
    0,
    { explanation: "Look and steer where you want to go - your hands follow your eyes.", researchUrl: "https://www.nhtsa.gov/driving-safety" }
  ),
  textCard(
    "What should you do if your accelerator sticks?",
    "Shift to neutral, apply brakes, focus on steering, pull over safely.",
    { researchUrl: "https://www.nhtsa.gov/vehicle-safety" }
  ),
  mcCard(
    "When approaching emergency vehicles with flashing lights, you must:",
    ["Move right and stop", "Speed up to pass", "Continue normally"],
    0,
    { explanation: "Pull to the right and stop until emergency vehicle passes.", researchUrl: "https://www.nhtsa.gov/road-safety/emergency-vehicles" }
  ),
  textCard(
    "What is the 'Move Over' law?",
    "When passing stopped emergency or work vehicles with flashing lights, move over one lane if possible, or slow down significantly.",
    { researchUrl: "https://www.nhtsa.gov/road-safety" }
  ),

  // Railroad Crossings
  mcCard(
    "When must you stop at a railroad crossing?",
    ["When signals are flashing or gates are down", "Always", "Only if train is visible"],
    0,
    { explanation: "Stop when signals flash, gates are down, or a train is approaching.", researchUrl: "https://oli.org/safety-near-trains/rail-safety-basics" }
  ),
  mcCard(
    "How far from railroad tracks should you stop?",
    ["15-50 feet", "5 feet", "100 feet"],
    0,
    { explanation: "Stop between 15 and 50 feet from the nearest rail.", researchUrl: "https://oli.org/safety-near-trains/rail-safety-basics" }
  ),
  textCard(
    "What should you never do at a railroad crossing?",
    "Never stop on the tracks, never try to beat a train, never go around lowered gates.",
    { researchUrl: "https://oli.org/safety-near-trains/rail-safety-basics" }
  ),

  // School Buses
  mcCard(
    "When must you stop for a school bus?",
    ["When red lights flash and stop sign is out", "Only if children are visible", "Only on 2-lane roads"],
    0,
    { explanation: "Stop when red lights flash - traffic in BOTH directions must stop on undivided roads.", researchUrl: "https://www.nhtsa.gov/road-safety/school-bus-safety" }
  ),
  mcCard(
    "When can you pass a stopped school bus loading children?",
    ["When separated by a physical barrier/median", "When the road is clear", "After honking"],
    0,
    { explanation: "Only pass if separated by a physical median or barrier.", researchUrl: "https://www.nhtsa.gov/road-safety/school-bus-safety" }
  ),

  // Sharing the Road
  textCard(
    "What should you watch for when near parked cars?",
    "Car doors opening, pedestrians stepping out, cars pulling out.",
    { researchUrl: "https://www.nhtsa.gov/road-safety/pedestrian-safety" }
  ),
  mcCard(
    "How should you interact with motorcycles?",
    ["Give them full lane, don't share lanes", "They can share your lane", "Flash lights to warn them"],
    0,
    { explanation: "Motorcycles are entitled to a full lane - never share their space.", researchUrl: "https://www.nhtsa.gov/road-safety/motorcycle-safety" }
  ),
  textCard(
    "What are large truck blind spots?",
    "Large areas where the driver can't see you - directly behind, beside the cab, and right side especially. If you can't see their mirrors, they can't see you.",
    { researchUrl: "https://www.fmcsa.dot.gov/ourroads/large-trucks-and-buses" }
  ),
  mcCard(
    "When driving near large trucks, you should:",
    ["Avoid blind spots, pass quickly, give them room", "Tailgate to draft", "Flash lights frequently"],
    0,
    { explanation: "Stay visible, pass promptly, give extra stopping distance.", researchUrl: "https://www.fmcsa.dot.gov/ourroads/large-trucks-and-buses" }
  ),

  // Night Driving
  mcCard(
    "When should you use low beam headlights instead of high beams?",
    ["Within 500 feet of oncoming traffic or 300 feet when following", "Only in fog", "Never use low beams at night"],
    0,
    { explanation: "Dim lights when approaching or following other vehicles.", researchUrl: "https://www.nhtsa.gov/driving-safety" }
  ),
  mcCard(
    "If blinded by oncoming headlights, you should:",
    ["Look toward right edge of road", "Flash your high beams", "Stare at the lights"],
    0,
    { explanation: "Look to the right side of the road to avoid being blinded.", researchUrl: "https://www.nhtsa.gov/driving-safety" }
  ),
  textCard(
    "What increases risk when driving at night?",
    "Reduced visibility, fatigue, more impaired drivers, harder to judge speed/distance.",
    { researchUrl: "https://www.nhtsa.gov/driving-safety" }
  ),

  // Weather Conditions
  mcCard(
    "What is hydroplaning?",
    ["Tires losing contact with road due to water", "Engine flooding", "Brake failure in rain"],
    0,
    { explanation: "Hydroplaning occurs when water builds up faster than tires can scatter it.", researchUrl: "https://www.nhtsa.gov/driving-safety" }
  ),
  textCard(
    "What should you do if you start to hydroplane?",
    "Ease off the gas, don't brake hard, steer straight, wait for tires to grip.",
    { researchUrl: "https://www.nhtsa.gov/driving-safety" }
  ),
  mcCard(
    "When driving in fog, use:",
    ["Low beam headlights", "High beam headlights", "Parking lights only"],
    0,
    { explanation: "Use low beams - high beams reflect off fog and reduce visibility.", researchUrl: "https://www.nhtsa.gov/driving-safety" }
  ),
  textCard(
    "What is black ice?",
    "Thin, transparent ice that's hard to see. Common on bridges, overpasses, and shaded areas.",
    { researchUrl: "https://www.nhtsa.gov/winter-driving-safety" }
  ),

  // Documents and Insurance
  mcCard(
    "What documents must you carry while driving?",
    ["License, registration, and proof of insurance", "License only", "Insurance only"],
    0,
    { explanation: "Always carry your driver's license, vehicle registration, and insurance proof.", researchUrl: "https://www.usa.gov/motor-vehicle-services" }
  ),
  textCard(
    "What happens if you're caught driving without insurance?",
    "Fines, license suspension, vehicle impoundment, and possible criminal charges.",
    { researchUrl: "https://www.usa.gov/motor-vehicle-services" }
  ),

  // Misc Rules
  mcCard(
    "When must children be in car seats or boosters?",
    ["Based on age, height, and weight per state law", "Only under age 2", "Only on highways"],
    0,
    { explanation: "Laws vary by state but generally require car seats for young children and boosters until 4'9\" tall.", researchUrl: "https://www.nhtsa.gov/equipment/car-seats-and-booster-seats" }
  ),
  textCard(
    "Is it legal to use a cell phone while driving?",
    "Many states ban handheld use. Texting while driving is illegal in most states.",
    { researchUrl: "https://www.nhtsa.gov/risky-driving/distracted-driving" }
  ),
  mcCard(
    "When must you use your turn signal?",
    ["At least 100 feet before turning", "Only when other cars are visible", "Optional"],
    0,
    { explanation: "Signal at least 100 feet before turning or changing lanes.", researchUrl: "https://www.nhtsa.gov/driving-safety" }
  ),
]);
