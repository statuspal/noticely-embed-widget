import { render } from 'preact';
import Widget from './widget';

const NOTICELY_WIDGET_CONTAINER_ID = 'noticely-widget-container';

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

    // Destroy existing widget first
    window.NoticelyWidget.destroy();

    // Check if widget is enabled (default true)
    if (window.NoticelyWidgetConfig.enabled === false) return;

    // Find existing container or create new one
    let container = document.getElementById(NOTICELY_WIDGET_CONTAINER_ID);
    if (!container) {
      container = document.createElement('div');
      container.id = NOTICELY_WIDGET_CONTAINER_ID;
      document.body.appendChild(container);
    }

    // Render the widget into the container
    render(<Widget {...window.NoticelyWidgetConfig} />, container);
  },
  destroy: (): void => {
    // Find and remove the widget container
    const container = document.getElementById(NOTICELY_WIDGET_CONTAINER_ID);
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
