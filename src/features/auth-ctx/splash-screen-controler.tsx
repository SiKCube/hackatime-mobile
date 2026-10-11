import { SplashScreen } from 'expo-router';
import { useAuthCtx } from './auth-ctx-provider';

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { loading } = useAuthCtx()

  if (!loading) {
    SplashScreen.hide();
  }

  return null;
}
