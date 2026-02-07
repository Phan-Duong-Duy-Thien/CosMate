import { Dialog, DialogContent } from "@/shared/components/Dialog"
import { Button } from "@shared/components/Button"

interface LogoutConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function LogoutConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: LogoutConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm" onClose={() => onOpenChange(false)}>
        <h3 className="text-lg font-semibold text-slate-900">
          Xác nhận đăng xuất
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Bạn có chắc muốn đăng xuất không?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button variant="default" size="sm" onClick={handleConfirm}>
            Đăng xuất
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
