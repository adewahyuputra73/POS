"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Lock, Activity } from "lucide-react";
import {
  ProfileInfoCard,
  EditProfileForm,
  ChangePasswordForm,
  ActivityLogList,
} from "@/features/profile/components";
import {
  mockUserProfile,
  mockActivityLogs,
  ProfileFormData,
} from "@/features/profile";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockUserProfile);

  const handleSaveProfile = (data: ProfileFormData) => {
    setProfile((prev) => ({
      ...prev,
      ...data,
    }));
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
        </TabsContent>

        <TabsContent value="security">
          <div className="max-w-2xl">
            <ChangePasswordForm />
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <ActivityLogList logs={mockActivityLogs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
