import React, { useContext, useState } from "react";
import loginBackground from "../../assets/dual.jpeg";
import logo from "../../assets/logo.jpeg";
import "./login.css";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../../context/Auth/AuthContext";
import { useFormValidation } from "@/hooks/useFormValidation";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const { values, errors, touched, handleChange, handleBlur, validateForm } =
    useFormValidation({
      email: "",
      password: "",
    });
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (validateForm()) {
        login(values);
      }
    } catch (err) {
      toast.error(err.message || "فشل في تسجيل الدخول");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <>
      <div className="flex flex-col h-full bg-gray-50 md:flex-row">
        {/* Left side - Header + Login Form */}
        <div className="flex flex-col w-full p-4 md:w-1/2 sm:p-6 lg:p-8">
          <div>
            <div className="flex justify-start mb-2">
              <img src={logo} alt="logo" width={50} className="ml-3" />
              <h2 className="mt-3 text-xl">جمعية رؤى للتنمية بالمشاركة </h2>
            </div>
            <h1 className="text-2xl font-bold text-primary text-right">
              الوحدة الاقليمية للتعليم والتدريب الفنى المزدوج
            </h1>
          </div>
          <div className="flex items-center justify-center w-full max-w-md mx-auto mt-25">
            <div className="w-full p-12 bg-white bg-opacity-90 rounded-xl shadow-lg">
              <h2
                className="mb-6 text-2xl font-bold text-center"
                style={{ color: "var(--text-dark)" }}
              >
                تسجيل الدخول
              </h2>
              <ToastContainer />
              <form onSubmit={handleLogin}>
                {/* Email */}
                <div className="mb-4">
                  <label
                    className="block mb-1 text-lg"
                    style={{ color: "var(--text-dark)" }}
                  >
                    الايميل
                  </label>
                  <input
                    className="w-full h-12 px-3 border rounded-md"
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="ادخل بريدك الالكتروني"
                    name="email"
                    type="email"
                    value={values.email}
                    style={{ borderColor: "oklch(70.7% 0.022 261.325)" }}
                  />
                  {touched.email && errors.email && (
                    <div className="error">{errors.email}</div>
                  )}
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label
                    className="block mb-1 text-lg"
                    style={{ color: "var(--text-dark)" }}
                  >
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      className="w-full h-12  border rounded-md pr-3"
                      onChange={(e) => handleChange("password", e.target.value)}
                      onBlur={() => handleBlur("password")}
                      placeholder="ادخل كلمه المرور"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={values.password}
                      style={{ borderColor: "oklch(70.7% 0.022 261.325)" }}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 left-0 flex items-center p px-3 text-gray-500 focus:outline-none"
                      onClick={togglePasswordVisibility}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <Eye color="#737373" /> : <EyeOff color="#737373" />}
                    </button>
                  </div>

                  {touched.password && errors.password && (
                    <div className="error">{errors.password}</div>
                  )}
                </div>
                <div className="flex items-center justify-end mb-4">
                  <Link to="/forgot-password">نسيت كلمة المرور؟</Link>
                </div>

                {/* Login Button */}
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

        {/* Right side - Image only (hidden on mobile) */}
        <div className="hidden  md:block md:w-1/2 ">
          <img
            src={loginBackground}
            alt="login"
            className="object-cover h-full w-full "
          />
        </div>
      </div>
    </>
  );
}
