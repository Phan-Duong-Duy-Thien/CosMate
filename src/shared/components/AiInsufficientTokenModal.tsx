import { Modal } from "antd"

interface AiInsufficientTokenModalProps {
  open: boolean
  onCancel: () => void
  onTopUp: () => void
}

export function AiInsufficientTokenModal({ open, onCancel, onTopUp }: AiInsufficientTokenModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      closable={false}
      maskClosable={false}
      width={520}
      styles={{
        content: {
          border: "3px solid #111827",
          borderRadius: 24,
          background: "#fff7fb",
          boxShadow: "10px 10px 0 0 #111827",
        },
        header: { background: "transparent" },
      }}
      title={<div className="text-lg font-extrabold text-indigo-950">Hết xu Token rồi</div>}
    >
      <div className="space-y-4 text-sm font-medium text-slate-700">
        <p>
          Bạn đã dùng hết Token AI. Vui lòng nạp thêm để tiếp tục trải nghiệm các tính năng thông minh của CosMate.
        </p>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border-[2px] border-indigo-950 bg-white px-4 py-2 font-extrabold text-indigo-950 shadow-[4px_4px_0_0_#111827]"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onTopUp}
            className="rounded-xl border-[2px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 px-4 py-2 font-extrabold text-white shadow-[4px_4px_0_0_#111827]"
          >
            Nạp xu ngay
          </button>
        </div>
      </div>
    </Modal>
  )
}
