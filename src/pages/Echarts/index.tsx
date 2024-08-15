import { PageContainer } from '@ant-design/pro-components';
import * as echarts from 'echarts';
import { useEffect, useRef, useState } from 'react';

const EchartsPage: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [timeUnit, setTimeUnit] = useState('month');
  let isFirst = true;

  const timeUnits = ['week', 'month', 'year'];
  let index = timeUnits.indexOf(timeUnit);

  const generateData = (unit: string) => {
    let xAxisData = [];
    let data1 = [];
    let data2 = [];
    let data3 = [];
    let data4 = [];
    let baseTime = new Date(2020, 0, 1).getTime();

    const addData = (date: Date) => {
      xAxisData.push(echarts.format.formatTime('yyyy-MM-dd', date));
      data1.push(+(Math.random() * 2).toFixed(2));
      data2.push(+(Math.random() * 5).toFixed(2));
      data3.push(+(Math.random() + 0.3).toFixed(2));
      data4.push(+Math.random().toFixed(2));
    };

    if (unit === 'week') {
      for (let i = 0; i < 52; i++) {
        addData(new Date(baseTime + i * 7 * 24 * 60 * 60 * 1000));
      }
    } else if (unit === 'month') {
      for (let i = 0; i < 12; i++) {
        addData(new Date(2020, i, 1));
      }
    } else if (unit === 'year') {
      for (let i = 0; i < 5; i++) {
        addData(new Date(2020 + i, 0, 1));
      }
    }

    return { xAxisData, data1, data2, data3, data4 };
  };

  const initChart = (unit: string) => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);
      const data = generateData(unit);

      const option = {
        title: {
          // text: 'ECharts Example',
          left: 'center',
        },
        legend: {
          data: [
            'bar',
            'bar2',
            'bar3',
            'bar4',
            'bar5',
            'bar6',
            'bar7',
            'bar8',
            'bar9',
            'bar10',
            'bar11',
            'bar12',
            'bar13',
            'bar14',
            'bar15',
            'bar16',
          ],
          left: '10%',
        },
        brush: {
          toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
          xAxisIndex: 0,
        },
        toolbox: {
          feature: {
            magicType: {
              type: ['stack', 'line', 'bar'],
              option: {
                line: {
                  stack: null,
                },
              },
              emphasis: {
                iconStyle: {
                  borderColor: 'blue',
                },
              },
            },
            myTool: {
              show: true,
              title: '切换时间单位',
              icon: 'path://M512 0C229.204 0 0 229.204 0 512s229.204 512 512 512 512-229.204 512-512S794.796 0 512 0zM298.667 725.333h-85.334v-85.334h85.334v85.334z m0-213.333h-85.334v-85.334h85.334v85.334z m0-213.333h-85.334v-85.334h85.334v85.334z m213.333 426.666h-85.333v-85.334h85.333v85.334z m0-213.333h-85.333v-85.334h85.333v85.334z m0-213.333h-85.333v-85.334h85.333v85.334z m213.334 426.666h-85.334v-85.334h85.334v85.334z m0-213.333h-85.334v-85.334h85.334v85.334z m0-213.333h-85.334v-85.334h85.334v85.334z m-106.667 245.333h-234.667v-85.334h234.667v85.334z m0-234.667h-234.667v-85.334h234.667v85.334z',
              onclick: function () {
                index = (index + 1) % timeUnits.length;
                const newUnit = timeUnits[index];
                setTimeUnit(newUnit);
                const data = generateData(newUnit);
                myChart.setOption({
                  xAxis: {
                    data: data.xAxisData,
                  },
                  series: [
                    {
                      name: 'bar',
                      data: data.data1,
                    },
                    {
                      name: 'bar2',
                      data: data.data2,
                    },
                    {
                      name: 'bar3',
                      data: data.data3,
                    },
                    {
                      name: 'bar4',
                      data: data.data4,
                    },
                    {
                      name: 'bar5',
                      data: data.data1,
                    },
                    {
                      name: 'bar6',
                      data: data.data2,
                    },
                    {
                      name: 'bar7',
                      data: data.data3,
                    },
                    {
                      name: 'bar8',
                      data: data.data4,
                    },
                    {
                      name: 'bar9',
                      data: data.data1,
                    },
                    {
                      name: 'bar10',
                      data: data.data2,
                    },
                    {
                      name: 'bar11',
                      data: data.data3,
                    },
                    {
                      name: 'bar12',
                      data: data.data4,
                    },
                  ],
                });
              },
            },
            saveAsImage: {
              show: true,
              title: '保存为图片',
              emphasis: {
                iconStyle: {
                  borderColor: 'yellow',
                },
              },
            },
            restore: {
              show: true,
              emphasis: {
                iconStyle: {
                  borderColor: 'black',
                },
              },
            },
          },
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: data.xAxisData,
          name: 'X Axis',
          axisLine: { onZero: true },
          splitLine: { show: false },
          splitArea: { show: false },
        },
        yAxis: {},
        grid: {
          bottom: 100,
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            start: 0,
            end: 100,
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 0,
            end: 100,
          },
        ],
        series: [
          {
            name: 'bar',
            type: 'bar',
            data: data.data1,
          },
          {
            name: 'bar2',
            type: 'bar',
            data: data.data2,
          },
          {
            name: 'bar3',
            type: 'bar',
            data: data.data3,
          },
          {
            name: 'bar4',
            type: 'bar',
            data: data.data4,
          },
          {
            name: 'bar5',
            type: 'bar',
            data: data.data4,
          },
          {
            name: 'bar6',
            type: 'bar',
            data: data.data4,
          },
          {
            name: 'bar7',
            type: 'bar',
            data: data.data4,
          },
          {
            name: 'bar8',
            type: 'bar',
            data: data.data4,
          },
          {
            name: 'bar9',
            type: 'bar',
            data: data.data4,
          },
          {
            name: 'bar10',
            type: 'bar',
            data: data.data4,
          },
          {
            name: 'bar11',
            type: 'bar',
            data: data.data4,
          },
          {
            name: 'bar12',
            type: 'bar',
            data: data.data4,
          },
          {
            name: 'bar13',
            type: 'bar',
            data: data.data4,
          },
          {
            name: 'bar14',
            type: 'bar',
            data: data.data4,
          },
          {
            name: 'bar15',
            type: 'bar',
            data: data.data4,
          },
          {
            name: 'bar16',
            type: 'bar',
            data: data.data4,
          },
        ],
      };

      myChart.setOption(option);
      myChart.on('magictypechanged', (params) => {
        const isLine = params.currentType === 'line';
        let magicType: any = {
          type: ['stack', 'line', 'bar'],
        };
        if (isLine) {
          magicType = {
            type: ['line', 'bar'],
          };
          option.series.forEach((item) => {
            item.type = 'line';
            item.stack = null;
          });
        }

        option.toolbox.feature.magicType = magicType;
        myChart.setOption(option);
      });
      return myChart; // 返回实例以便在清理时使用
    }
  };

  useEffect(() => {
    const myChart = initChart(timeUnit);

    return () => {
      if (myChart) {
        echarts.dispose(myChart); // 销毁实例
      }
    };
  }, [timeUnit]);

  return (
    <PageContainer
      ghost
      header={{
        title: 'EchartsPage',
      }}
    >
      <div
        id="main"
        ref={chartRef}
        style={{ width: '100%', height: '500px' }}
      ></div>
    </PageContainer>
  );
};

export default EchartsPage;
