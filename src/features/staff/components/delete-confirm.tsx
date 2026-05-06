import { Card, CardContent, Button } from "@/components/ui";
import { UserX } from "lucide-react";
import type { StaffMember } from "../types";

interface DeleteConfirmProps {
  staff: StaffMember;
  onConfirm: () => void;
  onClose: () => void;
  isLoading: boolean;
}

export function DeleteConfirm({ staff, onConfirm, onClose, isLoading }: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-sm mx-4">
        <CardContent className="pt-6 pb-6 text-center">
          <div className="h-12 w-12 rounded-full bg-error-light flex items-center justify-center mx-auto mb-4">
            <UserX className="h-5 w-5 text-error" />
          </div>
          <h3 className="text-base font-semibold text-text-primary mb-1">Hapus Staff</h3>
          <p className="text-sm text-text-secondary mb-6">
            Hapus <strong>{staff.full_name}</strong> dari tim? Akses mereka akan dicabut.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button variant="destructive" className="flex-1" onClick={onConfirm} isLoading={isLoading}>
              Hapus
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
