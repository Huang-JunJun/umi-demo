import { TsIndexDb } from '@/utils/indexedDB';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Input } from 'antd';
import { useEffect, useState } from 'react';

const IndexedDBPage: React.FC = () => {
  const [tableName, setTableName] = useState<string>('');
  const db = TsIndexDb.getInstance({
    dbName: 'mysql',
  });

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await db.open_db();
  };

  const formatTable = (list: any) => {
    return list.map((item: any) => {
      return {
        tableName: item,
        keyPath: 'key',
      };
    });
  };

  const addTable = async () => {
    const db = TsIndexDb.getInstance({
      dbName: 'mysql',
    });

    if (db.db) {
      db.tableList = formatTable(Array.from(db.tableList)).concat([
        {
          tableName: 'person',
          option: { keyPath: 'key' },
          indexs: [
            { key: 'key', option: { unique: false } },
            { key: 'age', option: { unique: false } },
            { key: 'name', option: { unique: false } },
          ],
        },
      ]);

      db.version = db.db.version + 1;
      await db.close_db();
      await db.open_db();
    }
  };

  const addTableData = async (tableName: string) => {
    await db.insert({
      tableName: tableName,
      data: [
        {
          key: 'hxj',
          name: 'huangxianjun',
          age: 38,
        },
      ],
    });
  };

  const queryAllTableData = async (tableName: string) => {
    const data = await db.queryAll({
      tableName: tableName,
    });

    console.log('data', data);
  };

  const queryTableData = async (tableName: string) => {
    const data = await db.query({
      tableName: tableName,
      condition: (record: any) => record.age > 25,
    });

    console.log('data', data);
  };

  const queryByKeyValueTableData = async (tableName: string) => {
    const data = await db.query_by_keyValue({
      tableName: tableName,
      key: 'key',
      value: 'hxj',
    });

    console.log('data', data);
  };

  const queryByPrimaryKeyalueTableData = async (tableName: string) => {
    const data = await db.query_by_primaryKey({
      tableName: tableName,
      value: 'lisi',
    });

    console.log('data', data);
  };

  const deleteByKeyValueTableData = async (tableName: string) => {
    const data = await db.delete_by_primaryKey({
      tableName: tableName,
      value: 'hxj',
    });

    console.log('data', data);
  };

  // 根据条件更新数据
  const updateTableData = async (tableName: string) => {
    const result = await db.update({
      tableName: tableName, // 表名
      condition: (item: any) => item.age > 40, // 条件：选择年龄大于 30 的人
      handle: (item) => {
        item.name = 'lidongdong'; // 修改名字
        return item; // 返回修改后的对象
      },
    });

    console.log('Updated data:', result); // 输出更新后的数据
  };

  const updateByPrimaryKeyTableData = async (tableName: string) => {
    const result = await db.update_by_primaryKey({
      tableName: tableName, // 表名
      value: 'hxj',
      handle: (item: any) => {
        item.name = 'lidongdong'; // 修改名字
        return item; // 返回修改后的对象
      },
    });

    console.log('Updated data:', result); // 输出更新后的数据
  };

  const handleInputChange = (e: any) => {
    setTableName(e.target.value);
  };

  return (
    <PageContainer
      ghost
      header={{
        title: 'indexDB',
      }}
    >
      <Button onClick={() => addTable()}>添加数据表</Button>
      <Input value={tableName} onChange={handleInputChange} />
      <Button onClick={() => addTableData(tableName)}>
        {tableName}表中删除数据
      </Button>
      <Button onClick={() => addTableData(tableName)}>
        {tableName}表中添加数据
      </Button>
      <Button onClick={() => queryAllTableData(tableName)}>
        查询{tableName}表中所有数据
      </Button>
      <Button onClick={() => queryTableData(tableName)}>
        查询{tableName}表中数据
      </Button>
      <Button onClick={() => queryByKeyValueTableData(tableName)}>
        查询{tableName}表中具体属性
      </Button>
      <Button onClick={() => queryByPrimaryKeyalueTableData(tableName)}>
        根据key查询{tableName}表中数据
      </Button>
      <Button onClick={() => updateTableData(tableName)}>
        根据条件更新{tableName}表数据
      </Button>
      <Button onClick={() => updateByPrimaryKeyTableData(tableName)}>
        根据key更新{tableName}表数据
      </Button>
      <Button onClick={() => deleteByKeyValueTableData(tableName)}>
        删除{tableName}表中具体属性
      </Button>
    </PageContainer>
  );
};

export default IndexedDBPage;
