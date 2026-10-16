// Layout.jsx
import { Outlet } from "react-router-dom";
import { useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useGetUserPhoto } from "../hooks/userPhoto/useGetUserPhoto";
import { useUpdateUserPhoto } from "../hooks/userPhoto/useUpdateUserPhoto";
import { useLocation, useNavigate } from "react-router-dom";
import AppShell from "./AppShell";

const PAGE_TITLES = {
  "/leases": "Arriendos",
  "/visits": "Visitas",
  "/help": "Ayuda",
  "/warehouses": "Bodegas",
  "/clients": "Clientes",
  "/tickets": "Tickets",
  "/monitor": "Registros",
  "/regulation": "Reglamento",
};

{/* <div className="mb-8">
  <div className="flex items-center gap-3 mb-2">
    <div className="w-12 h-12 rounded-lg bg-[#4bae52] flex items-center justify-center">
      <Mail size={24} className="text-white" />
    </div>

    <div>
      <h1 className="text-2xl text-white">Programación de Correos</h1>
      <p className="text-white/60 text-sm">
        Gestiona los correos automatizados para tus clientes
      </p>
    </div>
  </div>
</div> */}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { user, userId, logout, isBootstrapping } = useAuth();
  const { userPhoto, isLoadingPhoto } = useGetUserPhoto(userId);
  const { updatePhoto, isUpdatingPhoto } = useUpdateUserPhoto();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleEditPhoto = () => {
    if (isUpdatingPhoto) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      await updatePhoto({ userId: user.id, file: file });
    } catch (error) {
      console.error("Error al subir la foto:", error);
      alert("No se pudo actualizar la foto de perfil, la foto debe contener un rostro claro, bien iluminado y de frente.");
    } finally {
      event.target.value = "";
    }
  };

  const title = PAGE_TITLES[location.pathname] || "Panel";

  if (isBootstrapping) {
    return <div className="p-6">Cargando sesión...</div>;
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUpdatingPhoto}
      />

      <AppShell
        title={title}
        isLoadingPhoto={isLoadingPhoto || isUpdatingPhoto}
        user={user}
        userPhoto={userPhoto}
        onEdit={handleEditPhoto}
        onLogout={handleLogout}
      >
        <Outlet />
      </AppShell>
    </>
  );
}