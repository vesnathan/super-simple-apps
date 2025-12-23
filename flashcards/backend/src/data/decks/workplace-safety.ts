import { createDeck, textCard, mcCard, SeedDeck } from "./types";

export const workplaceSafety: SeedDeck = createDeck(
  "Workplace Safety (WHS/OSHA)",
  "Learn essential workplace health and safety principles. Covers hazard identification, PPE requirements, emergency procedures, ergonomics, and compliance with WHS/OSHA regulations.",
  ["workplace-safety", "osha", "whs", "certification"],
  [
  // General Safety Principles
  mcCard(
    "Who is responsible for workplace safety?",
    ["Everyone - employers and employees", "Only the safety officer", "Only management"],
    0,
    "Safety is a shared responsibility at all levels."
  ),
  mcCard(
    "What does PPE stand for?",
    ["Personal Protective Equipment", "Primary Protection Elements", "Physical Protection Essentials"],
    0,
    "PPE includes items like gloves, safety glasses, hard hats, and hearing protection."
  ),
  textCard(
    "What is an MSDS/SDS?",
    "Material Safety Data Sheet / Safety Data Sheet - contains hazard information for chemicals including handling and emergency procedures."
  ),
  mcCard(
    "Where should SDS sheets be kept?",
    ["Easily accessible to all workers who handle chemicals", "Locked in manager's office", "Only on the company website"],
    0,
    "SDS must be readily available to anyone who may be exposed to the chemical."
  ),
  textCard(
    "What should you do if you see a safety hazard?",
    "Report it immediately to your supervisor or safety officer. If immediate danger, warn others and secure the area."
  ),

  // Hierarchy of Controls
  textCard(
    "What is the hierarchy of controls?",
    "In order of effectiveness: Elimination > Substitution > Engineering Controls > Administrative Controls > PPE."
  ),
  mcCard(
    "What is the most effective way to control a hazard?",
    ["Elimination - remove the hazard entirely", "PPE", "Warning signs"],
    0,
    "Elimination is the most effective but not always possible."
  ),
  textCard(
    "What is an engineering control?",
    "Physical changes to the workplace that isolate or remove hazards, like ventilation systems, guards, or barriers."
  ),
  textCard(
    "What is an administrative control?",
    "Changes to how work is done, like job rotation, training, work schedules, or procedures."
  ),
  mcCard(
    "Why is PPE the last resort in hazard control?",
    ["It doesn't eliminate the hazard, only reduces exposure", "It's too expensive", "Workers don't like wearing it"],
    0,
    "PPE should only be used when other controls aren't feasible."
  ),

  // Hazard Communication
  mcCard(
    "What does the GHS flame pictogram indicate?",
    ["Flammable material", "Explosive material", "Oxidizer"],
    0,
    "The flame symbol indicates flammable gases, liquids, or solids."
  ),
  mcCard(
    "What does the GHS skull and crossbones indicate?",
    ["Acute toxicity (fatal/toxic if inhaled, ingested, or absorbed)", "Corrosive material", "Health hazard"],
    0,
    "Skull and crossbones means the substance can cause death or serious harm."
  ),
  mcCard(
    "What does the GHS exclamation mark indicate?",
    ["Irritant or less severe hazards", "Acute toxicity", "Explosive"],
    0,
    "The exclamation mark indicates skin/eye irritation or other less severe hazards."
  ),
  textCard(
    "What does the GHS corrosive pictogram look like?",
    "A test tube pouring liquid onto a hand and surface - indicates corrosive to skin or metals."
  ),
  textCard(
    "What are the sections of an SDS?",
    "16 sections including: Identification, Hazards, Composition, First-aid, Fire-fighting, Handling, Exposure controls, and more."
  ),

  // Manual Handling
  mcCard(
    "How should you lift heavy objects?",
    ["Bend knees, keep back straight, lift with legs", "Bend at waist to reach the load", "Twist while lifting"],
    0,
    "Proper lifting technique prevents back injuries."
  ),
  textCard(
    "What is the NIOSH lifting equation used for?",
    "Calculating the recommended weight limit for lifting tasks based on factors like frequency, distance, and position."
  ),
  mcCard(
    "Before lifting a heavy object, you should:",
    ["Assess the load, plan the lift, clear the path", "Just grab it and lift", "Wait for someone stronger"],
    0,
    "Planning prevents injuries - know where you're going and how to get there."
  ),
  textCard(
    "What are the signs of a musculoskeletal injury?",
    "Pain, swelling, numbness, tingling, weakness, or reduced range of motion. Report symptoms early."
  ),
  mcCard(
    "When should you ask for help with a lift?",
    ["If the load is too heavy, awkward, or you're unsure", "Never - it shows weakness", "Only for very heavy objects"],
    0,
    "If in doubt, get help. There's no shame in preventing an injury."
  ),

  // Fire Safety
  mcCard(
    "What does PASS stand for in fire extinguisher use?",
    ["Pull, Aim, Squeeze, Sweep", "Push, Aim, Spray, Stop", "Pull, Activate, Spray, Secure"],
    0,
    "PASS: Pull pin, Aim at base, Squeeze handle, Sweep side to side."
  ),
  mcCard(
    "What type of fire extinguisher is safe for electrical fires?",
    ["CO2 or dry chemical (Class C)", "Water", "Foam"],
    0,
    "Never use water on electrical fires - use CO2 or dry chemical."
  ),
  mcCard(
    "What class of fire involves ordinary combustibles (wood, paper)?",
    ["Class A", "Class B", "Class C"],
    0,
    "Class A = Ash/ordinary combustibles. Use water or dry chemical."
  ),
  mcCard(
    "What class of fire involves flammable liquids?",
    ["Class B", "Class A", "Class D"],
    0,
    "Class B = Barrels/liquids. Use foam, CO2, or dry chemical."
  ),
  textCard(
    "What should you do during a fire alarm?",
    "Evacuate via nearest safe exit, don't use elevators, go to assembly point, don't re-enter until cleared."
  ),
  textCard(
    "What is a fire warden's responsibility?",
    "Assist with evacuation, check their area is clear, report to incident controller, account for personnel."
  ),

  // Electrical Safety
  mcCard(
    "What is the danger of damaged electrical cords?",
    ["Electric shock and fire hazard", "Reduced efficiency only", "No real danger if it still works"],
    0,
    "Damaged cords can cause electrocution and fires - replace immediately."
  ),
  textCard(
    "What is lockout/tagout (LOTO)?",
    "Procedure to ensure machines are properly shut off and can't be started during maintenance - locks and tags prevent accidental energization."
  ),
  mcCard(
    "Who can remove a lockout device?",
    ["Only the person who applied it", "Any authorized employee", "The supervisor"],
    0,
    "Only the person who applied the lock can remove it - ensures they're clear."
  ),
  textCard(
    "What should you do before working on electrical equipment?",
    "Verify it's de-energized, lock out and tag out, test with appropriate equipment to confirm no power."
  ),
  mcCard(
    "What causes most electrical fatalities?",
    ["Contact with overhead power lines or exposed wiring", "Lightning strikes", "Batteries"],
    0,
    "Contact with energized sources is the primary cause of electrical deaths."
  ),

  // Working at Heights
  mcCard(
    "At what height does fall protection become mandatory (OSHA)?",
    ["6 feet in general industry, 4 feet in construction", "10 feet", "Any height"],
    0,
    "Fall protection required at 6 feet general industry, 4 feet construction."
  ),
  textCard(
    "What are the types of fall protection?",
    "Guardrails, safety nets, personal fall arrest systems (harness), positioning systems, travel restraint."
  ),
  mcCard(
    "Before using a ladder, you should:",
    ["Inspect it for damage, set it on stable ground, maintain 3 points of contact", "Just climb up", "Only check if it looks old"],
    0,
    "Always inspect ladders and ensure proper setup before use."
  ),
  textCard(
    "What is the 4-to-1 rule for ladders?",
    "The base of the ladder should be 1 foot away from the wall for every 4 feet of height."
  ),
  mcCard(
    "How far should a ladder extend above the landing?",
    ["At least 3 feet (1 meter)", "1 foot", "Doesn't matter"],
    0,
    "Ladder should extend at least 3 feet above the landing for safe dismount."
  ),

  // Confined Spaces
  textCard(
    "What is a confined space?",
    "An area large enough to enter but not designed for continuous occupancy, with limited entry/exit and potential hazards."
  ),
  mcCard(
    "Before entering a confined space, you must:",
    ["Have a permit, test atmosphere, have rescue plan", "Just check if anyone else is inside", "Get a flashlight"],
    0,
    "Confined space entry requires permits, testing, and rescue procedures."
  ),
  mcCard(
    "What atmospheric hazard should be tested for in confined spaces?",
    ["Oxygen levels, flammable gases, toxic substances", "Temperature only", "Dust levels only"],
    0,
    "Test for oxygen (19.5-23.5%), LEL (<10%), and toxic gases before entry."
  ),
  textCard(
    "What is an attendant in confined space work?",
    "A trained person stationed outside who monitors entrants, maintains communication, and summons rescue if needed."
  ),

  // Emergency Procedures
  mcCard(
    "What color are emergency exit signs typically?",
    ["Green (international) or red (US)", "Blue", "Yellow"],
    0,
    "Green is international standard; red is used in some countries."
  ),
  textCard(
    "What information should be on an emergency contact list?",
    "Emergency services (000/911), poison control, company emergency contacts, first aiders, safety officer."
  ),
  mcCard(
    "How often should emergency drills be conducted?",
    ["At least annually, more often for high-risk workplaces", "Only when required by law", "Never - too disruptive"],
    0,
    "Regular drills ensure everyone knows what to do in an emergency."
  ),
  textCard(
    "What is the first priority in any emergency?",
    "Protect human life - evacuate, account for personnel, and don't re-enter danger areas."
  ),

  // Workplace Ergonomics
  textCard(
    "What is ergonomics?",
    "The science of designing workplaces to fit workers, reducing strain, fatigue, and injury risk."
  ),
  mcCard(
    "What is the proper monitor height for desk work?",
    ["Top of screen at or slightly below eye level", "As high as possible", "At desk level"],
    0,
    "Monitor should be at arm's length with top at eye level to reduce neck strain."
  ),
  textCard(
    "How often should you take breaks from computer work?",
    "Every 20-30 minutes, look away from screen. Take a longer break every hour to stand and stretch."
  ),
  mcCard(
    "What is repetitive strain injury (RSI)?",
    ["Injury from repeated movements over time", "A single traumatic injury", "A type of chemical exposure"],
    0,
    "RSI develops from repeated motions - common in keyboard/mouse work."
  ),

  // Reporting and Documentation
  mcCard(
    "When should a workplace incident be reported?",
    ["Immediately", "At the end of the shift", "Only if serious injury occurred"],
    0,
    "Report all incidents immediately, including near-misses."
  ),
  textCard(
    "What is a near-miss?",
    "An event that could have caused injury or damage but didn't. Reporting near-misses helps prevent future incidents."
  ),
  mcCard(
    "What is the purpose of incident investigation?",
    ["Find root cause and prevent recurrence", "Assign blame", "Complete paperwork"],
    0,
    "Investigation focuses on preventing future incidents, not punishment."
  ),
  textCard(
    "What is a risk assessment?",
    "Process of identifying hazards, evaluating the risk, and determining appropriate controls."
  ),
]);
