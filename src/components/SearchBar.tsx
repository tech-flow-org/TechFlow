import { SearchOutlined } from '@ant-design/icons';
import { Input, InputProps } from 'antd';
import { memo } from 'react';

export const SearchBar = memo(({ value, onChange, style }: InputProps) => (
  <Input
    prefix={<SearchOutlined />}
    allowClear
    value={value}
    placeholder="搜索"
    style={{ ...style, borderColor: 'transparent' }}
    onChange={onChange}
  />
));
