import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Thunks
export const fetchBattles = createAsyncThunk("battle/fetchAll", async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/battles", { params });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchMyBattles = createAsyncThunk("battle/fetchMy", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/battles/my");
    return data.data.battles;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchBattleById = createAsyncThunk("battle/fetchById", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/battles/${id}`);
    return data.data.battle;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const createBattle = createAsyncThunk("battle/create", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/battles", payload);
    return data.data.battle;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const joinBattle = createAsyncThunk("battle/join", async ({ id, password }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/battles/${id}/join`, { password });
    return data.data.battle;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const leaveBattle = createAsyncThunk("battle/leave", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/battles/${id}/leave`);
    return data.data.battle;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const startBattle = createAsyncThunk("battle/start", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/battles/${id}/start`);
    return data.data.battle;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const finishBattle = createAsyncThunk("battle/finish", async ({ id, winnerId }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/battles/${id}/finish`, { winnerId });
    return data.data.battle;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const battleSlice = createSlice({
  name: "battle",
  initialState: {
    battles: [],
    myBattles: [],
    currentBattle: null,
    pagination: null,
    status: "idle",
    error: null,
    actionStatus: "idle",
  },
  reducers: {
    clearCurrent: (state) => {
      state.currentBattle = null;
    },
    setCurrentBattle: (state, action) => {
      state.currentBattle = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBattles.pending, (state) => { state.status = "loading"; })
      .addCase(fetchBattles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.battles = action.payload.battles;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBattles.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; })

      .addCase(fetchMyBattles.fulfilled, (state, action) => { state.myBattles = action.payload; })

      .addCase(fetchBattleById.fulfilled, (state, action) => { state.currentBattle = action.payload; })

      .addCase(createBattle.fulfilled, (state, action) => {
        state.battles.unshift(action.payload);
        state.currentBattle = action.payload;
      })
      .addCase(joinBattle.fulfilled, (state, action) => {
        state.currentBattle = action.payload;
        state.battles = state.battles.map((b) => b._id === action.payload._id ? action.payload : b);
      })
      .addCase(startBattle.fulfilled, (state, action) => { state.currentBattle = action.payload; })
      .addCase(finishBattle.fulfilled, (state, action) => { state.currentBattle = action.payload; });
  },
});

export const { clearCurrent, setCurrentBattle } = battleSlice.actions;
export default battleSlice.reducer;
