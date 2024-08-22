import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import { useCallback, useEffect, useState } from 'react';

const VirtualScrollPage: React.FC = () => {
  const [scrollTop, setScrollTop] = useState(0); // 当前滚动位置
  const [elements, setElements] = useState<string[]>([]); // 全部元素
  const [virtualList, setVirtualList] = useState<string[]>([]); // 虚拟滚动显示的元素

  const itemHeight = 40; // 每个元素的高度
  const visibleCount = 30; // 可视区域内显示的元素数量

  useEffect(() => {
    initElements();
    const body = document.getElementsByClassName('ant-card')[0];

    if (body) {
      body.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (body) {
        body.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // 使用useCallback缓存，只在elements改变后重新缓存函数
  const handleScroll = useCallback(() => {
    const body = document.getElementsByClassName('ant-card')[0];
    console.log('body', body);

    if (body) {
      const newScrollTop = body.scrollTop;
      setScrollTop(newScrollTop);

      // 计算当前可视区域的起始索引和终止索引
      const startIndex = Math.floor(newScrollTop / itemHeight);
      const endIndex = Math.min(startIndex + visibleCount, elements.length);

      // 更新虚拟列表
      const newVirtualList = elements.slice(startIndex, endIndex);
      console.log('newVirtualList', newVirtualList);

      setVirtualList(newVirtualList);
    }
  }, [elements]);

  const initElements = () => {
    const list = [];
    for (let i = 0; i < 10000; i++) {
      list.push(`Card content ${i}`);
    }

    setElements(list);
    setVirtualList(list.slice(0, visibleCount));
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '虚拟滚动示例',
      }}
      style={{ height: '100vh' }}
    >
      <Card
        title="Card title"
        bordered={false}
        style={{ width: '100%', height: '50vh', overflowY: 'auto' }}
      >
        {/* 外层 div 占据总高度 */}
        <div
          style={{
            height: `${elements.length * itemHeight}px`,
            position: 'relative',
          }}
        >
          {/* 内层 div 使用 transform 控制偏移量 */}
          <div style={{ transform: `translateY(${scrollTop}px)` }}>
            {virtualList.map((item, index) => (
              <p key={index} style={{ height: itemHeight, margin: 0 }}>
                {item}
              </p>
            ))}
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default VirtualScrollPage;
