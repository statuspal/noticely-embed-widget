// Global types
declare interface Window {
  NoticelyWidget: {
    create: () => Promise<void>;
    destroy: () => void;
  };
  NoticelyWidgetConfig: {
    origin: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    enabled?: boolean;
    theme?: 'auto' | 'light' | 'dark';
  };
}
