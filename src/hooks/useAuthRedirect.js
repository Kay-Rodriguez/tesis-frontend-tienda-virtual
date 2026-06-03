import { useNavigate } from "react-router-dom";

export function useAuthRedirect() {
  const navigate = useNavigate();

  const redirectByRole = (user) => {
    const role = user?.role?.toLowerCase?.();

    if (role === "admin" || role === "administrador") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return { redirectByRole };
}