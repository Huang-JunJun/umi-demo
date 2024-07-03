import { Modal, Spin } from 'antd';
import React, { PropsWithChildren, useLayoutEffect, useState } from 'react';

interface CreateFormProps {
  modalVisible: boolean;
  mode: string;
  initialValues?: any;
  onCancel: () => void;
}

const CreateForm: React.FC<PropsWithChildren<CreateFormProps>> = (props) => {
  const { modalVisible, mode, initialValues, onCancel } = props;
  const [loading, setLoading] = useState<boolean>(false);

  useLayoutEffect(() => {
    setLoading(true);
    setTimeout(() => {
      if (props.children?.props.formRef.current) {
        props.children?.props.formRef.current.setFieldsValue(initialValues);
      }
      setLoading(false);
    }, 500);
  }, [modalVisible]);

  return (
    <Modal
      destroyOnClose
      title={mode === 'add' ? '新建' : '编辑'}
      width={420}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Spin spinning={loading}>{props.children}</Spin>
    </Modal>
  );
};

export default CreateForm;
