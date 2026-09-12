import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchThemes, fetchMyTheme } from "../../features/theme/themeSlice";
import { applyThemeToDOM } from "../../utils/themeDefinitions";

export default function ThemeProvider({ children }) {
  const dispatch = useDispatch();
  const { currentTheme, currentKey } = useSelector((s) => s.theme);
  const { isAuthenticated } = useSelector((s) => s.auth);

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    if (currentTheme) applyThemeToDOM(currentTheme);
  }, [currentTheme, currentKey]);

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
