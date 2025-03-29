import { useFormik } from "formik";
import { signUpSchema } from "../schemas/SignUpSchema";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userSignUp } from "../app/reducers/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirm_password: "",
};

export const Register: React.FC = () => {
  const accessToken = Cookies.get("accessToken");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      if (accessToken) {
        navigate("/counter"); // Redirect if already logged in
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, []);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: signUpSchema,
      onSubmit: async (values, action) => {
        const userDetails = {
          name: values.name,
          email: values.email,
          password: values.password,
          confirm_password: values.confirm_password,
        };
        const result = await dispatch(userSignUp(userDetails)).unwrap();

        if (result?.status) {
          action.resetForm();
          navigate("/counter");
        }
      },
    });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group custom-form">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              id="txtname"
              name="name"
              aria-describedby="emailHelp"
              placeholder="Enter your name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && touched.name ? (
              <p className="text-danger">{errors.name}</p>
            ) : null}
          </div>
          <div className="form-group custom-form mt-3">
            <label>Email</label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              id="txtemail"
              name="email"
              aria-describedby="emailHelp"
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && touched.password ? (
              <p className="text-danger">{errors.password}</p>
            ) : null}
          </div>

          <div className="form-group mt-3">
            <label>Confrim Password</label>
            <input
              type="password"
              autoComplete="off"
              className="form-control"
              id="txtconfirmpassword"
              name="confirm_password"
              placeholder="Enter your confirm password"
              value={values.confirm_password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.confirm_password && touched.confirm_password ? (
              <p className="text-danger">{errors.confirm_password}</p>
            ) : null}
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-4">
            Sign Up
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};
