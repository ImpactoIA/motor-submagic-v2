// ==================================================================================
// 📅 HANDLER: CALENDAR GENERATOR
// ==================================================================================

import { ejecutarCalendario } from '../prompts/calendar.ts';
import { ContextoUsuario } from '../lib/types.ts';

export async function handleCalendar(
  settings: any,
  userContext: ContextoUsuario,
  openai: any
): Promise<{ result: any; tokensUsed: number }> {
  if (!settings.duration) settings.duration = 7;
  const res = await ejecutarCalendario(settings, userContext, openai);
  return { result: res.data, tokensUsed: res.tokens };
}