export async function getPitchModeEnabled(): Promise<boolean> {
  try {
    const response = await fetch('/api/slots');
    const data = await response.json();
    return data.pitch_mode_enabled || false;
  } catch {
    return false;
  }
}

export function isPitchModeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_PITCH_MODE_ENABLED === 'true';
}