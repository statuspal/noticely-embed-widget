import './banner.css';
import { StatusResponse } from 'types/general';
import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { NOTICELY_BANNER_LOCAL_STORAGE_KEY } from './main';
import ExclamationTriangleIcon from '@heroicons/react/24/solid/ExclamationTriangleIcon';
import WrenchIcon from '@heroicons/react/24/solid/WrenchIcon';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

// Main banner component - displays status information with controls
export const Banner = ({ ongoing_notices, services }: StatusResponse) => {
  const [ongoingNotices, setOngoingNotices] = useState([...ongoing_notices]);
  const [currentNotice, setCurrentNotice] = useState(ongoingNotices[0]);
  const [isClosing, setIsClosing] = useState(false);

  const bannerRef = useRef<HTMLDivElement>(null);

  const humanizedDuration = useCallback((): string => {
    const diff = dayjs.duration(dayjs().diff(dayjs(currentNotice.starts_at)));
    const parts = [];

    const formatUnit = (value: number, unit: string): string =>
      value === 1 ? `${value} ${unit}` : `${value} ${unit}s`;

    if (diff.asMinutes() < 1) {
      parts.push(formatUnit(Math.max(0, diff.seconds()), 'second'));
    } else {
      const d = diff.days(),
        h = diff.hours(),
        m = diff.minutes();
      if (d) parts.push(formatUnit(d, 'day'));
      if (h) parts.push(formatUnit(h, 'hour'));
      if (m) parts.push(formatUnit(m, 'minute'));
    }

    const duration = parts.join(' ');

    return currentNotice.notice_type === 'maintenance'
      ? `Started at: ${dayjs(currentNotice.starts_at).format('YYYY-MM-DD HH:mm')}${currentNotice.ends_at ? ` · Duration: ${duration}` : ''}`
      : `Ongoing for ${duration}`;
  }, [
    currentNotice.starts_at,
    currentNotice.ends_at,
    currentNotice.notice_type
  ]);

  const [durationLabel, setDurationLabel] = useState(humanizedDuration());

  useEffect(() => {
    const bannerElement = bannerRef.current;

    const handleAnimationEnd = () => {
      if (!isClosing) return;

      if (ongoingNotices.length === 1) {
        window.NoticelyWidget.destroy();
        return;
      }

      setOngoingNotices(prev => {
        prev.shift();
        return prev;
      });
      setIsClosing(false);
    };

    bannerElement.addEventListener('animationend', handleAnimationEnd);

    return () =>
      bannerElement.removeEventListener('animationend', handleAnimationEnd);
  }, [isClosing, ongoingNotices.length]);

  useEffect(() => {
    /* eslint-disable no-undef */
    let durationLabelInterval: NodeJS.Timeout;
    if (currentNotice.notice_type !== 'maintenance')
      durationLabelInterval = setInterval(
        () => setDurationLabel(humanizedDuration()),
        60000
      );

    return () => {
      if (durationLabelInterval) clearInterval(durationLabelInterval);
    };
  }, [currentNotice.notice_type, humanizedDuration]);

  useEffect(() => setDurationLabel(humanizedDuration()), [humanizedDuration]);

  useEffect(
    () => setCurrentNotice(ongoingNotices[0]),
    [ongoingNotices, ongoingNotices.length]
  );

  const {
    origin,
    position = 'bottom-right',
    theme = 'auto'
  } = window.NoticelyWidgetConfig;

  // Position classes for Tailwind
  const positionClasses = {
    'top-left': 'top-8 left-8',
    'top-right': 'top-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'bottom-right': 'bottom-8 right-8'
  };

  const IconComponent = (() => {
    if (currentNotice.notice_type === 'maintenance') return WrenchIcon;
    return ExclamationTriangleIcon;
  })();

  const closeBanner = (): void => {
    setIsClosing(true);

    if (process.env.NODE_ENV === 'production')
      localStorage.setItem(
        NOTICELY_BANNER_LOCAL_STORAGE_KEY,
        JSON.stringify([
          ...JSON.parse(
            localStorage.getItem(NOTICELY_BANNER_LOCAL_STORAGE_KEY) || '[]'
          ),
          currentNotice.id
        ])
      );
  };

  const noticeColors = (): string => {
    if (currentNotice.notice_type === 'maintenance')
      return 'bg-info text-info-content';
    if (!currentNotice.severity || currentNotice.severity === 'major')
      return 'bg-error text-error-content';
    return 'bg-warning text-warning-content';
  };

  return (
    <div
      className={`
        fixed z-[999999] max-w-96 font-sans bg-transparent leading-5
        animate-[banner-enter_0.5s_cubic-bezier(0.34,1.56,0.64,1)]
        max-sm:max-w-max max-sm:inset-x-4 max-sm:bottom-4
        ${positionClasses[position]}
        ${position.includes('right') ? 'banner-slide-right' : 'banner-slide-left'}
      `}
      {...(theme !== 'auto' ? { 'data-theme': theme } : {})}
    >
      <div
        ref={bannerRef}
        className={`
          bg-base-100 rounded shadow-2xl flex p-4 gap-5
          ${noticeColors()}
          ${
            isClosing
              ? 'animate-[banner-exit_0.3s_ease-in_forwards]'
              : ongoingNotices.length !== ongoing_notices.length
                ? 'animate-[banner-fade-in_0.2s_ease-in]'
                : ''
          }
        `}
      >
        <IconComponent className="w-8 h-8 min-w-fit" />

        <div className="flex flex-col gap-3">
          <div className="flex justify-between gap-3">
            <strong>{currentNotice.title}</strong>
            <button
              className="btn btn-sm btn-ghost btn-circle transition-all"
              onClick={closeBanner}
              title="Close"
              aria-label="Close banner"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <span className="leading-4">
            {Object.keys(currentNotice.affected_services).length ? (
              <>
                Affected services:{' '}
                <i>
                  {Object.entries(currentNotice.affected_services)
                    .map(
                      ([serviceId, containerNames]) =>
                        `${services.find(service => service.id === serviceId)?.name} (${containerNames.join(', ')})`
                    )
                    .join('. ')}
                </i>
              </>
            ) : (
              'No affected services'
            )}
          </span>

          <small className="leading-4">{durationLabel}</small>

          <a
            href={`${origin}/notices/${currentNotice.id}`}
            className="underline hover:opacity-50 transition-opacity"
            target="_blank"
            rel="noreferrer"
          >
            View latest updates
          </a>
        </div>
      </div>
    </div>
  );
};

export default Banner;
