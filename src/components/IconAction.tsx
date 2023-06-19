import { Button, ConfigProvider, Tooltip, TooltipProps } from 'antd';
import { MouseEventHandler, ReactNode, forwardRef, useMemo } from 'react';

interface IconActionProps {
  title?: string;
  size?: 'large' | 'middle' | 'small';
  icon: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  arrow?: boolean;
  placement?: TooltipProps['placement'];
  type?: 'default' | 'danger';
  loading?: boolean;
}

export const IconAction = forwardRef<HTMLElement, IconActionProps>(
  ({ title, type, placement, loading, size, onClick, icon, arrow }, ref) => {
    const fontSize = useMemo(() => {
      switch (size) {
        case 'large':
          return 16;
        case 'middle':
          return 14;
        case 'small':
          return 12;
      }
    }, [size]);

    const content = (
      <Button
        ref={ref}
        size={size}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        type={'text'}
        danger={type === 'danger'}
        icon={icon}
        loading={loading}
        onClick={onClick}
      />
    );

    return title ? (
      <ConfigProvider theme={{ token: { fontSize: 14 } }}>
        <Tooltip arrow={arrow} title={title} placement={placement}>
          <span ref={ref}>
            <ConfigProvider theme={{ token: { fontSize } }}>{content}</ConfigProvider>
          </span>
        </Tooltip>
      </ConfigProvider>
    ) : (
      content
    );
  },
);
