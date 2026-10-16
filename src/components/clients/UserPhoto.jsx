import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { useGetUserPhoto } from "../hooks/userPhoto/useGetUserPhoto";

export default function UserPhoto({
    userId,
    alt = "Foto de perfil",
    className = "",
    iconClassName = "",
    roundedClassName = "rounded-[16px]",
}) {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let objectUrl = null;

        const loadPhoto = async () => {
            if (!userId) {
                setImageUrl(null);
                setHasError(true);
                return;
            }

            try {
                setLoading(true);
                setHasError(false);

                const blob = await useGetUserPhoto(userId);
                objectUrl = URL.createObjectURL(blob);
                setImageUrl(objectUrl);
            } catch (error) {
                setImageUrl(null);
                setHasError(true);
            } finally {
                setLoading(false);
            }
        };

        loadPhoto();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [userId]);

    if (loading || hasError || !imageUrl) {
        return (
            <div
                className={`flex items-center justify-center border border-[#D0D5DD] bg-white ${roundedClassName} ${className}`}
            >
                <UserRound className={`text-[#6B7280] ${iconClassName}`} strokeWidth={1.75} />
            </div>
        );
    }

    return (
        <img
            src={imageUrl}
            alt={alt}
            className={`object-cover border border-[#D0D5DD] bg-white ${roundedClassName} ${className}`}
        />
    );
}