import { createDeck, textCard, mcCard, SeedDeck } from "./types";

export const australianDriversLicense: SeedDeck = createDeck(
  "a1b2c3d4-1111-4000-8000-000000000001",
  "Australian Driver's License Test",
  "Prepare for your Australian learner's permit and driver's license test. Covers road rules, traffic signs, speed limits, alcohol limits, and safe driving practices for all Australian states and territories.",
  ["driving", "car-license", "learners-permit", "licensing", "australia"],
  [
  // Blood Alcohol & Drug Rules
  mcCard(
    "What is the blood alcohol limit for L and P plate drivers?",
    ["0.00", "0.02", "0.05"],
    0,
    { explanation: "Learner and Provisional drivers must have zero blood alcohol concentration.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/driver-and-rider-licences/offences-and-penalties/drink-driving" }
  ),
  mcCard(
    "What is the blood alcohol limit for full license holders?",
    ["0.05", "0.08", "0.02"],
    0,
    { explanation: "Full license holders can have up to 0.05 BAC, but zero is safest.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/driver-and-rider-licences/offences-and-penalties/drink-driving" }
  ),
  mcCard(
    "What is the penalty for drink driving on a P plate?",
    ["Immediate license suspension", "Warning only", "Fine only"],
    0,
    { explanation: "P platers face immediate suspension and other penalties for any alcohol detection.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/driver-and-rider-licences/offences-and-penalties/drink-driving" }
  ),
  textCard(
    "Can you refuse a breath test?",
    "No. Refusing a breath test is an offence with severe penalties, often treated as seriously as a high-range drink driving offence.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/driver-and-rider-licences/offences-and-penalties/drink-driving" }
  ),

  // Speed Limits
  mcCard(
    "What is the default speed limit in a built-up/residential area?",
    ["50 km/h", "60 km/h", "40 km/h"],
    0,
    { explanation: "Unless otherwise signed, the default urban speed limit is 50 km/h.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/speed-limits/speed-limits-in-nsw" }
  ),
  mcCard(
    "What is the speed limit in a school zone during school hours?",
    ["40 km/h", "50 km/h", "30 km/h"],
    0,
    { explanation: "School zones are 40 km/h during displayed hours.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/speed-limits/school-zones" }
  ),
  mcCard(
    "What is the default speed limit on roads outside built-up areas?",
    ["100 km/h", "80 km/h", "110 km/h"],
    0,
    { explanation: "The default rural speed limit is 100 km/h unless otherwise signed.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/speed-limits/speed-limits-in-nsw" }
  ),
  textCard(
    "What does a speed limit sign with 'END' mean?",
    "The special speed zone has ended and the default speed limit for that type of road applies.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/speed-limits/speed-limits-in-nsw" }
  ),
  mcCard(
    "In shared zones (pedestrian areas), what is the speed limit?",
    ["10 km/h", "20 km/h", "40 km/h"],
    0,
    { explanation: "Shared zones have a 10 km/h limit where pedestrians and vehicles share the space.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/speed-limits/speed-limits-in-nsw" }
  ),

  // Roundabouts
  mcCard(
    "When approaching a roundabout, you must give way to:",
    ["Vehicles already in the roundabout", "Vehicles on your left", "Vehicles on your right"],
    0,
    { explanation: "Always give way to any vehicle already in the roundabout.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/intersections/roundabouts" }
  ),
  mcCard(
    "When turning right at a roundabout, which lane should you use?",
    ["Right lane", "Left lane", "Any lane"],
    0,
    { explanation: "Use the right lane when turning right, and signal right on approach.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/intersections/roundabouts" }
  ),
  mcCard(
    "When going straight through a roundabout, which lane can you use?",
    ["Either lane (unless marked)", "Left lane only", "Right lane only"],
    0,
    { explanation: "You can use either lane to go straight unless road markings indicate otherwise.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/intersections/roundabouts" }
  ),
  textCard(
    "When do you signal left at a roundabout?",
    "Signal left when exiting the roundabout (as you pass the exit before yours).",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/intersections/roundabouts" }
  ),
  mcCard(
    "When turning left at a roundabout, which lane should you use?",
    ["Left lane", "Right lane", "Either lane"],
    0,
    { explanation: "Use the left lane and signal left on approach when turning left.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/intersections/roundabouts" }
  ),

  // Give Way Rules
  mcCard(
    "At an uncontrolled intersection (no signs or lights), who gives way?",
    ["Give way to your right", "Give way to your left", "First to arrive goes first"],
    0,
    { explanation: "At unmarked intersections, give way to vehicles approaching from your right.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/intersections/giving-way" }
  ),
  mcCard(
    "When turning left, you must give way to:",
    ["Pedestrians crossing the road you're turning into", "No one if turning left", "Only cyclists"],
    0,
    { explanation: "You must give way to pedestrians crossing the road you're entering.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/intersections/giving-way" }
  ),
  mcCard(
    "When turning right at an intersection, you must give way to:",
    ["Oncoming vehicles going straight or turning left", "All vehicles", "No one"],
    0,
    { explanation: "When turning right, give way to oncoming traffic going straight or left.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/intersections/giving-way" }
  ),
  textCard(
    "What does a Give Way sign require?",
    "Slow down, prepare to stop if necessary, and give way to all vehicles and pedestrians.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/intersections/giving-way" }
  ),
  textCard(
    "What does a Stop sign require?",
    "Come to a complete stop, give way to all vehicles and pedestrians, then proceed when safe.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/intersections/giving-way" }
  ),

  // Traffic Lights
  mcCard(
    "What does a yellow traffic light mean?",
    ["Stop unless unsafe to do so", "Speed up to get through", "Proceed with caution"],
    0,
    { explanation: "Yellow means stop unless you're so close that stopping suddenly would be dangerous.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/intersections/traffic-lights" }
  ),
  mcCard(
    "What does a flashing yellow light mean?",
    ["Proceed with caution", "Stop completely", "Give way to the right"],
    0,
    { explanation: "Flashing yellow means slow down and proceed with caution.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/intersections/traffic-lights" }
  ),
  mcCard(
    "When can you turn left on a red light?",
    ["Only if there's a sign permitting it", "Never", "Always if clear"],
    0,
    { explanation: "Only when a sign specifically permits 'Left turn on red permitted after stopping'.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/intersections/traffic-lights" }
  ),
  textCard(
    "What does a red arrow mean?",
    "You cannot turn in the direction of the arrow until it changes to green.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/intersections/traffic-lights" }
  ),
  mcCard(
    "At traffic lights, a green arrow means:",
    ["You may turn in that direction", "Give way then turn", "Stop and wait"],
    0,
    { explanation: "A green arrow means you can proceed in that direction - oncoming traffic has a red.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/intersections/traffic-lights" }
  ),

  // Lane Rules
  mcCard(
    "When can you cross an unbroken (continuous) white line?",
    ["To enter/exit a driveway or avoid obstruction", "To overtake", "Never"],
    0,
    { explanation: "Only to enter/exit driveways, side streets, or avoid an obstruction - never to overtake.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/road-markings/lane-markings" }
  ),
  textCard(
    "What does a broken white line mean?",
    "You may cross to overtake or change lanes if safe to do so.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/road-markings/lane-markings" }
  ),
  mcCard(
    "What do double unbroken lines mean?",
    ["Do not cross or drive on them", "OK to cross if safe", "Overtaking permitted"],
    0,
    { explanation: "You must not cross double unbroken lines for any reason except emergency.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/road-markings/lane-markings" }
  ),
  textCard(
    "What does a single unbroken line next to a broken line mean?",
    "You may cross if the broken line is on your side; you cannot cross if the unbroken line is on your side.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/road-markings/lane-markings" }
  ),

  // Parking Rules
  mcCard(
    "How far must you park from a fire hydrant?",
    ["1 metre", "3 metres", "5 metres"],
    0,
    { explanation: "Park at least 1 metre from a fire hydrant.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/stopping-and-parking" }
  ),
  mcCard(
    "How far must you park from an intersection without traffic lights?",
    ["10 metres", "5 metres", "20 metres"],
    0,
    { explanation: "Park at least 10 metres from an intersection without traffic lights.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/stopping-and-parking" }
  ),
  mcCard(
    "How far must you park from a bus stop?",
    ["20 metres", "10 metres", "5 metres"],
    0,
    { explanation: "Park at least 20 metres from a bus stop.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/stopping-and-parking" }
  ),
  textCard(
    "Can you park on a footpath?",
    "No. Parking on footpaths, nature strips, or median strips is not permitted.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/stopping-and-parking" }
  ),
  mcCard(
    "When parking on a hill facing uphill with a kerb, your wheels should:",
    ["Turn away from kerb", "Turn toward kerb", "Stay straight"],
    0,
    { explanation: "Turn wheels away from the kerb so if the car rolls, it rolls into the kerb.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/stopping-and-parking" }
  ),
  mcCard(
    "When parking on a hill facing downhill, your wheels should:",
    ["Turn toward kerb", "Turn away from kerb", "Stay straight"],
    0,
    { explanation: "Turn wheels toward the kerb so if the car rolls, it rolls into the kerb.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/stopping-and-parking" }
  ),

  // Pedestrian Crossings
  mcCard(
    "At a pedestrian crossing, you must:",
    ["Give way to pedestrians on or about to step onto the crossing", "Honk to warn pedestrians", "Only stop if pedestrians are in your lane"],
    0,
    { explanation: "Give way to all pedestrians on the crossing or about to step onto it.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/sharing-road/pedestrians" }
  ),
  textCard(
    "What is a children's crossing?",
    "A crossing with flags or lights operated by a school crossing supervisor - you must stop when flags are displayed.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/sharing-road/pedestrians" }
  ),
  mcCard(
    "At a pedestrian crossing with flashing yellow lights, you must:",
    ["Give way to pedestrians", "Proceed as normal", "Stop completely then proceed"],
    0,
    { explanation: "Give way to any pedestrians on or entering the crossing.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/sharing-road/pedestrians" }
  ),

  // Emergency Vehicles
  mcCard(
    "When an emergency vehicle approaches with sirens/lights, you should:",
    ["Move left and stop if safe", "Speed up to clear the road", "Stop immediately wherever you are"],
    0,
    { explanation: "Move to the left side of the road and stop if safe to let them pass.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/sharing-road/emergency-vehicles" }
  ),
  textCard(
    "What should you do if an emergency vehicle is behind you at traffic lights?",
    "Don't go through the red light. Move left when safe after the light turns green.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/sharing-road/emergency-vehicles" }
  ),

  // Following Distance
  textCard(
    "What is the 3-second rule?",
    "Maintain at least 3 seconds of following distance from the vehicle ahead in normal conditions.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/safe-driving/following-distance" }
  ),
  mcCard(
    "In wet conditions, your following distance should be:",
    ["At least doubled (6+ seconds)", "The same as dry", "Slightly increased"],
    0,
    { explanation: "Double your following distance in wet conditions due to longer stopping distances.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/safe-driving/following-distance" }
  ),

  // U-Turns
  mcCard(
    "When is a U-turn NOT permitted?",
    ["At traffic lights unless signed", "On any road", "Only on highways"],
    0,
    { explanation: "U-turns are not permitted at traffic lights unless a sign specifically allows it.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/turning-changing-lanes/u-turns" }
  ),
  textCard(
    "What must you check before making a U-turn?",
    "Check for signs prohibiting U-turns, ensure you have clear visibility, and give way to all vehicles and pedestrians.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/turning-changing-lanes/u-turns" }
  ),

  // Headlights
  mcCard(
    "When must you use headlights?",
    ["From sunset to sunrise and in poor visibility", "Only at night", "Only in rain"],
    0,
    { explanation: "Use headlights from sunset to sunrise and whenever visibility is reduced.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/safe-driving/lights" }
  ),
  mcCard(
    "When must you dip your headlights?",
    ["When following or approaching another vehicle", "Never", "Only on highways"],
    0,
    { explanation: "Dip headlights within 200m of an oncoming vehicle or when following another vehicle.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/safe-driving/lights" }
  ),
  textCard(
    "What lights should you use in fog?",
    "Low beam headlights. High beam reflects off fog and reduces visibility.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/safe-driving/lights" }
  ),

  // Towing
  mcCard(
    "What is the maximum speed when towing a trailer?",
    ["80 km/h unless signed lower", "100 km/h", "60 km/h"],
    0,
    { explanation: "Maximum 80 km/h when towing unless a lower limit is posted.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/towing" }
  ),
  textCard(
    "When must a trailer have its own brakes?",
    "When the trailer's loaded weight exceeds 750kg.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/towing" }
  ),

  // Demerit Points
  mcCard(
    "How many demerit points before a full license is suspended?",
    ["13 points in 3 years", "12 points in 3 years", "10 points in 3 years"],
    0,
    { explanation: "Accumulating 13+ points in 3 years results in license suspension.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/driver-and-rider-licences/offences-and-penalties/demerit-points" }
  ),
  mcCard(
    "How many demerit points for P1 license holders before suspension?",
    ["4 points", "7 points", "13 points"],
    0,
    { explanation: "P1 provisional license holders are suspended at 4 points.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/driver-and-rider-licences/offences-and-penalties/demerit-points" }
  ),

  // Seatbelts
  mcCard(
    "Who is responsible for ensuring passengers under 16 wear seatbelts?",
    ["The driver", "The passenger", "The parents"],
    0,
    { explanation: "The driver is legally responsible for passengers under 16 wearing seatbelts.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/road-safety/seatbelts" }
  ),
  textCard(
    "What is the fine for not wearing a seatbelt?",
    "Heavy fines and demerit points - specific amounts vary by state but are substantial.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/road-safety/seatbelts" }
  ),

  // Mobile Phones
  mcCard(
    "Can L or P plate drivers use a mobile phone while driving?",
    ["No, not even hands-free", "Yes, if hands-free", "Yes, for navigation only"],
    0,
    { explanation: "L and P platers cannot use phones at all while driving, even hands-free or for navigation.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/road-safety/mobile-phones" }
  ),
  mcCard(
    "Can full license holders use a hands-free mobile phone?",
    ["Yes, but not handheld", "No phone use at all", "Yes, including handheld"],
    0,
    { explanation: "Full license holders may use hands-free only - never hold the phone.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/road-safety/mobile-phones" }
  ),

  // Motorcycles and Bicycles
  textCard(
    "How much space must you leave when overtaking a bicycle?",
    "At least 1 metre in zones up to 60 km/h, and 1.5 metres in zones over 60 km/h.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/sharing-road/bicycle-riders" }
  ),
  mcCard(
    "Can motorcycles use bus lanes?",
    ["Yes, in most states", "No, never", "Only during peak hours"],
    0,
    { explanation: "In most Australian states, motorcycles can use bus lanes.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/bus-and-transit-lanes" }
  ),

  // Level Crossings
  mcCard(
    "At a railway crossing with flashing lights, you must:",
    ["Stop and wait until lights stop flashing", "Proceed if no train is visible", "Slow down and proceed carefully"],
    0,
    { explanation: "Always stop and wait until the lights stop flashing and booms are fully raised.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/railway-crossings" }
  ),
  textCard(
    "What should you do at a railway crossing with a stop sign but no boom gates?",
    "Stop completely, look both ways for trains, then proceed when safe.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/railway-crossings" }
  ),

  // Fatigue
  textCard(
    "What are the signs of driver fatigue?",
    "Yawning, heavy eyelids, difficulty concentrating, wandering thoughts, slower reactions, drifting in lane.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/road-safety/fatigue" }
  ),
  mcCard(
    "What is the best way to combat driver fatigue?",
    ["Stop and take a 15-20 minute power nap", "Turn up the radio", "Open the window"],
    0,
    { explanation: "The only effective solution is to stop driving and rest. Other methods don't work.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/road-safety/fatigue" }
  ),

  // Wet Weather
  mcCard(
    "What is aquaplaning?",
    ["Tyres losing contact with road due to water", "Driving through puddles", "Using windscreen wipers"],
    0,
    { explanation: "Aquaplaning occurs when tyres skim on water rather than gripping the road.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/safe-driving/driving-wet-weather" }
  ),
  textCard(
    "What should you do if your car starts to aquaplane?",
    "Ease off the accelerator, don't brake suddenly, hold steering wheel firmly and straight until tyres grip again.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/safe-driving/driving-wet-weather" }
  ),

  // Stopping Distances
  mcCard(
    "At 60 km/h, what is the approximate total stopping distance?",
    ["45 metres", "20 metres", "100 metres"],
    0,
    { explanation: "At 60 km/h, total stopping distance is about 45 metres (reaction + braking).", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/safe-driving/stopping-distances" }
  ),
  textCard(
    "What factors affect stopping distance?",
    "Speed, road conditions, tyre condition, brake condition, driver reaction time, weather, vehicle weight.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/safe-driving/stopping-distances" }
  ),

  // Drugs and Driving
  mcCard(
    "Is it illegal to drive with any illicit drugs in your system?",
    ["Yes", "Only if impaired", "Only above certain limits"],
    0,
    { explanation: "Any presence of illicit drugs while driving is illegal, regardless of impairment.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/driver-and-rider-licences/offences-and-penalties/drug-driving" }
  ),
  textCard(
    "Can prescription medication affect your ability to drive?",
    "Yes. Some prescription and over-the-counter medications can impair driving. Always check labels and ask your doctor.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/driver-and-rider-licences/offences-and-penalties/drug-driving" }
  ),

  // Accidents
  textCard(
    "What must you do if involved in an accident with injury?",
    "Stop, help injured persons, call emergency services (000), exchange details, report to police.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/what-to-do-after-crash" }
  ),
  mcCard(
    "If you damage an unattended vehicle, you must:",
    ["Leave your details and report to police", "Wait until owner returns", "Only report if damage is major"],
    0,
    { explanation: "Leave your name and address on the vehicle and report to police within 24 hours.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/what-to-do-after-crash" }
  ),

  // Probationary/Provisional Rules
  mcCard(
    "Can P1 drivers carry more than one passenger aged 16-22 between 11pm-5am?",
    ["No (in most states)", "Yes, up to 3", "Yes, any number"],
    0,
    { explanation: "Most states restrict P1 drivers from carrying multiple young passengers late at night.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/driver-and-rider-licences/driver-licences/provisional-licences/provisional-p1-licence" }
  ),
  textCard(
    "Can P plate drivers tow trailers?",
    "Restrictions vary by state - many prohibit towing for P1 drivers. Check your state's rules.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/driver-and-rider-licences/driver-licences/provisional-licences/provisional-p1-licence" }
  ),

  // Signs
  textCard(
    "What does a red circle with a white bar mean?",
    "No entry for vehicles.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/traffic-signs" }
  ),
  textCard(
    "What does a yellow diamond sign indicate?",
    "Warning sign - alerts drivers to a potential hazard ahead.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/traffic-signs" }
  ),
  mcCard(
    "What does a green sign typically indicate?",
    ["Direction/distance information", "Warning", "Regulatory rule"],
    0,
    { explanation: "Green signs are information signs showing directions, distances, and places.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/traffic-signs" }
  ),
  textCard(
    "What does a blue sign typically indicate?",
    "Services and facilities (rest areas, hospitals, fuel, etc.).",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/traffic-signs" }
  ),

  // Safe Driving
  textCard(
    "What is the safest gap to accept when turning across traffic?",
    "At least 6 seconds gap in traffic - if in doubt, wait for a larger gap.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/turning-changing-lanes" }
  ),
  mcCard(
    "Where should you look while driving?",
    ["Well ahead, checking mirrors regularly", "Only at the car in front", "Only at road markings"],
    0,
    { explanation: "Look well ahead to anticipate hazards, and check mirrors every 5-8 seconds.", researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/safe-driving" }
  ),
  textCard(
    "What is a blindspot and how do you check it?",
    "Areas not visible in mirrors (beside and behind). Check by briefly turning your head before changing lanes.",
    { researchUrl: "https://www.nsw.gov.au/driving-boating-and-transport/roads-safety-and-rules/safe-driving" }
  ),
]);
