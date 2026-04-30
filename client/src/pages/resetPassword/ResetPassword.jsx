import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axioInstance } from "../../api/config.js";
import { AuthLayout } from "../authLayout/AuthLayout.jsx";
import { Eye, EyeOff } from "lucide-react";
export function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(false);
  const [email, setEmail] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axioInstance.post("user/verify-reset-token", {
          token,
        });
        if (res.data.valid) {
          setTokenValid(true);
          setEmail(res.data.email);
        } else {
          setError("الرمز غير صالح أو منتهي الصلاحية.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "فشل التحقق من الرمز.");
      }
    };
    if (token) verifyToken();
    else setError("لا يوجد رمز في الرابط.");
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (password !== confirmPassword) {
      setError("كلمة المرور غير متطابقة");
      return;
    }
    try {
      const res = await axioInstance.post("/user/reset-password", {
        token,
        password,
        confirmPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 3000); // التوجيه إلى صفحة الدخول بعد 3 ثوانٍ
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ");
    }
  };

  if (!tokenValid && !error) {
    return <div>جاري التحقق من الرابط...</div>;
  }
  return (
    <>
      <AuthLayout headerTitle="إعادة تعيين كلمة المرور">
        <div>
          <h2 className="pb-2">إعادة تعيين كلمة المرور</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {message && <p style={{ color: "green" }}>{message}</p>}
          {tokenValid && (
            <form onSubmit={handleSubmit}>
              {/* <ToastContainer /> */}
              <p className="pb-2">البريد الإلكتروني: {email}</p>
              <div className="relative">
                <input
                  className="w-full h-12 mt-3 border rounded-md pr-3"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة المرور الجديدة"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 flex items-center  px-3 text-gray-500 focus:outline-none"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Eye color="#848484" />
                  ) : (
                    <EyeOff color="#848484" />
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  className="w-full h-12 mt-2  border rounded-md pr-3"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="تأكيد كلمة المرور"
                  type={showConfirmPassword ? "text" : "password"}
                  name="password"
                  value={confirmPassword}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 flex items-center p px-3 text-gray-500 focus:outline-none"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <Eye color="#848484" />
                  ) : (
                    <EyeOff color="#848484" />
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="w-full py-3 mt-4 font-semibold transition-colors rounded-md colorBtn"
              >
                تحديث كلمة المرور
              </button>
            </form>
          )}
        </div>
      </AuthLayout>
    </>
  );
}
