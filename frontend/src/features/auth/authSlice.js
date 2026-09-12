import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunks
export const registerUser = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/register", payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const loginUser = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/auth/me");
    return data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await api.post("/auth/logout");
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const initialState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("accessToken") || null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;
      if (user) localStorage.setItem("user", JSON.stringify(user));
      if (accessToken) localStorage.setItem("accessToken", accessToken);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // fetchMe
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      })
      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      });
  },
});

export const { setCredentials, logout, clearError } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.user?.role;
