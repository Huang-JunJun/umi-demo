import Ranking from '@/components/Ranking/Ranking';
import { findMax, findMin } from '@/utils/utils';
import { Column } from '@ant-design/charts';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Statistic } from 'antd';
import RcResizeObserver from 'rc-resize-observer';
import { useEffect, useState } from 'react';
import { tableProp } from '../NumerationTable/type';
import './styles.less'; // 引入定义的CSS样式文件

const { Divider } = ProCard;

const DataChart: React.FC = () => {
  const [responsive, setResponsive] = useState(false);
  const [dataList, setDataList] = useState<tableProp[]>([]);
  const [betKing, setBetKing] = useState('');
  const [sumMoney, setSumMoney] = useState(0);
  const [maxBetKing, setMaxBetKing] = useState('');
  const [minBetKing, setMinBetKing] = useState('');
  const [itemList, setItemList] = useState<any[]>([]);

  const BetColumn = () => {
    const config = {
      title: '胜率/回报率指数',
      data: itemList
        .map((item) => {
          return {
            name: item.name,
            rateType: '胜率',
            rate: item.winRate,
          };
        })
        .concat(
          itemList.map((item) => {
            return {
              name: item.name,
              rateType: '回报率',
              rate: item.returnRate,
            };
          }),
        ),
      xField: 'name',
      yField: 'rate',
      colorField: 'rateType',
      group: true,
      label: {
        text: 'rate',
        formatter: (datum: any) => {
          return datum === 0 ? '' : `${(datum * 100).toFixed(1)}%`;
        },
      },
      style: {
        inset: 5,
      },
      axis: {
        y: {
          labelFormatter: '.0%',
        },
      },
    };
    return <Column {...config} />;
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const data = JSON.parse(localStorage.getItem('list') ?? '[]') as any[];

    setDataList(data);
    const king = findMax(data, 'money').name;
    setBetKing(king);

    let sum = 0;
    // 总下注金额
    let recordMoney = 0;
    // 赢的次数
    let winSum = 0;
    // 赢的总金额
    let winMoneySum = 0;
    // 总结算金额
    let settleMoneySum = 0;
    const list: any[] = [];
    data.forEach((item) => {
      sum = sum + item.money;
      item.recordTableData.forEach((k: any) => {
        recordMoney = recordMoney + k.money;
        settleMoneySum = settleMoneySum + k.settleMoney;
        if (k.state === 'win') {
          winSum++;
          winMoneySum = winMoneySum + k.money;
        }
      }),
        list.push({
          recordMoney: recordMoney,
          name: item.name,
          winRate: winSum / item.recordTableData.length,
          returnRate: (recordMoney + settleMoneySum) / recordMoney,
          money: item.money,
        });

      settleMoneySum = 0;
      winMoneySum = 0;
      recordMoney = 0;
      winSum = 0;
    });

    setItemList(list.sort((a, b) => b.money - a.money));
    setSumMoney(sum);
    setMaxBetKing(findMax(list, 'recordMoney').name);
    setMinBetKing(findMin(data, 'money').name);
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '数据图表',
      }}
    >
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 596);
        }}
      >
        <RcResizeObserver.Collection>
          <ProCard.Group
            title="核心指标"
            direction="column"
            gutter={16} // 增加卡片之间的间距
          >
            {/* 第一行四个卡片 */}
            <ProCard.Group direction={responsive ? 'column' : 'row'}>
              <ProCard>
                <Statistic
                  title="赌王之王"
                  value={betKing}
                  valueStyle={{
                    fontSize: 70,
                    fontWeight: 'bold',
                    animation: 'glowing 1.5s infinite', // 添加闪耀动画
                  }}
                  className="flashing-text"
                />
              </ProCard>
              <Divider type={responsive ? 'horizontal' : 'vertical'} />
              <ProCard>
                <Statistic title="总输赢" value={sumMoney} precision={2} />
              </ProCard>
              <Divider type={responsive ? 'horizontal' : 'vertical'} />
              <ProCard>
                <Statistic title="最玛猛的男人" value={maxBetKing} />
              </ProCard>
              <Divider type={responsive ? 'horizontal' : 'vertical'} />
              <ProCard>
                <Statistic title="最坚韧的男人" value={minBetKing} />
              </ProCard>
            </ProCard.Group>

            {/* 第二行两个卡片，宽度比为3:7 */}
            <ProCard.Group
              direction="row"
              gutter={16}
              style={{ marginTop: 16 }}
            >
              <ProCard colSpan={'30%'}>
                <Ranking data={dataList}></Ranking>
              </ProCard>
              <ProCard colSpan={'70%'}>
                <BetColumn></BetColumn>
                {/* <BetBar></BetBar> */}
              </ProCard>
            </ProCard.Group>
          </ProCard.Group>
        </RcResizeObserver.Collection>
      </RcResizeObserver>
    </PageContainer>
  );
};

export default DataChart;
