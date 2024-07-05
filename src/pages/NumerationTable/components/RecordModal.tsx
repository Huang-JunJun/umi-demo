import { generateRandomId } from '@/utils/utils';
import type {
  EditableFormInstance,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components';
import { EditableProTable, ProForm } from '@ant-design/pro-components';
import { Modal, Popconfirm } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';

type PropsType = {
  recordId: string;
  modalVisible?: boolean;
  defaultData?: [];
  initMoney?: any; // 初始结算金额 根据初始结算金额进行计算
  recordName?: string;
  onCancel: () => void;
};

const RecordModal = (props: PropsType) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const { recordId, modalVisible, defaultData, recordName, onCancel } = props;
  const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>('top');
  const [controlled, setControlled] = useState<boolean>(false);
  const [winSum, setWinSum] = useState<number>(0);
  const formRef = useRef<ProFormInstance<any>>();
  const editorFormRef = useRef<EditableFormInstance>();
  const columns: ProColumns[] = [
    {
      title: '下注内容',
      dataIndex: 'title',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      width: '30%',
    },
    {
      title: '下注金额',
      dataIndex: 'money',
      valueType: 'money',
      fieldProps: {
        style: {
          width: '100%',
        },
      },
    },
    {
      title: '可赢额',
      dataIndex: 'winMoney',
      valueType: 'money',
      fieldProps: {
        style: {
          width: '100%',
        },
      },
    },
    {
      title: '结算金额',
      dataIndex: 'settleMoney',
      valueType: 'money',
      fieldProps: {
        style: {
          width: '100%',
        },
        onChange: (value: any) => {
          if (editorFormRef.current) {
            const tableDataSource =
              editorFormRef.current?.getFieldValue('table');
            tableDataSource.forEach((item: any) => {
              if (editableKeys.includes(item.id)) {
                if (value > 0) {
                  item.state = 'win';
                } else if (value < 0) {
                  item.state = 'lose';
                } else {
                  item.state = 'deuce';
                }
              }
            });

            editorFormRef.current?.setFieldsValue({
              table: tableDataSource,
            });
          }
        },
      },
      // render: (_: any, record: any) => (
      //   <>
      //     <span>
      //       {record.settleMoney > 0 ? '+'}
      //     </span>
      //   </>
      // ),
    },
    {
      title: '结算结果',
      key: 'state',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        deuce: { text: '和', status: 'Default' },
        wait: { text: '待结算', status: 'Default' },
        lose: {
          text: '负',
          status: 'Error',
        },
        win: {
          text: '胜',
          status: 'Success',
        },
      },
    },
    {
      title: '下注日期',
      dataIndex: 'created_at',
      valueType: 'date',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delPop"
          title={'删除'}
          description="确认删除吗?"
          onConfirm={() => handleDelete(record.id)}
          okText="确认"
          cancelText="取消"
        >
          <a key="del">删除</a>
        </Popconfirm>,
      ],
    },
  ];

  useEffect(() => {
    if (modalVisible) {
      setWinSum(handleCalculator(defaultData));
    }
  }, [modalVisible]); // 空数组表示只在组件挂载和卸载时执行一次

  const handleDelete = (key: any) => {
    const data = JSON.parse(localStorage.getItem('list') ?? '[]') as any[];
    const tableDataSource = formRef.current?.getFieldValue('table');
    const tableData = tableDataSource.filter((item: any) => item.id !== key);
    formRef.current?.setFieldsValue({
      table: tableData,
    });

    data.forEach((item) => {
      if (item.id === recordId) {
        item.recordTableData = tableDataSource
          .filter((item: { id: any }) => item.id !== key)
          .map((k: any) => k);
        item.money = handleCalculator(tableData);
      }
    });
    localStorage.setItem('list', JSON.stringify(data));
  };

  const handleCalculator = (data: any) => {
    let sum = 0;

    data?.forEach((item: any) => {
      sum = sum + item.settleMoney;
    });
    setWinSum(sum);

    return sum;
  };

  return (
    <Modal
      destroyOnClose
      title={'下注记录-' + recordName}
      width={1200}
      style={{
        height: 700,
      }}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={
        <div>
          <span style={{ textAlign: 'right' }}>合计输赢：{winSum}</span>
        </div>
      }
    >
      <ProForm<{
        table: [];
      }>
        formRef={formRef}
        initialValues={{
          table: defaultData,
        }}
        submitter={false}
        validateTrigger="onBlur"
      >
        <EditableProTable
          rowKey="id"
          scroll={{
            x: 960,
            y: 400,
          }}
          style={{
            height: 500,
          }}
          editableFormRef={editorFormRef}
          name="table"
          controlled={controlled}
          recordCreatorProps={{
            position: position as 'top',
            record: () => ({
              id: generateRandomId(),
              created_at: moment().format('YYYY-MM-DD'), // 初始化今日日期
              state: 'wait', // 初始化状态为待结算
              settleMoney: 0,
              money: 0,
              winMoney: 0,
            }),
          }}
          columns={columns}
          editable={{
            type: 'multiple',
            editableKeys,
            onChange: setEditableRowKeys,
            onSave: async (key, record, originRow) => {
              // 处理保存逻辑
              const data = JSON.parse(
                localStorage.getItem('list') ?? '[]',
              ) as any[];
              const tableDataSource = formRef.current?.getFieldValue('table');
              const updatedData = tableDataSource.map((item: any) =>
                item.id === key ? { ...item, ...record } : item,
              );
              formRef.current?.setFieldsValue({ table: updatedData });
              data.forEach((item) => {
                if (item.id === recordId) {
                  item.recordTableData = updatedData.map((k: any) => k);
                  item.money = handleCalculator(updatedData);
                }
              });
              localStorage.setItem('list', JSON.stringify(data));
            },
            onDelete: async (key: any, record: any) => handleDelete(key),
          }}
        />
      </ProForm>
    </Modal>
  );
};

export default RecordModal;
