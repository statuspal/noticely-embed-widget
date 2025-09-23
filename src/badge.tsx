import './badge.css';
import { useEffect, useRef } from 'preact/hooks';
import { StatusResponse } from 'types/general';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import { statusColors } from './helpers';

const Badge = ({
  data: { status_page },
  config: {
    badge: { placement, theme }
  },
  element
}: {
  data: StatusResponse;
  config: ReturnType<typeof window.NoticelyWidget.getConfig>;
  element: HTMLElement;
}) => {
  const elementRef = useRef<HTMLElement>(element);

  const existingContent = elementRef.current.innerHTML;
  elementRef.current.innerHTML = '';

  useEffect(
    () => () => (elementRef.current.innerHTML = existingContent),
    [existingContent]
  );

  const getTheme = () => {
    if (theme === 'auto')
      return window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    return theme;
  };

  const tooltipText = () => {
    if (status_page.current_status.severity === 'major')
      return 'Ongoing major incident';
    if (status_page.current_status.severity === 'minor')
      return 'Ongoing minor incident';
    if (status_page.current_status.notice_type === 'incident')
      return 'Ongoing incident';
    if (status_page.current_status.notice_type === 'maintenance')
      return 'Ongoing maintenance';
    return 'All systems operational';
  };
  return (
    <Tippy
      content={tooltipText()}
      reference={elementRef}
      className="opacity-90"
      theme={getTheme()}
      placement={placement}
    >
      <div
        className="noticely-badge inline-flex items-center gap-2 bg-transparent"
        {...(theme !== 'auto' ? { 'data-theme': theme } : {})}
      >
        {/* eslint-disable react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: existingContent }} />
        <span
          className={`size-4 rounded-full relative animate-[badge-enter_0.5s_cubic-bezier(0.34,1.56,0.64,1)] ${statusColors(status_page.current_status.notice_type, status_page.current_status.severity)}`}
        >
          <span
            className={`bg-inherit rounded-full animate-ping absolute inset-0 ${status_page.current_status.severity === 'ok' ? 'opacity-30' : 'opacity-50'}`}
          />
        </span>
      </div>
    </Tippy>
  );
};

export default Badge;
