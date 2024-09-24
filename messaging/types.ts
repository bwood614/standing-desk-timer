export type TabMessage =
  | {
      id: 'tab_status_changed';
      payload?: {
        isActive: boolean;
      };
    }
  | {
      id: 'widget_state_changed';
      payload?: never;
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
    };

export type GetWidgetStateMessage =
  | 'timerStartTime'
  | 'isWidgetExpanded'
  | 'isStanding';
