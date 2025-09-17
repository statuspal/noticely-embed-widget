import { render } from 'preact';
import './widget.css';

// Global types
declare global {
  interface Window {
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
}

// Main widget component - displays status information with controls
export const Widget = ({
  theme = 'light',
  position = 'bottom-right'
}: {
  theme?: string;
  position?: string;
}) => {
  return (
    <div
      className={`status-widget status-widget--${position}`}
      data-theme={theme}
    >
      {/* Widget Header with title and controls */}
      <div className="status-widget__header">
        <h3 className="status-widget__title">Status</h3>
        <button
          className="status-widget__close"
          onClick={() => window.NoticelyWidget.destroy()}
          title="Close"
          aria-label="Close widget"
        >
          ✕
        </button>
      </div>

      {/* Widget Content */}
      <div className="status-widget__content">
        <div className="status-widget__status">
          <div className="status-widget__indicator" />
          <span className="status-widget__message">
            All systems operational
          </span>
        </div>
      </div>
    </div>
  );
};

// Global API setup
window.NoticelyWidget = {
  create: (): void => {
    // Read configuration from global window object
    if (!window.NoticelyWidgetConfig) {
      console.error(
        'Noticely Widget: Configuration not found. Please provide window.NoticelyWidgetConfig with at least a subdomain property.'
      );
      return;
    }

    // Check if widget is enabled (default true)
    if (window.NoticelyWidgetConfig.enabled === false) return;

    // Destroy existing widget first
    window.NoticelyWidget.destroy();

    // Find existing container or create new one
    let container = document.getElementById('noticely-widget-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'noticely-widget-container';
      document.body.appendChild(container);
    }

    // Render the widget into the container
    render(<Widget {...window.NoticelyWidgetConfig} />, container);
  },
  destroy: (): void => {
    // Find and remove the widget container
    const container = document.getElementById('noticely-widget-container');
    if (container?.parentNode) {
      render(null, container);
      container.parentNode.removeChild(container);
    }
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', window.NoticelyWidget.create);
else window.NoticelyWidget.create();
