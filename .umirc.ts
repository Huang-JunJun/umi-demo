import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: '虚拟滚动',
      path: '/virtualScroll',
      component: './VirtualScroll',
    },
    {
      name: '自适应列宽',
      path: '/adaptiveColumnWidth',
      component: './AdaptiveColumnWidth',
    },
    {
      name: '数据图表',
      path: '/dataChart',
      component: './DataChart',
    },
    {
      name: '开云记数表',
      path: '/numerationTable',
      component: './NumerationTable',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
    {
      name: 'echarts图表',
      path: '/echarts',
      component: './Echarts',
    },
    {
      name: 'indexDB数据库',
      path: '/indexedDB',
      component: './IndexedDB',
    },
  ],
  npmClient: 'yarn',
});
