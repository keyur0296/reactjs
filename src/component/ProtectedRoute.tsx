import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { getUser } from "../app/reducers/authSlice";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Navbar from "./Navbar";

const ProtectedRoute = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [isFetching, setIsFetching] = useState(true);
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const getUserDetails = async () => {
      if (accessToken && !user) {
        try {
          await dispatch(getUser(accessToken)).unwrap();
        } catch (error) {
          console.error("Failed to get user", error);
        }
      }
      setIsFetching(false);
    };

    getUserDetails();
  }, [dispatch, accessToken, user]);

  if (loading || isFetching) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return user ? (
    <>
      <Navbar />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
