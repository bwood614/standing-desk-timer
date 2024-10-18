export type TabMessage =
  | {
      id: 'tab_status_changed';
      payload?: {
        isActive: boolean;
      };
    }
  | {
      id: 'global_timer_update';
      payload?: {
        timerStartTime: number;
      };
    };

export type SetWidgetStateMessage =
  | {
      key: 'timerStartTime';
      value: number;
      notifyActiveTabs?: boolean;
    }
  | {
      key: 'isWidgetExpanded';
      value: boolean;
      notifyActiveTabs?: boolean;
    }
  | {
      key: 'isStanding';
      value: boolean;
      notifyActiveTabs?: boolean;
    }
  | {
      key: 'audibleAlarmTabId';
      value: boolean;
      notifyActiveTabs?: boolean;
    };

export type GetWidgetStateMessage =
  | 'timerStartTime'
  | 'isWidgetExpanded'
  | 'isStanding'
  | 'audibleAlarmTabId';
