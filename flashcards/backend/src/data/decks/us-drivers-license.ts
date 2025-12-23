import { createDeck, textCard, mcCard, SeedDeck } from "./types";

export const usDriversLicense: SeedDeck = createDeck(
  "US Driver's License Test (General)",
  "Study for your US driver's permit and license exam. Covers traffic signs, right-of-way rules, speed limits, parking regulations, and essential road safety knowledge applicable across all states.",
  ["driving", "car-license", "learners-permit", "licensing", "usa"],
  [
  // Signs - Shapes and Colors
  mcCard(
    "What does a red octagonal sign mean?",
    ["STOP completely", "Yield to traffic", "No entry"],
    0,
    "The red octagon is universally recognized as a STOP sign."
  ),
  mcCard(
    "What does a red triangle pointing down mean?",
    ["Yield", "Stop", "No passing"],
    0,
    "The inverted red triangle means yield to other traffic."
  ),
  mcCard(
    "What shape is a railroad crossing sign?",
    ["Round (circular)", "Diamond", "Square"],
    0,
    "Railroad crossing advance warning signs are round with an X."
  ),
  mcCard(
    "What do yellow diamond signs indicate?",
    ["Warning", "Construction", "Regulatory"],
    0,
    "Yellow diamond signs warn of hazards or road conditions ahead."
  ),
  mcCard(
    "What do orange signs indicate?",
    ["Construction or road work", "Warning", "School zone"],
    0,
    "Orange signs indicate construction zones or road work."
  ),
  textCard(
    "What does a white rectangular sign indicate?",
    "Regulatory information - speed limits, lane usage, and other rules you must follow."
  ),
  textCard(
    "What does a green sign indicate?",
    "Guide/direction information - destinations, distances, and route markers."
  ),
  textCard(
    "What does a blue sign indicate?",
    "Motorist services - gas, food, lodging, hospitals, and rest areas."
  ),
  textCard(
    "What does a brown sign indicate?",
    "Recreational and cultural interest areas - parks, historic sites, scenic areas."
  ),
  mcCard(
    "What shape is a school zone sign?",
    ["Pentagon (5 sides)", "Diamond", "Rectangle"],
    0,
    "School zone warning signs are pentagon-shaped."
  ),

  // Speed Limits
  mcCard(
    "What is the typical speed limit in a school zone?",
    ["15-25 mph", "35 mph", "10 mph"],
    0,
    "School zones typically have 15-25 mph limits when children are present."
  ),
  mcCard(
    "What is the typical residential area speed limit?",
    ["25-30 mph", "45 mph", "15 mph"],
    0,
    "Residential areas typically have 25-30 mph speed limits."
  ),
  textCard(
    "What is the basic speed law?",
    "Never drive faster than is safe for current conditions, regardless of posted limits."
  ),
  mcCard(
    "On most highways, the minimum speed is:",
    ["Usually 40-45 mph", "No minimum", "20 mph"],
    0,
    "Most highways have minimum speed limits around 40-45 mph."
  ),

  // Right of Way
  mcCard(
    "At a 4-way stop, who goes first?",
    ["The first vehicle to arrive", "The largest vehicle", "Vehicles turning right"],
    0,
    "The first vehicle to stop completely has the right of way."
  ),
  mcCard(
    "If two vehicles arrive at a 4-way stop at the same time:",
    ["Vehicle on the right goes first", "Vehicle on the left goes first", "Vehicle going straight goes first"],
    0,
    "Yield to the vehicle on your right."
  ),
  mcCard(
    "When making a left turn, you must yield to:",
    ["Oncoming traffic and pedestrians", "Only pedestrians", "No one if you have a green light"],
    0,
    "Always yield to oncoming traffic and pedestrians when turning left."
  ),
  textCard(
    "Who has the right of way at a roundabout?",
    "Traffic already in the roundabout has the right of way. Yield before entering."
  ),
  mcCard(
    "When entering a highway from an on-ramp, you must yield to:",
    ["Traffic already on the highway", "No one - highway traffic must make room", "Trucks only"],
    0,
    "You must yield and adjust speed to merge safely with highway traffic."
  ),
  textCard(
    "Do pedestrians always have the right of way?",
    "Pedestrians have the right of way at marked crosswalks and intersections. Drivers must always try to avoid hitting pedestrians."
  ),

  // Traffic Signals
  mcCard(
    "What does a solid yellow light mean?",
    ["Stop if you can do so safely", "Speed up to clear intersection", "Proceed with caution"],
    0,
    "Prepare to stop - the light will turn red. Only proceed if stopping would be unsafe."
  ),
  mcCard(
    "What does a flashing yellow light mean?",
    ["Slow down and proceed with caution", "Stop completely then proceed", "Yield to cross traffic"],
    0,
    "Slow down and be prepared to stop if necessary."
  ),
  mcCard(
    "What does a flashing red light mean?",
    ["Stop completely, then proceed when safe", "Slow down and proceed", "Stop and wait for green"],
    0,
    "Treat it as a stop sign - stop completely, yield, then proceed."
  ),
  mcCard(
    "What does a green arrow mean?",
    ["You may turn in that direction - protected turn", "Yield then turn", "Stop before turning"],
    0,
    "A green arrow means you have a protected turn - oncoming traffic is stopped."
  ),
  textCard(
    "Can you turn right on red?",
    "Yes, in most states after coming to a complete stop and yielding, unless a sign prohibits it."
  ),
  textCard(
    "Can you turn left on red?",
    "Only from a one-way street onto another one-way street, after stopping, in most states."
  ),

  // Lane Usage
  mcCard(
    "What is the left lane on a highway typically used for?",
    ["Passing only", "Regular driving", "Slower traffic"],
    0,
    "The left lane is for passing - move right after passing."
  ),
  textCard(
    "What does a solid white line between lanes mean?",
    "Discouraged lane change - stay in your lane unless necessary for safety."
  ),
  textCard(
    "What does a solid yellow line mean?",
    "Separates traffic going opposite directions - do not cross to pass."
  ),
  mcCard(
    "What does a broken yellow line mean?",
    ["Passing is allowed when safe", "No passing at any time", "Passing only for motorcycles"],
    0,
    "You may pass if the broken line is on your side and it's safe."
  ),
  textCard(
    "What do double solid yellow lines mean?",
    "No passing in either direction - do not cross for any reason except to turn into a driveway."
  ),
  mcCard(
    "What is an HOV lane?",
    ["High Occupancy Vehicle lane requiring 2+ passengers", "Highway Overtake Vehicle lane", "Hazardous Only Vehicle lane"],
    0,
    "HOV lanes are for vehicles with 2 or more occupants to reduce traffic."
  ),

  // Passing
  mcCard(
    "When passing a bicycle, leave at least:",
    ["3 feet of space", "1 foot of space", "6 feet of space"],
    0,
    "Leave at least 3 feet between your vehicle and a bicycle."
  ),
  mcCard(
    "When is it illegal to pass another vehicle?",
    ["On hills, curves, or when view is blocked", "On straight roads", "During daytime"],
    0,
    "Never pass when you can't see far enough ahead."
  ),
  textCard(
    "Can you exceed the speed limit to pass?",
    "No. You must complete your pass within the legal speed limit."
  ),
  mcCard(
    "When being passed, you should:",
    ["Maintain speed and stay in your lane", "Speed up", "Move to the shoulder"],
    0,
    "Don't speed up when being passed - maintain your speed."
  ),

  // Parking
  mcCard(
    "How far from a fire hydrant must you park?",
    ["15 feet", "5 feet", "25 feet"],
    0,
    "Stay at least 15 feet from a fire hydrant."
  ),
  mcCard(
    "How far from a crosswalk must you park?",
    ["20 feet", "10 feet", "30 feet"],
    0,
    "Park at least 20 feet from a crosswalk."
  ),
  mcCard(
    "How far from a stop sign must you park?",
    ["30 feet", "15 feet", "50 feet"],
    0,
    "Park at least 30 feet from a stop sign."
  ),
  mcCard(
    "When parking uphill with a curb, turn your wheels:",
    ["Away from curb", "Toward curb", "Straight"],
    0,
    "Turn wheels away from curb so car rolls into curb if it moves."
  ),
  mcCard(
    "When parking downhill, turn your wheels:",
    ["Toward curb", "Away from curb", "Straight"],
    0,
    "Turn wheels toward curb so car rolls into curb if it moves."
  ),
  textCard(
    "What does a red curb mean?",
    "No stopping, standing, or parking at any time."
  ),
  textCard(
    "What does a yellow curb mean?",
    "Loading zone - stop only to load/unload passengers or freight."
  ),
  textCard(
    "What does a blue curb mean?",
    "Handicapped parking only - requires valid placard or license plate."
  ),

  // Alcohol and Drugs
  mcCard(
    "What is the legal blood alcohol limit for drivers 21+?",
    ["0.08%", "0.05%", "0.10%"],
    0,
    "The legal limit is 0.08% BAC for drivers 21 and older."
  ),
  mcCard(
    "What is the legal BAC limit for drivers under 21?",
    ["0.00-0.02% (zero tolerance)", "0.05%", "0.08%"],
    0,
    "Most states have zero tolerance - any alcohol is illegal for under 21."
  ),
  mcCard(
    "What is implied consent?",
    ["By driving, you agree to chemical testing if arrested for DUI", "You must consent to vehicle searches", "You must identify yourself"],
    0,
    "By driving, you've agreed to BAC testing if lawfully arrested for suspected DUI."
  ),
  textCard(
    "What is the penalty for refusing a BAC test?",
    "Automatic license suspension, often longer than a DUI conviction."
  ),
  mcCard(
    "How does alcohol affect driving?",
    ["Impairs judgment, reaction time, and coordination", "Only affects reaction time", "No effect below legal limit"],
    0,
    "Alcohol impairs all driving abilities even below the legal limit."
  ),

  // Safe Following
  mcCard(
    "The recommended following distance in good conditions is:",
    ["3-4 seconds", "1 car length", "1-2 seconds"],
    0,
    "Maintain at least 3-4 seconds following distance."
  ),
  mcCard(
    "In poor conditions, following distance should be:",
    ["6+ seconds", "3 seconds", "Same as normal"],
    0,
    "Double or triple your following distance in rain, fog, or snow."
  ),
  textCard(
    "How do you measure following distance?",
    "Pick a fixed point, when the car ahead passes it, count seconds until you reach it."
  ),

  // Emergencies
  mcCard(
    "If your brakes fail, you should:",
    ["Pump brakes, use parking brake, shift to lower gear", "Turn off engine immediately", "Jump out of vehicle"],
    0,
    "Pump brakes rapidly, apply parking brake gradually, downshift."
  ),
  mcCard(
    "If your tire blows out, you should:",
    ["Hold steering firmly, ease off gas, brake gently when slowed", "Brake hard immediately", "Accelerate out of it"],
    0,
    "Keep control with steering, slow gradually, don't slam brakes."
  ),
  mcCard(
    "If your car starts to skid, you should:",
    ["Steer in the direction you want to go", "Brake hard", "Steer opposite to the skid"],
    0,
    "Look and steer where you want to go - your hands follow your eyes."
  ),
  textCard(
    "What should you do if your accelerator sticks?",
    "Shift to neutral, apply brakes, focus on steering, pull over safely."
  ),
  mcCard(
    "When approaching emergency vehicles with flashing lights, you must:",
    ["Move right and stop", "Speed up to pass", "Continue normally"],
    0,
    "Pull to the right and stop until emergency vehicle passes."
  ),
  textCard(
    "What is the 'Move Over' law?",
    "When passing stopped emergency or work vehicles with flashing lights, move over one lane if possible, or slow down significantly."
  ),

  // Railroad Crossings
  mcCard(
    "When must you stop at a railroad crossing?",
    ["When signals are flashing or gates are down", "Always", "Only if train is visible"],
    0,
    "Stop when signals flash, gates are down, or a train is approaching."
  ),
  mcCard(
    "How far from railroad tracks should you stop?",
    ["15-50 feet", "5 feet", "100 feet"],
    0,
    "Stop between 15 and 50 feet from the nearest rail."
  ),
  textCard(
    "What should you never do at a railroad crossing?",
    "Never stop on the tracks, never try to beat a train, never go around lowered gates."
  ),

  // School Buses
  mcCard(
    "When must you stop for a school bus?",
    ["When red lights flash and stop sign is out", "Only if children are visible", "Only on 2-lane roads"],
    0,
    "Stop when red lights flash - traffic in BOTH directions must stop on undivided roads."
  ),
  mcCard(
    "When can you pass a stopped school bus loading children?",
    ["When separated by a physical barrier/median", "When the road is clear", "After honking"],
    0,
    "Only pass if separated by a physical median or barrier."
  ),

  // Sharing the Road
  textCard(
    "What should you watch for when near parked cars?",
    "Car doors opening, pedestrians stepping out, cars pulling out."
  ),
  mcCard(
    "How should you interact with motorcycles?",
    ["Give them full lane, don't share lanes", "They can share your lane", "Flash lights to warn them"],
    0,
    "Motorcycles are entitled to a full lane - never share their space."
  ),
  textCard(
    "What are large truck blind spots?",
    "Large areas where the driver can't see you - directly behind, beside the cab, and right side especially. If you can't see their mirrors, they can't see you."
  ),
  mcCard(
    "When driving near large trucks, you should:",
    ["Avoid blind spots, pass quickly, give them room", "Tailgate to draft", "Flash lights frequently"],
    0,
    "Stay visible, pass promptly, give extra stopping distance."
  ),

  // Night Driving
  mcCard(
    "When should you use low beam headlights instead of high beams?",
    ["Within 500 feet of oncoming traffic or 300 feet when following", "Only in fog", "Never use low beams at night"],
    0,
    "Dim lights when approaching or following other vehicles."
  ),
  mcCard(
    "If blinded by oncoming headlights, you should:",
    ["Look toward right edge of road", "Flash your high beams", "Stare at the lights"],
    0,
    "Look to the right side of the road to avoid being blinded."
  ),
  textCard(
    "What increases risk when driving at night?",
    "Reduced visibility, fatigue, more impaired drivers, harder to judge speed/distance."
  ),

  // Weather Conditions
  mcCard(
    "What is hydroplaning?",
    ["Tires losing contact with road due to water", "Engine flooding", "Brake failure in rain"],
    0,
    "Hydroplaning occurs when water builds up faster than tires can scatter it."
  ),
  textCard(
    "What should you do if you start to hydroplane?",
    "Ease off the gas, don't brake hard, steer straight, wait for tires to grip."
  ),
  mcCard(
    "When driving in fog, use:",
    ["Low beam headlights", "High beam headlights", "Parking lights only"],
    0,
    "Use low beams - high beams reflect off fog and reduce visibility."
  ),
  textCard(
    "What is black ice?",
    "Thin, transparent ice that's hard to see. Common on bridges, overpasses, and shaded areas."
  ),

  // Documents and Insurance
  mcCard(
    "What documents must you carry while driving?",
    ["License, registration, and proof of insurance", "License only", "Insurance only"],
    0,
    "Always carry your driver's license, vehicle registration, and insurance proof."
  ),
  textCard(
    "What happens if you're caught driving without insurance?",
    "Fines, license suspension, vehicle impoundment, and possible criminal charges."
  ),

  // Misc Rules
  mcCard(
    "When must children be in car seats or boosters?",
    ["Based on age, height, and weight per state law", "Only under age 2", "Only on highways"],
    0,
    "Laws vary by state but generally require car seats for young children and boosters until 4'9\" tall."
  ),
  textCard(
    "Is it legal to use a cell phone while driving?",
    "Many states ban handheld use. Texting while driving is illegal in most states."
  ),
  mcCard(
    "When must you use your turn signal?",
    ["At least 100 feet before turning", "Only when other cars are visible", "Optional"],
    0,
    "Signal at least 100 feet before turning or changing lanes."
  ),
]);
