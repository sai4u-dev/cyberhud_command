import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { THEMES, getThemeByKey, applyThemeToDOM } from "../../utils/themeDefinitions";

// Fetch all themes from MongoDB
export const fetchThemes = createAsyncThunk("theme/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/themes");
    return data.data.themes;
  } catch (err) {
    // fallback to local definitions if API fails (offline)
    return THEMES;
  }
});

// Fetch user's current theme (requires auth)
export const fetchMyTheme = createAsyncThunk("theme/fetchMy", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/themes/user/me");
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Update user's theme (persist to MongoDB)
export const updateMyTheme = createAsyncThunk("theme/updateMy", async (themeKey, { rejectWithValue }) => {
  try {
    const { data } = await api.patch("/themes/user/theme", { themeKey });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Update full settings including theme
export const updateSettings = createAsyncThunk("theme/updateSettings", async (settings, { rejectWithValue }) => {
  try {
    const { data } = await api.patch("/themes/user/settings", { settings });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const initialKey = localStorage.getItem("selectedTheme") || "cyber-neon";
const initialTheme = getThemeByKey(initialKey);

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    themes: THEMES, // start with local, then hydrate from DB
    currentKey: initialKey,
    currentTheme: initialTheme,
    settings: {
      theme: initialKey,
      notifications: { battleInvites: true, tournamentUpdates: true, marketing: false },
      sound: { master: 80, sfx: 80, music: 60 },
      graphics: { quality: "high", motion: true },
      privacy: { showStats: true, allowChallenges: true },
    },
    status: "idle",
    error: null,
  },
  reducers: {
    setLocalTheme: (state, action) => {
      const key = action.payload;
      const theme = getThemeByKey(key);
      state.currentKey = key;
      state.currentTheme = theme;
      state.settings.theme = key;
      applyThemeToDOM(theme);
    },
    applyTheme: (state, action) => {
      const theme = action.payload;
      state.currentTheme = theme;
      state.currentKey = theme.key;
      applyThemeToDOM(theme);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThemes.fulfilled, (state, action) => {
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.themes = action.payload;
          // re-apply current if it exists in fetched list
          const found = action.payload.find((t) => t.key === state.currentKey);
          if (found) state.currentTheme = found;
        }
      })
      .addCase(fetchMyTheme.fulfilled, (state, action) => {
        const { theme, themeKey, settings } = action.payload;
        if (theme) {
          state.currentTheme = theme;
          state.currentKey = themeKey;
          applyThemeToDOM(theme);
        }
        if (settings) state.settings = { ...state.settings, ...settings };
      })
      .addCase(updateMyTheme.fulfilled, (state, action) => {
        const { theme, user } = action.payload;
        if (theme) {
          state.currentTheme = theme;
          state.currentKey = theme.key;
          applyThemeToDOM(theme);
        }
        if (user?.settings) state.settings = user.settings;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        const { settings, user } = action.payload;
        if (settings) state.settings = settings;
        if (user?.themeKey) {
          const theme = getThemeByKey(user.themeKey);
          state.currentKey = user.themeKey;
          state.currentTheme = theme;
          applyThemeToDOM(theme);
        }
      });
  },
});

export const { setLocalTheme, applyTheme } = themeSlice.actions;
export default themeSlice.reducer;
