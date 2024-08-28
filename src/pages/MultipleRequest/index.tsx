import { handQueue } from '@/utils/utils';
import { PageContainer } from '@ant-design/pro-components';
import { request } from '@umijs/max';
import { Avatar, List } from 'antd';
import { useEffect, useState } from 'react';

interface UserType {
  id: number | string;
  name: string;
  age: number;
}

const MultipleRequestPage: React.FC = () => {
  const [data, setData] = useState<UserType[]>([]);

  useEffect(() => {
    handQueue([
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
      () => request('/api/users'),
    ]);
  }, []);

  const getUsers = async () => {
    const res = await request('/api/users');
    console.log(res);
    if (res.status === 200) {
      setData(res.data);
    }
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '前端多请求并发操作',
      }}
    >
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                />
              }
              title={<a href="https://ant.design">{item.name}</a>}
              description={item.id}
            />
          </List.Item>
        )}
      />
    </PageContainer>
  );
};

export default MultipleRequestPage;
