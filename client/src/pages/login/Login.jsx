import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../../context/Auth/AuthContext";
import loginBackground from "../../assets/dual.jpeg";
import logo from "../../assets/logo.jpeg";
import { loginSchema } from "../../schemas/loginSchema";
import "./login.css";

export function Login() {
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  
  // Local state for form
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });

  // Validate a single field
  const validateField = (field, value) => {
    const validator = loginSchema[field];
    if (validator) {
      const result = validator(value);
      setErrors((prev) => ({ ...prev, [field]: result.isValid ? "" : result.error }));
      return result.isValid;
    }
    return true;
  };

  // Handle input change
  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  // Handle blur (mark as touched and validate)
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, values[field]);
  };

  // Validate entire form before submission
  const validateForm = () => {
    const emailValid = validateField("email", values.email);
    const passwordValid = validateField("password", values.password);
    // Mark all as touched to show errors
    setTouched({ email: true, password: true });
    return emailValid && passwordValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await login(values);
        // Redirect or success handled by AuthContext
      } catch (err) {
        toast.error(err.message || "فشل في تسجيل الدخول");
      }
    } else {
      toast.error("يرجى تصحيح الأخطاء في النموذج");
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="flex flex-col h-full bg-gray-50 md:flex-row">
      {/* Left side */}
      <div className="flex flex-col w-full p-4 md:w-1/2 sm:p-6 lg:p-8">
        <div>
          <div className="flex justify-start mb-2">
            <img src={logo} alt="logo" width={50} className="ml-3" />
            <h2 className="mt-3 text-xl">جمعية رؤى للتنمية بالمشاركة</h2>
          </div>
          <h1 className="text-2xl font-bold text-primary text-right">
            الوحدة الاقليمية للتعليم والتدريب الفنى المزدوج
          </h1>
        </div>
        <div className="flex items-center justify-center w-full max-w-md mx-auto mt-25">
          <div className="w-full p-12 bg-white bg-opacity-90 rounded-xl shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-center" style={{ color: "var(--text-dark)" }}>
              تسجيل الدخول
            </h2>
            <ToastContainer />
            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="mb-4">
                <label className="block mb-1 text-lg" style={{ color: "var(--text-dark)" }}>
                  الايميل
                </label>
                <input
                  className="w-full h-12 px-3 border rounded-md"
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="ادخل بريدك الالكتروني"
                  type="email"
                  value={values.email}
                  style={{ borderColor: "oklch(70.7% 0.022 261.325)" }}
                />
                {touched.email && errors.email && (
                  <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                )}
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block mb-1 text-lg" style={{ color: "var(--text-dark)" }}>
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    className="w-full h-12 border rounded-md pr-3"
                    onChange={(e) => handleChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    placeholder="ادخل كلمه المرور"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    style={{ borderColor: "oklch(70.7% 0.022 261.325)" }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-500 focus:outline-none"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <Eye color="#737373" /> : <EyeOff color="#737373" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                )}
              </div>

              <div className="flex items-center justify-end mb-4">
                <Link to="/forgot-password">نسيت كلمة المرور؟</Link>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-4 font-semibold transition-colors rounded-md colorBtn"
              >
                تسجيل الدخول
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right side image */}
      <div className="hidden md:block md:w-1/2">
        <img src={loginBackground} alt="login" className="object-cover h-full w-full" />
      </div>
    </div>
  );
}