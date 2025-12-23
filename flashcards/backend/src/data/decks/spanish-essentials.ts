import { createDeck, mcCard, SeedDeck } from "./types";

export const spanishEssentials: SeedDeck = createDeck(
  "Spanish - Essential Phrases",
  "Learn essential Spanish phrases for travel and everyday conversation. Covers greetings, polite expressions, numbers, days of the week, common verbs, restaurant vocabulary, directions, and emergency phrases.",
  ["languages", "spanish"],
  [
  // Greetings
  mcCard(
    "How do you say 'Hello' in Spanish?",
    ["Hola", "Adiós", "Gracias"],
    0,
    { explanation: "Hola is the universal Spanish greeting for hello.", researchUrl: "https://www.spanishdict.com/translate/hola" }
  ),
  mcCard(
    "How do you say 'Good morning' in Spanish?",
    ["Buenos días", "Buenas noches", "Buenas tardes"],
    0,
    { explanation: "Buenos días literally means 'good days' and is used in the morning." }
  ),
  mcCard(
    "How do you say 'Good afternoon' in Spanish?",
    ["Buenas tardes", "Buenos días", "Buenas noches"],
    0,
    { explanation: "Buenas tardes is used from noon until evening." }
  ),
  mcCard(
    "How do you say 'Goodbye' in Spanish?",
    ["Adiós", "Hola", "Por favor"],
    0,
    { explanation: "Adiós is the standard farewell in Spanish." }
  ),
  mcCard(
    "How do you say 'See you later' in Spanish?",
    ["Hasta luego", "Hasta mañana", "Adiós"],
    0,
    { explanation: "Hasta luego means 'until later' - a casual goodbye." }
  ),
  mcCard(
    "How do you say 'How are you?' (informal) in Spanish?",
    ["¿Cómo estás?", "¿Cómo está usted?", "¿Qué hora es?"],
    0,
    { explanation: "¿Cómo estás? uses the informal 'tú' form for friends and peers." }
  ),
  mcCard(
    "What does 'Mucho gusto' mean?",
    ["Nice to meet you", "Thank you", "Goodbye"],
    0,
    { explanation: "Mucho gusto literally means 'much pleasure' - used when meeting someone." }
  ),

  // Politeness
  mcCard(
    "How do you say 'Please' in Spanish?",
    ["Por favor", "Gracias", "De nada"],
    0,
    { explanation: "Por favor is used to make polite requests." }
  ),
  mcCard(
    "How do you say 'Thank you' in Spanish?",
    ["Gracias", "Por favor", "Lo siento"],
    0,
    { explanation: "Gracias is the standard way to express gratitude." }
  ),
  mcCard(
    "What does 'De nada' mean?",
    ["You're welcome", "Thank you", "Please"],
    0,
    { explanation: "De nada literally means 'of nothing' - the standard response to 'gracias'." }
  ),
  mcCard(
    "How do you say 'I'm sorry' in Spanish?",
    ["Lo siento", "Con permiso", "Disculpe"],
    0,
    { explanation: "Lo siento expresses apology - it literally means 'I feel it'." }
  ),
  mcCard(
    "What does 'Con permiso' mean?",
    ["Excuse me (to pass by)", "I'm sorry", "Please"],
    0,
    { explanation: "Con permiso is used when you need to pass by someone." }
  ),

  // Basic Questions
  mcCard(
    "How do you ask 'Where is...?' in Spanish?",
    ["¿Dónde está...?", "¿Qué es esto?", "¿Cuánto cuesta?"],
    0,
    { explanation: "¿Dónde está...? is essential for asking for directions." }
  ),
  mcCard(
    "How do you ask 'How much does it cost?' in Spanish?",
    ["¿Cuánto cuesta?", "¿Qué hora es?", "¿Dónde está?"],
    0,
    { explanation: "¿Cuánto cuesta? is essential for shopping." }
  ),
  mcCard(
    "How do you say 'I don't understand' in Spanish?",
    ["No entiendo", "No hay problema", "Lo siento"],
    0,
    { explanation: "No entiendo is crucial when learning - don't be afraid to use it!" }
  ),
  mcCard(
    "How do you ask 'Where is the bathroom?' in Spanish?",
    ["¿Dónde está el baño?", "¿Cuánto cuesta?", "¿Qué hora es?"],
    0,
    { explanation: "El baño means 'the bathroom' - an essential phrase for travelers!" }
  ),

  // Numbers
  mcCard(
    "What is 'one' in Spanish?",
    ["Uno", "Dos", "Tres"],
    0,
    { explanation: "Uno is the number one. It shortens to 'un' before masculine nouns." }
  ),
  mcCard(
    "What is 'five' in Spanish?",
    ["Cinco", "Cuatro", "Seis"],
    0,
    { explanation: "Cinco is the number five." }
  ),
  mcCard(
    "What is 'ten' in Spanish?",
    ["Diez", "Nueve", "Ocho"],
    0,
    { explanation: "Diez is the number ten." }
  ),
  mcCard(
    "What is 'twenty' in Spanish?",
    ["Veinte", "Treinta", "Diez"],
    0,
    { explanation: "Veinte is the number twenty." }
  ),
  mcCard(
    "What is 'one hundred' in Spanish?",
    ["Cien", "Mil", "Cincuenta"],
    0,
    { explanation: "Cien is one hundred exactly. Ciento is used for 101-199." }
  ),

  // Days of the Week
  mcCard(
    "What is 'Monday' in Spanish?",
    ["Lunes", "Martes", "Domingo"],
    0,
    { explanation: "Lunes comes from 'luna' (moon) - Moon day." }
  ),
  mcCard(
    "What is 'Friday' in Spanish?",
    ["Viernes", "Jueves", "Sábado"],
    0,
    { explanation: "Viernes comes from Venus - Venus day." }
  ),
  mcCard(
    "What is 'Sunday' in Spanish?",
    ["Domingo", "Sábado", "Lunes"],
    0,
    { explanation: "Domingo means 'Lord's day'." }
  ),

  // Common Verbs
  mcCard(
    "What is the Spanish verb 'to be' (permanent characteristics)?",
    ["Ser", "Estar", "Tener"],
    0,
    { explanation: "Ser is for permanent states, nationality, profession. Estar is for temporary states." }
  ),
  mcCard(
    "What is the Spanish verb 'to have'?",
    ["Tener", "Ser", "Ir"],
    0,
    { explanation: "Tener means 'to have' and is used in many idiomatic expressions." }
  ),
  mcCard(
    "What is the Spanish verb 'to go'?",
    ["Ir", "Venir", "Estar"],
    0,
    { explanation: "Ir is an irregular verb meaning 'to go'." }
  ),
  mcCard(
    "What is the Spanish verb 'to eat'?",
    ["Comer", "Beber", "Hablar"],
    0,
    { explanation: "Comer is a regular -er verb meaning 'to eat'." }
  ),
  mcCard(
    "What is the Spanish verb 'to speak'?",
    ["Hablar", "Escuchar", "Entender"],
    0,
    { explanation: "Hablar is a regular -ar verb meaning 'to speak'." }
  ),

  // Restaurant/Food
  mcCard(
    "How do you say 'The menu, please' in Spanish?",
    ["El menú, por favor", "La cuenta, por favor", "Agua, por favor"],
    0,
    { explanation: "Essential phrase when dining out in Spanish-speaking countries." }
  ),
  mcCard(
    "How do you say 'The bill, please' in Spanish?",
    ["La cuenta, por favor", "El menú, por favor", "Más agua, por favor"],
    0,
    { explanation: "La cuenta means 'the bill' or 'the check'." }
  ),
  mcCard(
    "What is 'water' in Spanish?",
    ["Agua", "Vino", "Cerveza"],
    0,
    { explanation: "Agua is feminine but uses 'el' (el agua) because it starts with stressed 'a'." }
  ),
  mcCard(
    "What is 'coffee' in Spanish?",
    ["Café", "Té", "Leche"],
    0,
    { explanation: "Café means both coffee and café (coffee shop)." }
  ),
  mcCard(
    "What is 'breakfast' in Spanish?",
    ["Desayuno", "Almuerzo", "Cena"],
    0,
    { explanation: "Desayuno literally means 'breaking the fast'." }
  ),
  mcCard(
    "What is 'dinner' in Spanish?",
    ["Cena", "Almuerzo", "Desayuno"],
    0,
    { explanation: "Cena is the evening meal." }
  ),

  // Directions
  mcCard(
    "What is 'left' in Spanish?",
    ["Izquierda", "Derecha", "Recto"],
    0,
    { explanation: "Izquierda means left. Use 'a la izquierda' for 'to the left'." }
  ),
  mcCard(
    "What is 'right' in Spanish?",
    ["Derecha", "Izquierda", "Cerca"],
    0,
    { explanation: "Derecha means right. Use 'a la derecha' for 'to the right'." }
  ),
  mcCard(
    "What is 'straight ahead' in Spanish?",
    ["Recto / Derecho", "Izquierda", "Lejos"],
    0,
    { explanation: "Both 'recto' and 'derecho' can mean straight ahead." }
  ),
  mcCard(
    "What does 'cerca' mean?",
    ["Near", "Far", "Here"],
    0,
    { explanation: "Cerca means near. 'Cerca de' means 'near to'." }
  ),

  // Emergencies
  mcCard(
    "How do you say 'Help!' in Spanish?",
    ["¡Ayuda!", "¡Fuego!", "¡Alto!"],
    0,
    { explanation: "¡Ayuda! is the cry for help in emergency situations." }
  ),
  mcCard(
    "How do you say 'I need a doctor' in Spanish?",
    ["Necesito un médico", "Llame a la policía", "Estoy perdido"],
    0,
    { explanation: "Essential emergency phrase for medical situations." }
  ),
  mcCard(
    "How do you say 'Call the police' in Spanish?",
    ["Llame a la policía", "Necesito un médico", "¡Ayuda!"],
    0,
    { explanation: "Use formal 'llame' (usted form) in emergencies." }
  ),
  mcCard(
    "How do you say 'I'm lost' in Spanish?",
    ["Estoy perdido(a)", "Necesito ayuda", "No entiendo"],
    0,
    { explanation: "Use perdido for masculine, perdida for feminine." }
  ),

  // Travel
  mcCard(
    "What is 'airport' in Spanish?",
    ["Aeropuerto", "Estación", "Hotel"],
    0,
    { explanation: "Aeropuerto is derived from 'aero' (air) and 'puerto' (port)." }
  ),
  mcCard(
    "What is 'train station' in Spanish?",
    ["Estación de tren", "Aeropuerto", "Estación de autobús"],
    0,
    { explanation: "Estación means station. Tren means train." }
  ),
  mcCard(
    "What is 'ticket' in Spanish?",
    ["Boleto / Billete", "Pasaporte", "Maleta"],
    0,
    { explanation: "Boleto is used in Latin America, billete in Spain." }
  ),
  mcCard(
    "What does 'ida y vuelta' mean?",
    ["Round-trip", "One-way", "First class"],
    0,
    { explanation: "Ida y vuelta literally means 'go and return'." }
  ),
]);
