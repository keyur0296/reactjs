import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  loading: boolean;
  user: User | null;
  error: string | null;
}

interface UserLoginCredentials {
  email: string;
  password: string;
}

interface UserSignUpDetails {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface AuthResponse {
  status: boolean;
  message: string;
  data: {
    accessToken?: string;
    refreshToken?: string;
    user: User;
  };
}

const initialState: UserState = {
  loading: false,
  user: null,
  error: null,
};

// Utility function for error handling
const handleApiError = (error: unknown, thunkAPI: any) => {
  if (axios.isAxiosError(error)) {
    console.error("Axios error:", error);
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "API error"
    );
  }
  console.error("Unexpected error:", error);
  return thunkAPI.rejectWithValue("An unexpected error occurred");
};

// Async Thunks
export const userSignUp = createAsyncThunk(
  "user/signUp",
  async (data: UserSignUpDetails, thunkAPI) => {
    try {
      const response = await axios.post<AuthResponse>(
        "http://localhost:8000/api/auth/signup",
        {
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirm_password,
        }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, thunkAPI);
    }
  }
);

export const userLogin = createAsyncThunk(
  "user/login",
  async (data: UserLoginCredentials, thunkAPI) => {
    try {
      const response = await axios.post<AuthResponse>(
        "http://localhost:8000/api/auth/login",
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, thunkAPI);
    }
  }
);

export const getUser = createAsyncThunk(
  "user/getUser",
  async (accessToken: string, thunkAPI) => {
    try {
      const response = await axios.get<{ status: boolean; data: User }>(
        "http://localhost:8000/api/get-user",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, thunkAPI);
    }
  }
);

// Redux Slice
export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.loading = false;
      state.user = null;
      state.error = null;

      localStorage.removeItem("user");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");

      toast.info("Logged out successfully");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userSignUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userSignUp.fulfilled, (state, action) => {
        const { accessToken, refreshToken, user } = action.payload.data;
        state.loading = false;
        state.user = user;
        state.error = null;

        if (accessToken)
          Cookies.set("accessToken", accessToken, { expires: 7 });
        if (refreshToken)
          Cookies.set("refreshToken", refreshToken, { expires: 7 });

        toast.success("Sign Up Successful");
      })
      .addCase(userSignUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      })
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        const { accessToken, refreshToken, user } = action.payload.data;
        state.loading = false;
        state.user = user;
        state.error = null;

        if (accessToken)
          Cookies.set("accessToken", accessToken, { expires: 7 });
        if (refreshToken)
          Cookies.set("refreshToken", refreshToken, { expires: 7 });

        toast.success("Login Successful");
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.data;
      });
  },
});

export default authSlice.reducer;
export const { logout } = authSlice.actions;
