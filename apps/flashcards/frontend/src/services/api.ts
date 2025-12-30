// Re-export from domain modules for backwards compatibility
// Prefer importing directly from @/services/deck or @/services/report

export { deckService } from "./deck";
export { reportService, type Report } from "./report";
