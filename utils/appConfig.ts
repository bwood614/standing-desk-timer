export interface AppConfig {
  sittingTimeLimit?: number;
  standingTimeLimit?: number;
}

export const defaultAppConfig: AppConfig = {
  sittingTimeLimit: 30,
  standingTimeLimit: 30
};
