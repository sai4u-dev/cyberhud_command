import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchThemes, fetchMyTheme } from "../../features/theme/themeSlice";
import { applyThemeToDOM } from "../../utils/themeDefinitions";
import soundManager from "../../utils/soundManager";

export default function ThemeProvider({ children }) {
  const dispatch = useDispatch();
  const { currentTheme, currentKey } = useSelector((s) => s.theme);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const sound = useSelector((s) => s.theme.settings?.sound);

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    if (currentTheme) applyThemeToDOM(currentTheme);
  }, [currentTheme, currentKey]);
  useEffect(() => {
    if (sound) {
      soundManager.setVolumes({ master: sound.master, sfx: sound.sfx, music: sound.music });
      // Auto music handling
      if (sound.music > 0) soundManager.startMusic();
      else soundManager.stopMusic();
    }
  }, [sound?.master, sound?.sfx, sound?.music]);

  // Fetch themes from MongoDB on mount
  useEffect(() => {
    dispatch(fetchThemes());
  }, [dispatch]);

  // If authenticated, fetch user's saved theme
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyTheme());
    }
  }, [dispatch, isAuthenticated]);

  return children;
}
