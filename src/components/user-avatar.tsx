import { Avatar } from "@mui/material";
import { useAuth } from "@/services/auth";

interface UserAvatarProps {
  size?: number;
  sx?: any;
  [key: string]: any;
}

export default function UserAvatar({
  size = 40,
  sx,
  ...props
}: UserAvatarProps) {
  const { user } = useAuth();

  return (
    <Avatar
      src={user?.photo?.path}
      alt={`${user?.firstName} ${user?.lastName}`}
      sx={{
        width: size,
        height: size,
        bgcolor: "primary.main",
        color: "white",
        fontWeight: "bold",
        fontSize: size <= 24 ? "0.75rem" : "1rem",
        ...sx,
      }}
      {...props}
    >
      {user?.firstName?.charAt(0)?.toUpperCase()}
    </Avatar>
  );
}
