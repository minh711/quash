import React from 'react';
import { Modal, Button } from 'antd';

interface ConfirmProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
}

const ConfirmModal: React.FC<ConfirmProps> = ({
  visible,
  onCancel,
  onConfirm,
  title,
  content,
}) => {
  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Yes"
      cancelText="No"
    >
      <p>{content}</p>
    </Modal>
  );
};

export default ConfirmModal;
