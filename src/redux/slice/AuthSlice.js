import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, register } from "./authThunk";

import { apiClient } from "../../lib/api-client";

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (token, thunkAPI) => {
    try {
      const { data, status } = await apiClient.get("/api/v1/auth/validate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!(data.success && status === 200)) {
        throw new Error("Invalid token");
      }

      return data.success;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const initialState = {
  isAuthenticated: false,
  loading: false,
  token: localStorage.getItem("accessToken") || null,
  hasCheckedAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("accessToken", action.payload)
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
    }
  },
  extraReducers: (builder) => {
    builder
      // 🔄 While token is being verified
      .addCase(verifyToken.pending, (state) => {
        state.loading = true; // Show loading state
      })

      // ✅ If token is valid
      .addCase(verifyToken.fulfilled, (state) => {
        state.isAuthenticated = true;   // Mark as authenticated
        state.loading = false;          // Done loading
        state.hasCheckedAuth = true;    // Mark check complete
      })

      // ❌ If token is invalid or request fails
      .addCase(verifyToken.rejected, (state) => {
        state.token = null;                     // Clear token
        state.isAuthenticated = false;          // Mark as not authenticated
        state.loading = false;                  // Done loading
        state.hasCheckedAuth = true;            // Mark check complete
        localStorage.removeItem("accessToken"); // Remove token from localStorage
      })

      // Login Thunk
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.accessToken;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
      })

      // Register Thunk
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        // Depending on backend, registration might auto-login or require separate login
        // For now, we'll assume it doesn't auto-login unless specified
      })
      .addCase(register.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
