import './main.css';
import { render } from 'preact';
import { StatusResponse } from 'types/general';
import Banner from './banner';
import Badge from './badge';
import testResponse from './test-response';

export const NOTICELY_BANNER_CONTAINER_ID = 'noticely-banner-container';
export const NOTICELY_BANNER_LOCAL_STORAGE_KEY = 'noticely-viewed-notices';

// Global API setup
window.NoticelyWidget = {
  create: async (): Promise<void> => {
    // Read configuration from global window object
    const config = window.NoticelyWidget.getConfig();

    if (!config.origin) {
      console.error(
        'Noticely Widget: Configuration not found. Please provide `window.NoticelyWidgetConfig` object with at least a `origin` property.'
      );
      return;
    }

    // Destroy existing widget first
    window.NoticelyWidget.destroy();

    // Check if widget is enabled (default true)
    if (!config.globalEnabled) return;

    let data: StatusResponse;
    try {
      const response = await fetch(`${config.origin}/api/v1/status`);
      data = await response.json();
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        console.error(error);
        return;
      }

      data = testResponse;
    }

    if (config.banner.enabled) {
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
      render(<Banner data={data} config={config} />, container);
    }

    if (config.badge.enabled) {
      const badgeElements = document.querySelectorAll(config.badge.selector);

      if (!badgeElements.length) {
        console.error(
          `Noticely Widget: No elements found for badge selector "${config.badge.selector}".`
        );
        return;
      }

      badgeElements.forEach(badgeElement =>
        render(
          <Badge
            data={data}
            config={config}
            element={badgeElement as HTMLElement}
          />,
          badgeElement
        )
      );
    }
  },
  destroy: (options = {}): void => {
    const config = window.NoticelyWidget.getConfig();

    // Find and remove the banner container
    const container = document.getElementById(NOTICELY_BANNER_CONTAINER_ID);
    if (container?.parentNode) {
      render(null, container);
      container.parentNode.removeChild(container);
    }

    if (options.onlyBanner) return;

    document
      .querySelectorAll(config.badge.selector)
      .forEach(element => render(null, element));
  },
  getConfig: (): ReturnType<typeof window.NoticelyWidget.getConfig> => {
    const {
      origin,
      enabled: defaultEnabled = true,
      theme: defaultTheme = 'auto',
      banner = {},
      badge = {}
    } = window.NoticelyWidgetConfig || {};
    const {
      position: bannerPosition = 'bottom-right',
      theme: bannerTheme = defaultTheme,
      enabled: bannerEnabled = defaultEnabled
    } = banner;
    const {
      placement: badgePlacement = 'right',
      theme: badgeTheme = defaultTheme,
      enabled: badgeEnabled = false,
      selector: badgeSelector = '.noticely-badge-container'
    } = badge;

    return {
      origin,
      globalEnabled: bannerEnabled || badgeEnabled,
      banner: {
        position: bannerPosition,
        theme: bannerTheme,
        enabled: bannerEnabled
      },
      badge: {
        placement: badgePlacement,
        theme: badgeTheme,
        enabled: badgeEnabled,
        selector: badgeSelector
      }
    };
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', window.NoticelyWidget.create);
else window.NoticelyWidget.create();
