// Global types
declare interface Window {
  NoticelyWidget: {
    create: () => void;
    destroy: () => void;
  };
  NoticelyWidgetConfig?: {
    subdomain: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    enabled?: boolean;
    theme?: 'light' | 'dark';
  };
}
