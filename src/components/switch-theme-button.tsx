import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from './theme/theme-provider';

export default function SwitchThemeButton() {
  const { mode, toggleColorMode } = useTheme();

  return (
    <IconButton onClick={toggleColorMode} color="inherit">
      {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}
