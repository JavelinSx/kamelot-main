import scheduleDataJson from '~/public/data/schedule.json'

export type AgeCategory = 'kid' | 'teen' | 'adult';

export interface ScheduleSession {
  id: number;
  time: string;
  discipline: string;
  ageGroup: string;
  trainer: string;
  level: string;
  ageCategory: AgeCategory; // kid (до 14), teen (14-17), adult (18+)
}

export interface DaySchedule {
  monday: readonly ScheduleSession[];
  tuesday: readonly ScheduleSession[];
  wednesday: readonly ScheduleSession[];
  thursday: readonly ScheduleSession[];
  friday: readonly ScheduleSession[];
  saturday: readonly ScheduleSession[];
  sunday: readonly ScheduleSession[];
}

export interface Zone {
  id: number;
  name: string;
  description: string;
  schedule: DaySchedule;
}

export interface ScheduleData {
  zones: Zone[];
  metadata: {
    lastUpdated: string;
    version: string;
    notes: string;
  };
}

export const useSchedule = () => {
  // Импортируем данные напрямую из JSON - они будут встроены в билд
  const scheduleData = ref<ScheduleData>(scheduleDataJson as ScheduleData);

  const getZoneByName = (zoneName: string) => {
    return scheduleData.value?.zones.find((zone) =>
      zone.name.toLowerCase().includes(zoneName.toLowerCase())
    );
  };

  const getScheduleByDay = (zoneName: string, day: keyof DaySchedule) => {
    const zone = getZoneByName(zoneName);
    return zone?.schedule[day] || [];
  };

  const getCurrentDaySchedule = (zoneName: string) => {
    const days: (keyof DaySchedule)[] = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const today = new Date().getDay();
    const dayKey = days[today] as keyof DaySchedule;

    return getScheduleByDay(zoneName, dayKey);
  };

  const getSessionsByTrainer = (trainerName: string) => {
    const sessions: ScheduleSession[] = [];

    scheduleData.value?.zones.forEach((zone) => {
      Object.values(zone.schedule).forEach((daySessions: readonly ScheduleSession[]) => {
        const trainerSessions = daySessions.filter((session: ScheduleSession) =>
          session.trainer.toLowerCase().includes(trainerName.toLowerCase())
        );
        sessions.push(...trainerSessions);
      });
    });

    return sessions;
  };

  return {
    scheduleData: readonly(scheduleData),
    getZoneByName,
    getScheduleByDay,
    getCurrentDaySchedule,
    getSessionsByTrainer,
  };
};
