import { CSSProperties, memo } from 'react';

interface IconProps {
  style: CSSProperties;
}

export const ChatIcon = memo<IconProps>(({ style }) => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="1.4em"
      height="1.4em"
      fill="currentColor"
      style={style}
    >
      <path d="M512 113.777664c251.35104 0 455.110656 178.290688 455.110656 398.222336 0 219.931648-203.759616 398.222336-455.110656 398.222336-92.73344 0-178.988032-24.2688-250.923008-65.942528l-145.903616 47.11936a28.444672 28.444672 0 0 1-19.526656-0.74752c-14.53568-5.955584-21.491712-22.56896-15.536128-37.10464l50.74432-123.845632C84.082688 667.132928 56.889344 592.345088 56.889344 512c0-219.931648 203.759616-398.222336 455.110656-398.222336z m0 341.332992c-31.418368 0-56.889344 25.470976-56.889344 56.889344s25.470976 56.889344 56.889344 56.889344 56.889344-25.470976 56.889344-56.889344-25.470976-56.889344-56.889344-56.889344z m-227.555328 0c-31.419392 0-56.889344 25.470976-56.889344 56.889344s25.469952 56.889344 56.889344 56.889344c31.418368 0 56.88832-25.470976 56.88832-56.889344s-25.469952-56.889344-56.88832-56.889344z m455.110656 0c-31.418368 0-56.88832 25.470976-56.88832 56.889344s25.469952 56.889344 56.88832 56.889344c31.419392 0 56.889344-25.470976 56.889344-56.889344s-25.469952-56.889344-56.889344-56.889344z" />
    </svg>
  );
});

export const FlowIcon = memo<IconProps>(({ style }) => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="1.4em"
      height="1.4em"
      fill="currentColor"
      style={style}
    >
      <path d="M256 128C185.813333 128 128 185.813333 128 256c0 55.168 35.968 102.186667 85.333333 120.021333V554.666667h85.333334V375.978667C348.032 358.229333 384 311.168 384 256c0-70.186667-57.813333-128-128-128z m512 0a128 128 0 0 0-120.490667 85.333333H469.333333v85.333334h178.090667a128 128 0 0 0 211.072 47.829333A128 128 0 0 0 768 128zM256 213.333333c24.064 0 42.666667 18.602667 42.666667 42.666667 0 24.064-18.602667 42.666667-42.666667 42.666667-24.064 0-42.666667-18.602667-42.666667-42.666667 0-24.064 18.602667-42.666667 42.666667-42.666667z m469.333333 256v170.666667l-97.834666 97.834667a42.666667 42.666667 0 0 0 0 60.330666l110.336 110.336a42.624 42.624 0 0 0 60.330666 0l110.336-110.336a42.624 42.624 0 0 0 0-60.330666L810.666667 640v-170.666667h-85.333334zM170.666667 640a42.666667 42.666667 0 0 0-42.666667 42.666667v170.666666a42.666667 42.666667 0 0 0 42.666667 42.666667h170.666666a42.666667 42.666667 0 0 0 42.666667-42.666667v-170.666666a42.666667 42.666667 0 0 0-42.666667-42.666667H170.666667z"></path>
    </svg>
  );
});