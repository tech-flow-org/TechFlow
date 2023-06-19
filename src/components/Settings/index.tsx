import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Segmented, Upload } from 'antd';
import { useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useImportAndExport } from '@/hooks/useImportAndExport';
import { useSettings } from '@/store/settings';
import { useStyles } from './style';

export default () => {
  const settings = useSettings();
  const { styles } = useStyles();
  const [form] = Form.useForm();
  const { exportConfigFile, handleImport } = useImportAndExport();

  useEffect(() => {
    form.setFieldsValue(settings);
  }, [settings]);

  return (
    <Flexbox width={240}>
      <Form
        form={form}
        onValuesChange={(changedValues) => {
          useSettings.setState(changedValues);
        }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ textAlign: 'right' }}
      >
        <Form.Item name={'fontSize'} label={'字体大小'}>
          <Segmented
            options={[
              { label: '大号', value: 16 },
              { label: '默认', value: 14 },
            ]}
          />
        </Form.Item>
        <Form.Item name={'contentWidth'} label={'排版'}>
          <Segmented
            options={[
              { label: '默认', value: 800 },
              { label: '超宽', value: 1152 },
            ]}
          />
        </Form.Item>
      </Form>

      <Flexbox horizontal gap={12}>
        <Upload
          className={styles.upload}
          maxCount={1}
          onChange={handleImport}
          showUploadList={false}
        >
          <Button
            block
            className={styles.actions}
            type={'default'}
            title="导入"
            icon={<UploadOutlined />}
          >
            导入
          </Button>
        </Upload>
        <Flexbox width={'100%'}>
          <Button
            block
            className={styles.actions}
            title="导出"
            icon={<DownloadOutlined />}
            onClick={exportConfigFile}
          >
            导出
          </Button>
        </Flexbox>
      </Flexbox>
    </Flexbox>
  );
};
