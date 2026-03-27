import { useState } from "react";
import { axioInstance } from "../../api/config.js";
import { AuthLayout } from "../authLayout/AuthLayout.jsx";
import { ToastContainer } from "react-toastify";
export function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    setError("");
    try {
      const res = await axioInstance.post("/user/forget-password", { email });
      console.log(res);

      if (res.status === 200) {
        setMessage(res.data.message);
      } else {
        setError(res.data.message || "حدث خطأ");
      }
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthLayout headerTitle="نسيت كلمة المرور">
      <div>
        <h2>نسيت كلمة المرور</h2>
        <form onSubmit={handleSubmit}>
          <ToastContainer />
          <input
            className="w-full h-12 px-3 border rounded-md"
            onChange={(e) => setEmail(e.target.value)}
            // onBlur={() => handleBlur("email")}
            placeholder="ادخل بريدك الالكتروني"
            name="email"
            type="email"
            required
            value={email}
            style={{ borderColor: "oklch(70.7% 0.022 261.325)" }}
          />
          <button
            type="submit"
            className="w-full py-3 mt-4 font-semibold transition-colors rounded-md colorBtn"
          >
            إرسال رابط إعادة التعيين
          </button>
        </form>
        {loading ? (
          <p>جار التحميل...</p>
        ) : (
          <>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </>
        )}
      </div>
    </AuthLayout>
  );
}
