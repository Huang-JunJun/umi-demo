import { generateRandomId } from '@/utils/utils';
import {
  PageContainer,
  ProFormInstance,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Popconfirm } from 'antd';
import { useEffect, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import RecordModal from './components/RecordModal';
import { tableProp } from './type';

const NumerationTable: React.FC = () => {
  const formRef = useRef<ProFormInstance>();

  const [recordData, setRecordData] = useState<any>([]);
  const [tableData, setTableData] = useState<tableProp[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [recordName, setRecordName] = useState('');
  const [recordId, setRecordId] = useState('');
  const [mode, setMode] = useState('add');
  const [currentRecord, setCurrentRecord] = useState<tableProp | undefined>(
    undefined,
  );

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
    },
    {
      title: '输赢金额',
      dataIndex: 'money',
      valueType: 'money',
      fieldProps: {
        style: {
          width: '100%',
        },
      },
      sorter: (a: any, b: any) => a.money - b.money,
    },
    {
      title: '已结算金额',
      dataIndex: 'settledMoney',
      valueType: 'money',
      fieldProps: {
        style: {
          width: '100%',
        },
      },
      sorter: (a: any, b: any) => a.settledMoney - b.settledMoney,
    },
    {
      title: '待结算金额',
      dataIndex: 'waitMoney',
      valueType: 'money',
      fieldProps: {
        style: {
          width: '100%',
        },
      },
      sorter: (a: any, b: any) => a.waitMoney - b.waitMoney,
    },
    {
      title: '初始金额',
      dataIndex: 'startMoney',
      valueType: 'money',
      fieldProps: {
        style: {
          width: '100%',
        },
      },
      sorter: (a: any, b: any) => a.startMoney - b.startMoney,
    },
    {
      title: '下注次数',
      dataIndex: 'betTimes',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        // close: { text: '已清', status: 'Default' },
        running: { text: '存在待结算订单', status: 'Processing' },
        close: { text: '无待结算订单', status: 'Default' },
        // wait: { text: '待结算', status: 'Error' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, record: any) => (
        <>
          <a
            onClick={() => {
              handleUpdate(record);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              handleHistoryModalVisible(true, record);
            }}
          >
            历史记录
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title={'删除'}
            description="确认删除吗?"
            onConfirm={() => handleDelete(record)}
            okText="确认"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];
  const createColumns = columns.filter(
    (col) =>
      col.dataIndex === 'name' ||
      col.dataIndex === 'settledMoney' ||
      col.dataIndex === 'startMoney',
  );

  useEffect(() => {
    getTableData();
  }, []); // 空数组表示只在组件挂载和卸载时执行一次

  const getTableData = () => {
    const data = JSON.parse(localStorage.getItem('list') ?? '[]') as any[];

    if (data && JSON.stringify(data) !== JSON.stringify(tableData)) {
      data.forEach((item) => {
        item.waitMoney = item.startMoney - item.settledMoney + item.money;
        item.betTimes = item.recordTableData.length;
        if (item.recordTableData.length > 0) {
          if (item.recordTableData.some((i: any) => i.state === 'wait')) {
            item.status = 'running';
          } else {
            item.status = 'close';
          }
        }
      });
      setTableData(data);
    }

    localStorage.setItem('list', JSON.stringify(data));
  };

  const handleModalVisible = (flag: boolean) => {
    setCreateModalVisible(flag);
    getTableData();
  };

  const handleHistoryModalVisible = (flag: boolean, record?: any) => {
    if (flag) {
      setRecordData(record.recordTableData);
      setRecordId(record.id);
      setRecordName(record.name);
    }

    setHistoryModalVisible(flag);
    getTableData();
  };

  const handleAdd = (value: any) => {
    const data = JSON.parse(localStorage.getItem('list') ?? '[]') as any[];
    if (data && mode === 'add') {
      data.push({
        id: generateRandomId(),
        name: value.name,
        money: 0,
        settledMoney: value.settledMoney,
        waitMoney: 0,
        startMoney: value.startMoney,
        recordTableData: [],
      });
      localStorage.setItem('list', JSON.stringify(data));
    }
    if (data && mode === 'edit') {
      data.forEach((item) => {
        if (item.id === currentRecord?.id) {
          item.settledMoney = value.settledMoney;
          item.waitMoney = value.waitMoney;
          item.startMoney = value.startMoney;
        }
      });
      localStorage.setItem('list', JSON.stringify(data));
    }
    handleModalVisible(false);
  };

  const handleUpdate = (record: any) => {
    setCurrentRecord(record);
    setMode('edit');
    handleModalVisible(true);
  };

  const handleDelete = (record: any) => {
    const data = tableData.map((item) => item);
    for (let i = 0; i < data.length; i++) {
      if (data[i].name === record.name) {
        data.splice(i, 1);
      }
    }
    localStorage.setItem('list', JSON.stringify(data));
    getTableData();
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '记数表',
      }}
    >
      <ProTable
        headerTitle="开云记数表"
        rowKey="id"
        columns={columns}
        dataSource={tableData}
        tableStyle={{
          height: 500,
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => {
              setCurrentRecord(undefined);
              setMode('add');
              handleModalVisible(true);
            }}
          >
            新建
          </Button>,
        ]}
      />
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        mode={mode}
        modalVisible={createModalVisible}
        initialValues={currentRecord}
      >
        <ProTable
          onSubmit={(value) => {
            handleAdd(value);
          }}
          rowKey="name"
          type="form"
          formRef={formRef}
          columns={mode ? createColumns : columns}
        />
      </CreateForm>
      <RecordModal
        modalVisible={historyModalVisible}
        defaultData={recordData}
        recordId={recordId}
        recordName={recordName}
        onCancel={() => handleHistoryModalVisible(false)}
      ></RecordModal>
    </PageContainer>
  );
};

export default NumerationTable;
