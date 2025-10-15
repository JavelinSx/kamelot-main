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
  monday: ScheduleSession[];
  tuesday: ScheduleSession[];
  wednesday: ScheduleSession[];
  thursday: ScheduleSession[];
  friday: ScheduleSession[];
  saturday: ScheduleSession[];
  sunday: ScheduleSession[];
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
  const scheduleData = useState<ScheduleData | null>("schedule", () => null);
  const loading = useState<boolean>("schedule-loading", () => false);
  const error = useState<Error | null>("schedule-error", () => null);

  const fetchSchedule = async () => {
    if (scheduleData.value) return scheduleData.value;

    loading.value = true;
    error.value = null;

    try {
      const config = useRuntimeConfig();
      const baseUrl = config.public.storageUrl || "";
      const url = baseUrl
        ? `${baseUrl}/data/schedule.json`
        : "/data/schedule.json";

      const response = await $fetch<ScheduleData>(url);
      scheduleData.value = response;
      return response;
    } catch (err) {
      error.value = err as Error;
      console.error("Error fetching schedule:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

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
      Object.values(zone.schedule).forEach((daySessions: ScheduleSession[]) => {
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
    loading: readonly(loading),
    error: readonly(error),
    fetchSchedule,
    getZoneByName,
    getScheduleByDay,
    getCurrentDaySchedule,
    getSessionsByTrainer,
  };
};
