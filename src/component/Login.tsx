import { useFormik } from "formik";
import { loginSchema } from "../schemas/LoginSchema";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../app/reducers/authSlice";
import { AppDispatch, RootState } from "../app/store";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect } from "react";

const initialValues = {
  email: "",
  password: "",
};

export const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const accessToken = Cookies.get("accessToken");
  const { loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (accessToken) {
      navigate("/counter"); // Redirect if already logged in
    }
  }, []);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: loginSchema,
      onSubmit: async (values, action) => {
        const credentials = { email: values.email, password: values.password };
        const result = await dispatch(userLogin(credentials)).unwrap();

        if (result?.status) {
          action.resetForm();
          navigate("/counter");
        }
      },
    });

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group custom-form">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              autoComplete="off"
              id="txtemail"
              name="email"
              aria-describedby="emailHelp"
              placeholder="Enter email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email ? (
              <p className="text-danger">{errors.email}</p>
            ) : null}
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              autoComplete="off"
              className="form-control"
              id="txtpassword"
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && touched.password ? (
              <p className="text-danger">{errors.password}</p>
            ) : null}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mt-4"
            disabled={loading}
          >
            {loading ? "Login..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};
