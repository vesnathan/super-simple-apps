import { createDeck, textCard, mcCard, SeedDeck } from "./types";

export const australianDriversLicense: SeedDeck = createDeck(
  "Australian Driver's License Test",
  "Prepare for your Australian learner's permit and driver's license test. Covers road rules, traffic signs, speed limits, alcohol limits, and safe driving practices for all Australian states and territories.",
  ["driving", "car-license", "learners-permit", "licensing", "australia"],
  [
  // Blood Alcohol & Drug Rules
  mcCard(
    "What is the blood alcohol limit for L and P plate drivers?",
    ["0.00", "0.02", "0.05"],
    0,
    "Learner and Provisional drivers must have zero blood alcohol concentration."
  ),
  mcCard(
    "What is the blood alcohol limit for full license holders?",
    ["0.05", "0.08", "0.02"],
    0,
    "Full license holders can have up to 0.05 BAC, but zero is safest."
  ),
  mcCard(
    "What is the penalty for drink driving on a P plate?",
    ["Immediate license suspension", "Warning only", "Fine only"],
    0,
    "P platers face immediate suspension and other penalties for any alcohol detection."
  ),
  textCard(
    "Can you refuse a breath test?",
    "No. Refusing a breath test is an offence with severe penalties, often treated as seriously as a high-range drink driving offence."
  ),

  // Speed Limits
  mcCard(
    "What is the default speed limit in a built-up/residential area?",
    ["50 km/h", "60 km/h", "40 km/h"],
    0,
    "Unless otherwise signed, the default urban speed limit is 50 km/h."
  ),
  mcCard(
    "What is the speed limit in a school zone during school hours?",
    ["40 km/h", "50 km/h", "30 km/h"],
    0,
    "School zones are 40 km/h during displayed hours."
  ),
  mcCard(
    "What is the default speed limit on roads outside built-up areas?",
    ["100 km/h", "80 km/h", "110 km/h"],
    0,
    "The default rural speed limit is 100 km/h unless otherwise signed."
  ),
  textCard(
    "What does a speed limit sign with 'END' mean?",
    "The special speed zone has ended and the default speed limit for that type of road applies."
  ),
  mcCard(
    "In shared zones (pedestrian areas), what is the speed limit?",
    ["10 km/h", "20 km/h", "40 km/h"],
    0,
    "Shared zones have a 10 km/h limit where pedestrians and vehicles share the space."
  ),

  // Roundabouts
  mcCard(
    "When approaching a roundabout, you must give way to:",
    ["Vehicles already in the roundabout", "Vehicles on your left", "Vehicles on your right"],
    0,
    "Always give way to any vehicle already in the roundabout."
  ),
  mcCard(
    "When turning right at a roundabout, which lane should you use?",
    ["Right lane", "Left lane", "Any lane"],
    0,
    "Use the right lane when turning right, and signal right on approach."
  ),
  mcCard(
    "When going straight through a roundabout, which lane can you use?",
    ["Either lane (unless marked)", "Left lane only", "Right lane only"],
    0,
    "You can use either lane to go straight unless road markings indicate otherwise."
  ),
  textCard(
    "When do you signal left at a roundabout?",
    "Signal left when exiting the roundabout (as you pass the exit before yours)."
  ),
  mcCard(
    "When turning left at a roundabout, which lane should you use?",
    ["Left lane", "Right lane", "Either lane"],
    0,
    "Use the left lane and signal left on approach when turning left."
  ),

  // Give Way Rules
  mcCard(
    "At an uncontrolled intersection (no signs or lights), who gives way?",
    ["Give way to your right", "Give way to your left", "First to arrive goes first"],
    0,
    "At unmarked intersections, give way to vehicles approaching from your right."
  ),
  mcCard(
    "When turning left, you must give way to:",
    ["Pedestrians crossing the road you're turning into", "No one if turning left", "Only cyclists"],
    0,
    "You must give way to pedestrians crossing the road you're entering."
  ),
  mcCard(
    "When turning right at an intersection, you must give way to:",
    ["Oncoming vehicles going straight or turning left", "All vehicles", "No one"],
    0,
    "When turning right, give way to oncoming traffic going straight or left."
  ),
  textCard(
    "What does a Give Way sign require?",
    "Slow down, prepare to stop if necessary, and give way to all vehicles and pedestrians."
  ),
  textCard(
    "What does a Stop sign require?",
    "Come to a complete stop, give way to all vehicles and pedestrians, then proceed when safe."
  ),

  // Traffic Lights
  mcCard(
    "What does a yellow traffic light mean?",
    ["Stop unless unsafe to do so", "Speed up to get through", "Proceed with caution"],
    0,
    "Yellow means stop unless you're so close that stopping suddenly would be dangerous."
  ),
  mcCard(
    "What does a flashing yellow light mean?",
    ["Proceed with caution", "Stop completely", "Give way to the right"],
    0,
    "Flashing yellow means slow down and proceed with caution."
  ),
  mcCard(
    "When can you turn left on a red light?",
    ["Only if there's a sign permitting it", "Never", "Always if clear"],
    0,
    "Only when a sign specifically permits 'Left turn on red permitted after stopping'."
  ),
  textCard(
    "What does a red arrow mean?",
    "You cannot turn in the direction of the arrow until it changes to green."
  ),
  mcCard(
    "At traffic lights, a green arrow means:",
    ["You may turn in that direction", "Give way then turn", "Stop and wait"],
    0,
    "A green arrow means you can proceed in that direction - oncoming traffic has a red."
  ),

  // Lane Rules
  mcCard(
    "When can you cross an unbroken (continuous) white line?",
    ["To enter/exit a driveway or avoid obstruction", "To overtake", "Never"],
    0,
    "Only to enter/exit driveways, side streets, or avoid an obstruction - never to overtake."
  ),
  textCard(
    "What does a broken white line mean?",
    "You may cross to overtake or change lanes if safe to do so."
  ),
  mcCard(
    "What do double unbroken lines mean?",
    ["Do not cross or drive on them", "OK to cross if safe", "Overtaking permitted"],
    0,
    "You must not cross double unbroken lines for any reason except emergency."
  ),
  textCard(
    "What does a single unbroken line next to a broken line mean?",
    "You may cross if the broken line is on your side; you cannot cross if the unbroken line is on your side."
  ),

  // Parking Rules
  mcCard(
    "How far must you park from a fire hydrant?",
    ["1 metre", "3 metres", "5 metres"],
    0,
    "Park at least 1 metre from a fire hydrant."
  ),
  mcCard(
    "How far must you park from an intersection without traffic lights?",
    ["10 metres", "5 metres", "20 metres"],
    0,
    "Park at least 10 metres from an intersection without traffic lights."
  ),
  mcCard(
    "How far must you park from a bus stop?",
    ["20 metres", "10 metres", "5 metres"],
    0,
    "Park at least 20 metres from a bus stop."
  ),
  textCard(
    "Can you park on a footpath?",
    "No. Parking on footpaths, nature strips, or median strips is not permitted."
  ),
  mcCard(
    "When parking on a hill facing uphill with a kerb, your wheels should:",
    ["Turn away from kerb", "Turn toward kerb", "Stay straight"],
    0,
    "Turn wheels away from the kerb so if the car rolls, it rolls into the kerb."
  ),
  mcCard(
    "When parking on a hill facing downhill, your wheels should:",
    ["Turn toward kerb", "Turn away from kerb", "Stay straight"],
    0,
    "Turn wheels toward the kerb so if the car rolls, it rolls into the kerb."
  ),

  // Pedestrian Crossings
  mcCard(
    "At a pedestrian crossing, you must:",
    ["Give way to pedestrians on or about to step onto the crossing", "Honk to warn pedestrians", "Only stop if pedestrians are in your lane"],
    0,
    "Give way to all pedestrians on the crossing or about to step onto it."
  ),
  textCard(
    "What is a children's crossing?",
    "A crossing with flags or lights operated by a school crossing supervisor - you must stop when flags are displayed."
  ),
  mcCard(
    "At a pedestrian crossing with flashing yellow lights, you must:",
    ["Give way to pedestrians", "Proceed as normal", "Stop completely then proceed"],
    0,
    "Give way to any pedestrians on or entering the crossing."
  ),

  // Emergency Vehicles
  mcCard(
    "When an emergency vehicle approaches with sirens/lights, you should:",
    ["Move left and stop if safe", "Speed up to clear the road", "Stop immediately wherever you are"],
    0,
    "Move to the left side of the road and stop if safe to let them pass."
  ),
  textCard(
    "What should you do if an emergency vehicle is behind you at traffic lights?",
    "Don't go through the red light. Move left when safe after the light turns green."
  ),

  // Following Distance
  textCard(
    "What is the 3-second rule?",
    "Maintain at least 3 seconds of following distance from the vehicle ahead in normal conditions."
  ),
  mcCard(
    "In wet conditions, your following distance should be:",
    ["At least doubled (6+ seconds)", "The same as dry", "Slightly increased"],
    0,
    "Double your following distance in wet conditions due to longer stopping distances."
  ),

  // U-Turns
  mcCard(
    "When is a U-turn NOT permitted?",
    ["At traffic lights unless signed", "On any road", "Only on highways"],
    0,
    "U-turns are not permitted at traffic lights unless a sign specifically allows it."
  ),
  textCard(
    "What must you check before making a U-turn?",
    "Check for signs prohibiting U-turns, ensure you have clear visibility, and give way to all vehicles and pedestrians."
  ),

  // Headlights
  mcCard(
    "When must you use headlights?",
    ["From sunset to sunrise and in poor visibility", "Only at night", "Only in rain"],
    0,
    "Use headlights from sunset to sunrise and whenever visibility is reduced."
  ),
  mcCard(
    "When must you dip your headlights?",
    ["When following or approaching another vehicle", "Never", "Only on highways"],
    0,
    "Dip headlights within 200m of an oncoming vehicle or when following another vehicle."
  ),
  textCard(
    "What lights should you use in fog?",
    "Low beam headlights. High beam reflects off fog and reduces visibility."
  ),

  // Towing
  mcCard(
    "What is the maximum speed when towing a trailer?",
    ["80 km/h unless signed lower", "100 km/h", "60 km/h"],
    0,
    "Maximum 80 km/h when towing unless a lower limit is posted."
  ),
  textCard(
    "When must a trailer have its own brakes?",
    "When the trailer's loaded weight exceeds 750kg."
  ),

  // Demerit Points
  mcCard(
    "How many demerit points before a full license is suspended?",
    ["13 points in 3 years", "12 points in 3 years", "10 points in 3 years"],
    0,
    "Accumulating 13+ points in 3 years results in license suspension."
  ),
  mcCard(
    "How many demerit points for P1 license holders before suspension?",
    ["4 points", "7 points", "13 points"],
    0,
    "P1 provisional license holders are suspended at 4 points."
  ),

  // Seatbelts
  mcCard(
    "Who is responsible for ensuring passengers under 16 wear seatbelts?",
    ["The driver", "The passenger", "The parents"],
    0,
    "The driver is legally responsible for passengers under 16 wearing seatbelts."
  ),
  textCard(
    "What is the fine for not wearing a seatbelt?",
    "Heavy fines and demerit points - specific amounts vary by state but are substantial."
  ),

  // Mobile Phones
  mcCard(
    "Can L or P plate drivers use a mobile phone while driving?",
    ["No, not even hands-free", "Yes, if hands-free", "Yes, for navigation only"],
    0,
    "L and P platers cannot use phones at all while driving, even hands-free or for navigation."
  ),
  mcCard(
    "Can full license holders use a hands-free mobile phone?",
    ["Yes, but not handheld", "No phone use at all", "Yes, including handheld"],
    0,
    "Full license holders may use hands-free only - never hold the phone."
  ),

  // Motorcycles and Bicycles
  textCard(
    "How much space must you leave when overtaking a bicycle?",
    "At least 1 metre in zones up to 60 km/h, and 1.5 metres in zones over 60 km/h."
  ),
  mcCard(
    "Can motorcycles use bus lanes?",
    ["Yes, in most states", "No, never", "Only during peak hours"],
    0,
    "In most Australian states, motorcycles can use bus lanes."
  ),

  // Level Crossings
  mcCard(
    "At a railway crossing with flashing lights, you must:",
    ["Stop and wait until lights stop flashing", "Proceed if no train is visible", "Slow down and proceed carefully"],
    0,
    "Always stop and wait until the lights stop flashing and booms are fully raised."
  ),
  textCard(
    "What should you do at a railway crossing with a stop sign but no boom gates?",
    "Stop completely, look both ways for trains, then proceed when safe."
  ),

  // Fatigue
  textCard(
    "What are the signs of driver fatigue?",
    "Yawning, heavy eyelids, difficulty concentrating, wandering thoughts, slower reactions, drifting in lane."
  ),
  mcCard(
    "What is the best way to combat driver fatigue?",
    ["Stop and take a 15-20 minute power nap", "Turn up the radio", "Open the window"],
    0,
    "The only effective solution is to stop driving and rest. Other methods don't work."
  ),

  // Wet Weather
  mcCard(
    "What is aquaplaning?",
    ["Tyres losing contact with road due to water", "Driving through puddles", "Using windscreen wipers"],
    0,
    "Aquaplaning occurs when tyres skim on water rather than gripping the road."
  ),
  textCard(
    "What should you do if your car starts to aquaplane?",
    "Ease off the accelerator, don't brake suddenly, hold steering wheel firmly and straight until tyres grip again."
  ),

  // Stopping Distances
  mcCard(
    "At 60 km/h, what is the approximate total stopping distance?",
    ["45 metres", "20 metres", "100 metres"],
    0,
    "At 60 km/h, total stopping distance is about 45 metres (reaction + braking)."
  ),
  textCard(
    "What factors affect stopping distance?",
    "Speed, road conditions, tyre condition, brake condition, driver reaction time, weather, vehicle weight."
  ),

  // Drugs and Driving
  mcCard(
    "Is it illegal to drive with any illicit drugs in your system?",
    ["Yes", "Only if impaired", "Only above certain limits"],
    0,
    "Any presence of illicit drugs while driving is illegal, regardless of impairment."
  ),
  textCard(
    "Can prescription medication affect your ability to drive?",
    "Yes. Some prescription and over-the-counter medications can impair driving. Always check labels and ask your doctor."
  ),

  // Accidents
  textCard(
    "What must you do if involved in an accident with injury?",
    "Stop, help injured persons, call emergency services (000), exchange details, report to police."
  ),
  mcCard(
    "If you damage an unattended vehicle, you must:",
    ["Leave your details and report to police", "Wait until owner returns", "Only report if damage is major"],
    0,
    "Leave your name and address on the vehicle and report to police within 24 hours."
  ),

  // Probationary/Provisional Rules
  mcCard(
    "Can P1 drivers carry more than one passenger aged 16-22 between 11pm-5am?",
    ["No (in most states)", "Yes, up to 3", "Yes, any number"],
    0,
    "Most states restrict P1 drivers from carrying multiple young passengers late at night."
  ),
  textCard(
    "Can P plate drivers tow trailers?",
    "Restrictions vary by state - many prohibit towing for P1 drivers. Check your state's rules."
  ),

  // Signs
  textCard(
    "What does a red circle with a white bar mean?",
    "No entry for vehicles."
  ),
  textCard(
    "What does a yellow diamond sign indicate?",
    "Warning sign - alerts drivers to a potential hazard ahead."
  ),
  mcCard(
    "What does a green sign typically indicate?",
    ["Direction/distance information", "Warning", "Regulatory rule"],
    0,
    "Green signs are information signs showing directions, distances, and places."
  ),
  textCard(
    "What does a blue sign typically indicate?",
    "Services and facilities (rest areas, hospitals, fuel, etc.)."
  ),

  // Safe Driving
  textCard(
    "What is the safest gap to accept when turning across traffic?",
    "At least 6 seconds gap in traffic - if in doubt, wait for a larger gap."
  ),
  mcCard(
    "Where should you look while driving?",
    ["Well ahead, checking mirrors regularly", "Only at the car in front", "Only at road markings"],
    0,
    "Look well ahead to anticipate hazards, and check mirrors every 5-8 seconds."
  ),
  textCard(
    "What is a blindspot and how do you check it?",
    "Areas not visible in mirrors (beside and behind). Check by briefly turning your head before changing lanes."
  ),
]);
