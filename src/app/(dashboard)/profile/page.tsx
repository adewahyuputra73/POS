"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Lock, Activity } from "lucide-react";
import {
  ProfileInfoCard,
  EditProfileForm,
  ChangePasswordForm,
  ActivityLogList,
} from "@/features/profile/components";
import { authService } from "@/features/auth/services/auth-service";
import type { UserProfile, ProfileFormData } from "@/features/profile/types";
import type { LoginResponse } from "@/features/auth/types";

function mapApiUser(raw: LoginResponse["user"]): UserProfile {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    role: raw.role,
    avatar: raw.avatar,
    address: undefined,
    date_of_birth: undefined,
    gender: undefined,
    joined_date: "",
    last_login: "",
    is_active: true,
  };
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.profile()
      .then((data) => setProfile(mapApiUser(data)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (data: ProfileFormData) => {
    const updated = await authService.updateProfile({
      full_name: data.name,
      email: data.email,
    });
    setProfile(mapApiUser(updated));
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profil Saya"
        description="Kelola informasi pribadi dan keamanan akun Anda"
        breadcrumbs={[{ label: "Profil" }]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4" />
            Keamanan
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="h-4 w-4" />
            Aktivitas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
          ) : profile ? (
            <div className="space-y-6">
              {isEditing ? (
                <EditProfileForm
                  profile={profile}
                  onSave={handleSaveProfile}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <ProfileInfoCard
                  profile={profile}
                  onEditClick={() => setIsEditing(true)}
                />
              )}
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="security">
          <div className="max-w-2xl">
            <ChangePasswordForm />
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <ActivityLogList logs={[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
