import { useState, useEffect } from "react";

const DRAWER_STORAGE_KEY = "conectar-drawer-open";

export default function useDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedPreference = localStorage.getItem(DRAWER_STORAGE_KEY);
    if (savedPreference !== null) {
      setIsOpen(JSON.parse(savedPreference));
    }
  }, []);

  const toggleDrawer = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem(DRAWER_STORAGE_KEY, JSON.stringify(newState));
  };

  const openDrawer = () => {
    setIsOpen(true);
    localStorage.setItem(DRAWER_STORAGE_KEY, JSON.stringify(true));
  };

  const closeDrawer = () => {
    setIsOpen(false);
    localStorage.setItem(DRAWER_STORAGE_KEY, JSON.stringify(false));
  };

  const clearDrawerState = () => {
    setIsOpen(false);
    localStorage.removeItem(DRAWER_STORAGE_KEY);
  };

  return {
    isOpen,
    toggleDrawer,
    openDrawer,
    closeDrawer,
    clearDrawerState,
  };
}
