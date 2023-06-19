import { Loading3QuartersOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useTheme } from 'antd-style';
import { Center } from 'react-layout-kit';

export default () => {
  const theme = useTheme();

  return (
    <Center height={'80%'}>
      <Spin
        spinning
        style={{ color: theme.colorTextPlaceholder }}
        size={'large'}
        indicator={<Loading3QuartersOutlined spin />}
      />
    </Center>
  );
};
