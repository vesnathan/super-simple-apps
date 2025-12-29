import { createDeck, textCard, mcCard, SeedDeck } from "./types";

export const forkliftSafety: SeedDeck = createDeck(
  "a1b2c3d4-1111-4000-8000-000000000006",
  "Forklift Operator Safety",
  "Essential safety training for forklift operators. Covers pre-operation inspections, load handling, traveling safely, pedestrian awareness, and OSHA-compliant operating procedures.",
  ["workplace-safety", "forklift", "osha", "certification"],
  [
  // Pre-Operation
  mcCard(
    "Before operating a forklift, you must:",
    ["Complete a pre-operation inspection", "Just start and go if it worked yesterday", "Only check the fuel"],
    0,
    "Daily pre-operation inspections are required before each shift."
  ),
  textCard(
    "What should be checked during a pre-operation inspection?",
    "Brakes, steering, controls, warning devices, lights, horn, forks, tires, mast, fluid levels, seatbelt, overhead guard."
  ),
  mcCard(
    "If you find a problem during pre-op inspection, you should:",
    ["Report it and don't operate until fixed", "Use it anyway if it still moves", "Fix it yourself"],
    0,
    "Never operate a forklift with known defects - report and tag out."
  ),
  mcCard(
    "Who is allowed to operate a forklift?",
    ["Only trained and certified operators", "Anyone who has driven a car", "Any warehouse employee"],
    0,
    "Only operators who have completed proper training and certification."
  ),
  textCard(
    "How often must forklift operators be re-evaluated?",
    "At least every 3 years, or sooner if there's an accident, near-miss, or unsafe behavior observed."
  ),

  // Load Handling
  mcCard(
    "When traveling with a load, the forks should be:",
    ["Tilted back and low to the ground", "Level and high for visibility", "Tilted forward"],
    0,
    "Tilting back stabilizes the load; keeping low improves stability and visibility."
  ),
  mcCard(
    "How high should forks be when traveling?",
    ["4-6 inches off the ground", "At eye level", "Touching the ground"],
    0,
    "Keep forks 4-6 inches off the ground to clear obstacles while maintaining stability."
  ),
  textCard(
    "What is the load capacity of a forklift determined by?",
    "The data plate - shows max capacity at a specific load center. Never exceed rated capacity."
  ),
  mcCard(
    "What is a load center?",
    ["Distance from fork face to load's center of gravity", "The middle of the warehouse", "The forklift's balance point"],
    0,
    "Standard load center is 24 inches. Capacity decreases as load center increases."
  ),
  mcCard(
    "If a load is too heavy, you should:",
    ["Get a higher capacity forklift or split the load", "Try to lift it anyway", "Add counterweight to the forklift"],
    0,
    "Never exceed capacity - use appropriate equipment or reduce load."
  ),
  mcCard(
    "Before lifting a load, you should:",
    ["Check weight, size, stability, and ensure forks are fully under the load", "Just grab it quickly", "Honk the horn first"],
    0,
    "Assess the load and ensure proper fork placement before lifting."
  ),
  textCard(
    "What should you do if a load starts to tip?",
    "Stay in the seat with seatbelt on - do not jump. Brace yourself and let the forklift tip rather than being crushed."
  ),

  // Travel and Maneuvering
  mcCard(
    "When should you sound the horn?",
    ["At intersections, blind corners, and near pedestrians", "Only in emergencies", "Never indoors"],
    0,
    "Sound the horn to alert others of your presence at hazardous locations."
  ),
  mcCard(
    "What is the safe following distance?",
    ["At least 3 forklift lengths", "1 forklift length", "Right behind them"],
    0,
    "Keep at least 3 lengths behind other forklifts or vehicles."
  ),
  mcCard(
    "When driving on a ramp with a load, you should:",
    ["Drive forward going up, reverse going down", "Always drive forward", "Always reverse"],
    0,
    "Keep the load uphill for stability - forward up, reverse down."
  ),
  mcCard(
    "When driving on a ramp without a load, you should:",
    ["Drive forward going down, reverse going up", "Always drive forward", "Avoid ramps completely"],
    0,
    "Without a load, the forks should point downhill."
  ),
  mcCard(
    "The maximum safe speed on a forklift is typically:",
    ["5 mph in work areas, slower when conditions require", "As fast as possible", "Whatever feels comfortable"],
    0,
    "Speed limits are set by the workplace - typically 5 mph or less."
  ),
  mcCard(
    "When turning, you should:",
    ["Slow down and turn smoothly", "Maintain speed", "Turn sharply to save time"],
    0,
    "Reduce speed before turning to prevent tip-overs."
  ),
  textCard(
    "Why is rear-end steering important to understand?",
    "Forklifts steer from the rear, causing the back end to swing wide. Watch for pedestrians and obstacles."
  ),
  mcCard(
    "If your vision is blocked by a load, you should:",
    ["Travel in reverse", "Honk constantly", "Get a spotter"],
    0,
    "When load blocks forward vision, travel in reverse or use a spotter."
  ),

  // Stability
  mcCard(
    "What is the stability triangle?",
    ["Area between front wheels and rear pivot for balance", "Warning triangle for parking", "Dashboard display"],
    0,
    "The stability triangle determines the forklift's center of gravity limits."
  ),
  mcCard(
    "What causes a forklift to tip forward?",
    ["Load too heavy, too far forward, or stopping too fast", "Driving too slow", "Empty forks"],
    0,
    "Forward tip-overs occur when center of gravity moves ahead of front axle."
  ),
  mcCard(
    "What causes a forklift to tip sideways?",
    ["Turning too fast, uneven ground, or unbalanced loads", "Driving straight", "Moving slowly"],
    0,
    "Lateral tip-overs are often caused by excessive speed while turning."
  ),
  textCard(
    "How does raising the load affect stability?",
    "Raising the load raises the center of gravity, making the forklift less stable. Only raise loads for stacking/placement."
  ),
  mcCard(
    "When should you raise the mast to full height?",
    ["Only when placing or retrieving loads at height", "When traveling", "Never"],
    0,
    "Only raise high enough to clear racking when stacking."
  ),

  // Pedestrians and Environment
  mcCard(
    "How should you interact with pedestrians?",
    ["Yield to them, make eye contact, don't assume they see you", "They should yield to you", "Honk to make them move"],
    0,
    "Pedestrians always have the right of way - stop and wait for them."
  ),
  mcCard(
    "Can pedestrians walk under raised forks or loads?",
    ["Never", "If the operator says it's OK", "Only briefly"],
    0,
    "Never allow anyone under raised forks or loads."
  ),
  mcCard(
    "What should you do when approaching a blind corner?",
    ["Slow down, honk horn, and approach cautiously", "Speed through to clear it quickly", "Stop completely"],
    0,
    "Sound horn, slow down, and look before proceeding."
  ),
  textCard(
    "What are the dangers of working on docks?",
    "Trailer separation, uneven surfaces, edge of dock, unsecured trailers. Always chock wheels and use dock locks."
  ),
  mcCard(
    "Before entering a trailer, you must ensure:",
    ["Trailer is chocked, brakes set, and dock lock engaged", "Driver is waiting in cab", "Nothing - just drive in"],
    0,
    "Secure the trailer to prevent movement while loading/unloading."
  ),

  // Refueling
  mcCard(
    "When refueling a propane forklift, you should:",
    ["Turn off engine, do it outdoors, wear gloves", "Leave engine running", "Do it anywhere convenient"],
    0,
    "Refuel outdoors, engine off, no smoking, wear protective equipment."
  ),
  mcCard(
    "When charging an electric forklift battery, you should:",
    ["Do it in a designated area with proper ventilation", "Anywhere with power", "Keep forklift running"],
    0,
    "Batteries emit hydrogen gas - charge in ventilated areas only."
  ),
  textCard(
    "What PPE is required when handling batteries?",
    "Safety glasses, face shield, rubber gloves, and apron. Battery acid is corrosive."
  ),

  // Parking and Shutdown
  mcCard(
    "When parking a forklift, you should:",
    ["Lower forks flat, engage brake, turn off, remove key", "Leave forks raised", "Leave engine running"],
    0,
    "Proper parking prevents accidents and unauthorized use."
  ),
  textCard(
    "Where should you park a forklift?",
    "In designated areas, away from traffic, never blocking exits, fire equipment, or electrical panels."
  ),
  mcCard(
    "Before leaving the operator's seat, you must:",
    ["Lower forks, set brake, turn off", "Nothing if just stepping away briefly", "Only set the brake"],
    0,
    "Always secure the forklift before leaving, even momentarily."
  ),

  // Attachments
  textCard(
    "What do you need before using a forklift attachment?",
    "Training on the specific attachment, updated capacity plate, and proper inspection of the attachment."
  ),
  mcCard(
    "How do attachments affect capacity?",
    ["Usually reduce capacity", "Increase capacity", "No effect"],
    0,
    "Most attachments add weight and change load center, reducing capacity."
  ),

  // Emergency Situations
  textCard(
    "What should you do if the forklift catches fire?",
    "If safe, park and shut off. Evacuate and call emergency services. Use fire extinguisher only if trained and safe."
  ),
  mcCard(
    "If you hit a storage rack, you should:",
    ["Stop, report it, don't operate until rack is inspected", "Keep working if no product fell", "Move product away quickly"],
    0,
    "Damaged racks can collapse - report immediately for inspection."
  ),
  textCard(
    "What is the proper response to a tip-over?",
    "Stay in the seat, grip steering wheel, brace feet, lean away from impact. Never jump."
  ),

  // Additional Safety
  mcCard(
    "Can passengers ride on a forklift?",
    ["Never", "Only if there's a proper seat", "Only for short distances"],
    0,
    "No passengers allowed - only the operator in the designated seat."
  ),
  mcCard(
    "What should you wear while operating a forklift?",
    ["Steel-toed boots, high-visibility vest, seatbelt", "Sandals are fine if comfortable", "No requirements"],
    0,
    "Proper PPE is required - steel-toed boots, high-vis, hard hat if required by site."
  ),
  textCard(
    "Why is it dangerous to drive with wet or oily hands?",
    "Wet or oily hands can slip on controls, causing loss of control. Always have dry, clean hands."
  ),
  mcCard(
    "What should you do if you don't understand an instruction?",
    ["Ask for clarification before proceeding", "Do your best to figure it out", "Ignore unclear instructions"],
    0,
    "Never operate without fully understanding instructions - ask questions."
  ),
],
  { researchUrl: "https://www.osha.gov/powered-industrial-trucks" }
);
