import { render } from 'preact';
import { StatusResponse } from 'types/general';
import Banner from './banner';
import testResponse from './test-response';

export const NOTICELY_BANNER_CONTAINER_ID = 'noticely-banner-container';
export const NOTICELY_BANNER_LOCAL_STORAGE_KEY = 'noticely-viewed-notices';

// Global API setup
window.NoticelyWidget = {
  create: async (): Promise<void> => {
    // Read configuration from global window object
    if (
      !window.NoticelyWidgetConfig ||
      typeof window.NoticelyWidgetConfig !== 'object' ||
      !window.NoticelyWidgetConfig.origin
    ) {
      console.error(
        'Noticely Banner: Configuration not found. Please provide `window.NoticelyWidgetConfig` object with at least a `origin` property.'
      );
      return;
    }

    // Destroy existing banner first
    window.NoticelyWidget.destroy();

    // Check if banner is enabled (default true)
    if (
      'enabled' in window.NoticelyWidgetConfig &&
      !window.NoticelyWidgetConfig.enabled
    )
      return;

    let data: StatusResponse;
    try {
      const response = await fetch(
        `${window.NoticelyWidgetConfig.origin}/api/v1/status`
      );
      data = await response.json();
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        console.error(error);
        return;
      }

      data = testResponse;
    }

    const viewedNoticeIds = JSON.parse(
      localStorage.getItem(NOTICELY_BANNER_LOCAL_STORAGE_KEY) || '[]'
    );
    data.ongoing_notices = data.ongoing_notices.filter(
      notice => !viewedNoticeIds.includes(notice.id)
    );
    if (!data.ongoing_notices.length) return;

    // Find existing container or create new one
    let container = document.getElementById(NOTICELY_BANNER_CONTAINER_ID);
    if (!container) {
      container = document.createElement('div');
      container.id = NOTICELY_BANNER_CONTAINER_ID;
      document.body.appendChild(container);
    }

    // Render the banner into the container
    render(<Banner {...data} />, container);
  },
  destroy: (): void => {
    // Find and remove the banner container
    const container = document.getElementById(NOTICELY_BANNER_CONTAINER_ID);
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
