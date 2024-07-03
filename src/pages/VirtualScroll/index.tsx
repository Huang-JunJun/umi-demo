import { PageContainer } from '@ant-design/pro-components';
import { Select, SelectProps } from 'antd';

const VirtualScrollPage: React.FC = () => {
  const options: SelectProps['options'] = [];

  for (let i = 0; i < 100000; i++) {
    const value = `${i.toString(36)}${i}`;
    options.push({
      label: value,
      value,
      disabled: i === 10,
    });
  }

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
  };
  return (
    <PageContainer
      ghost
      header={{
        title: '虚拟滚动',
      }}
    >
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Please select"
        defaultValue={['a10', 'c12']}
        onChange={handleChange}
        options={options}
      />
    </PageContainer>
  );
};

export default VirtualScrollPage;
