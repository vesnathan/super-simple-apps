import { LocalStorageWarning } from "@super-simple-apps/shared-assets";

export function LocalDeckWarning() {
  return (
    <LocalStorageWarning message="This deck is stored locally in your browser. If you clear your browser cache it will be lost. Sign in to save it permanently." />
  );
}
