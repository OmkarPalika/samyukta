/**
 * Determines whether to show pitch mode dialog or direct pitch dialog
 * based on registration count threshold
 */
export function shouldShowPitchModeDialog(totalRegistrations: number): boolean {
  return totalRegistrations >= 350;
}