import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../lib/api-client";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "../../utils/constrants";

export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(LOGIN_ROUTE, credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(REGISTER_ROUTE, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);
