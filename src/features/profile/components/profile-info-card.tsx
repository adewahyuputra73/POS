"use client";

import { Avatar, Badge } from "@/components/ui";
import {
  Card,
  CardContent,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Building2,
  Shield,
  Edit3,
  Camera,
} from "lucide-react";
import { UserProfile, ROLE_LABELS, ROLE_COLORS } from "../types";

interface ProfileInfoCardProps {
  profile: UserProfile;
  onEditClick: () => void;
}

export function ProfileInfoCard({ profile, onEditClick }: ProfileInfoCardProps) {
  return (
    <Card>
      {/* Cover + Avatar section */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-primary via-primary-dark to-secondary rounded-t-xl" />
        <div className="absolute -bottom-12 left-6 flex items-end gap-4">
          <div className="relative group">
            <Avatar
              src={profile.avatar}
              alt={profile.name}
              size="xl"
              className="h-24 w-24 text-2xl ring-4 ring-surface shadow-lg"
            />
            <button
              className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              onClick={() => {}}
            >
              <Camera className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
        <button
          onClick={onEditClick}
          className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg text-sm font-medium transition-all"
        >
          <Edit3 className="h-3.5 w-3.5" />
          Edit Profil
        </button>
      </div>

      <CardContent className="pt-16 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary">{profile.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={cn("text-xs font-semibold", ROLE_COLORS[profile.role])}>
                <Shield className="h-3 w-3 mr-1" />
                {ROLE_LABELS[profile.role]}
              </Badge>
              <Badge
                className={cn(
                  "text-xs font-semibold",
                  profile.is_active
                    ? "bg-success-light text-success"
                    : "bg-background text-text-secondary"
                )}
              >
                {profile.is_active ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <InfoItem icon={Mail} label="Email" value={profile.email} />
          <InfoItem icon={Phone} label="Telepon" value={profile.phone} />
          <InfoItem
            icon={MapPin}
            label="Alamat"
            value={profile.address || "-"}
          />
          <InfoItem
            icon={Calendar}
            label="Tanggal Lahir"
            value={
              profile.date_of_birth
                ? formatDate(profile.date_of_birth, "dd MMMM yyyy")
                : "-"
            }
          />
          <InfoItem
            icon={Building2}
            label="Outlet"
            value={profile.outlet_name || "-"}
          />
          <InfoItem
            icon={Clock}
            label="Terakhir Login"
            value={formatDateTime(profile.last_login)}
          />
        </div>

        <div className="mt-4 pt-4 border-t border-divider">
          <p className="text-xs text-text-secondary">
            Bergabung sejak {formatDate(profile.joined_date, "dd MMMM yyyy")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-text-secondary" />
      </div>
      <div>
        <p className="text-xs text-text-secondary font-medium">{label}</p>
        <p className="text-sm text-text-primary font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}
