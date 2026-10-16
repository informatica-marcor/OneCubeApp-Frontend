import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNav from "./BottomNav";

export default function AppShell({
  title,
  isLoadingPhoto,
  user,
  userPhoto,
  onEdit,
  onLogout,
  children,
}) {
  if (!user) return null;
  return (
    <div className="h-screen overflow-hidden bg-slate-100">
      <div className="flex h-full overflow-hidden">
        <Sidebar role={user?.role} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header title={title} isLoadingPhoto={isLoadingPhoto} user={user} userPhoto={userPhoto} onEdit={onEdit} onLogout={onLogout} />

          <main className="min-h-0 overflow-y-auto flex-1 px-4 py-4 md:px-8 md:py-8 pb-24 md:pb-8">
            {children}
          </main>
        </div>
      </div>

      <BottomNav role={user?.role} />
    </div>
  );
}