export interface AppConfig {
  sittingTimeLimit?: number;
  standingTimeLimit?: number;
}

export const defaultAppConfig: AppConfig = {
  sittingTimeLimit: 30 * 60 * 1000,
  standingTimeLimit: 30 * 60 * 1000
};
