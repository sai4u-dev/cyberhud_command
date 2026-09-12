import Theme from "../models/Theme.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAllThemes = async (req, res, next) => {
  try {
    const themes = await Theme.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.status(200).json(new ApiResponse(200, { themes }, "Themes fetched"));
  } catch (err) {
    next(err);
  }
};

export const getThemeByKey = async (req, res, next) => {
  try {
    const theme = await Theme.findOne({ key: req.params.key, isActive: true });
    if (!theme) throw new ApiError(404, "Theme not found");
    res.status(200).json(new ApiResponse(200, { theme }, "Theme fetched"));
  } catch (err) {
    next(err);
  }
};

// User: get own theme settings
export const getMyTheme = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("selectedTheme");
    const themeKey = user.themeKey || user.settings.theme || "cyber-neon";
    const theme = await Theme.findOne({ key: themeKey });
    res.status(200).json(new ApiResponse(200, { theme, themeKey, settings: user.settings }, "Current theme fetched"));
  } catch (err) {
    next(err);
  }
};

// User: update own theme (integrated with MongoDB)
export const updateMyTheme = async (req, res, next) => {
  try {
    const { themeKey } = req.body;
    if (!themeKey) throw new ApiError(400, "themeKey is required");

    const theme = await Theme.findOne({ key: themeKey, isActive: true });
    if (!theme) throw new ApiError(404, "Theme not found or inactive");

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        selectedTheme: theme._id,
        themeKey: theme.key,
        "settings.theme": theme.key,
      },
      { new: true }
    ).populate("selectedTheme");

    res.status(200).json(new ApiResponse(200, { user: user.toSafeObject(), theme }, "Theme updated"));
  } catch (err) {
    next(err);
  }
};

// User: update settings (theme included)
export const updateMySettings = async (req, res, next) => {
  try {
    const { settings } = req.body;
    if (!settings) throw new ApiError(400, "settings object required");

    // If theme is being changed, validate it
    if (settings.theme) {
      const theme = await Theme.findOne({ key: settings.theme, isActive: true });
      if (!theme) throw new ApiError(404, "Theme not found");
    }

    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    // Deep merge settings
    // For simplicity, shallow merge top-level keys, deep for nested objects
    const merge = (target, source) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
          target[key] = target[key] || {};
          merge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    };

    merge(user.settings, settings);
    if (settings.theme) {
      const themeDoc = await Theme.findOne({ key: settings.theme });
      user.themeKey = settings.theme;
      user.selectedTheme = themeDoc?._id || null;
    }

    await user.save();
    await user.populate("selectedTheme");

    res.status(200).json(new ApiResponse(200, { user: user.toSafeObject(), settings: user.settings }, "Settings updated"));
  } catch (err) {
    next(err);
  }
};

// Admin: create theme
export const createTheme = async (req, res, next) => {
  try {
    const { key, name, colors, description, preview, order } = req.body;
    if (!key || !name || !colors) throw new ApiError(400, "key, name, colors are required");

    const exists = await Theme.findOne({ key });
    if (exists) throw new ApiError(409, "Theme key already exists");

    const theme = await Theme.create({ key, name, colors, description, preview, order });
    res.status(201).json(new ApiResponse(201, { theme }, "Theme created"));
  } catch (err) {
    next(err);
  }
};

// Admin: update theme
export const updateTheme = async (req, res, next) => {
  try {
    const theme = await Theme.findOneAndUpdate({ key: req.params.key }, req.body, { new: true, runValidators: true });
    if (!theme) throw new ApiError(404, "Theme not found");
    res.status(200).json(new ApiResponse(200, { theme }, "Theme updated"));
  } catch (err) {
    next(err);
  }
};

// Admin: delete (soft)
export const deleteTheme = async (req, res, next) => {
  try {
    const theme = await Theme.findOneAndUpdate({ key: req.params.key }, { isActive: false }, { new: true });
    if (!theme) throw new ApiError(404, "Theme not found");
    res.status(200).json(new ApiResponse(200, { theme }, "Theme deactivated"));
  } catch (err) {
    next(err);
  }
};
