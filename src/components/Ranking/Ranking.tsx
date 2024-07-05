import { Avatar, List } from 'antd';
import { useEffect, useState } from 'react';

type PropsType = {
  data: any[];
};

const Ranking = (props: PropsType) => {
  const [rankList, setRankList] = useState<any>([]);

  useEffect(() => {
    const data = props.data.sort((a, b) => b.money - a.money);
    data.forEach((item) => {
      if (item.name === '黄显竣') {
        item.desc = '💪当上赌王';
      } else if (item.name === '杨淞') {
        item.desc = '干掉大饼';
      } else {
        item.desc = '我是赌王我怕谁';
      }
    });
    setRankList(data);
  }, [props.data]); // 空数组表示只在组件挂载和卸载时执行一次

  const getAvatarSrc = (name: string) => {
    try {
      return require(`@/assets/images/${name}.jpg`);
    } catch (err) {
      return require('@/assets/images/default.jpg'); // 处理找不到图片的情况
    }
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={rankList}
      renderItem={(item: any, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={getAvatarSrc(item.name)}></Avatar>}
            title={<a>{item.name}</a>}
            description={item.desc}
          />
          <div>Top {index + 1}</div>
        </List.Item>
      )}
    />
  );
};
export default Ranking;
