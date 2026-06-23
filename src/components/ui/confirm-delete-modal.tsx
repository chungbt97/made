"use client";

import { Modal } from "./modal";
import { Button } from "./button";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  sessionName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  sessionName,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Xác nhận xoá">
      <div className="flex flex-col gap-6">
        <p className="text-sm text-[#3a3a3a]">
          Bạn có chắc chắn muốn xoá phiên{" "}
          <span className="font-semibold text-[#0a0a0a]">{sessionName}</span>?
          <br />
          Hành động này không thể hoàn tác.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Huỷ
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Xoá
          </Button>
        </div>
      </div>
    </Modal>
  );
}
