import { signOut } from '@/lib/appwrite';
import useAuthStore from '@/store/auth.store';
import { CustomButtonProps } from '@/type';
import cn from 'clsx';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View, type ImageSourcePropType } from 'react-native';

const Logout = ({
  onPress,
  title="Click Me",
  style,
  textStyle,
  leftIcon,
  isLoading = false,
} : CustomButtonProps ) => {
  const iconSource = (typeof leftIcon === 'number' ? leftIcon : undefined) as ImageSourcePropType | undefined;

  const { setIsAuthenticated, setUser } = useAuthStore();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogout = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      router.replace('/sign-in');
      setIsSigningOut(false);
    }
  };

  const loading = isLoading || isSigningOut;

  return (
    <TouchableOpacity
      className={cn('logout-btn', style)}
      onPress={onPress ?? handleLogout}
      disabled={loading}
      activeOpacity={0.8}
    >
      <View className='flex-center flex-row gap-2'>
        {!loading && iconSource && (
          <Image
            source={iconSource}
            resizeMode="contain"
            style={{ width: 30, height: 30, marginRight: 8, tintColor: "#9D2235" }}
          />
        )}

        {loading ? (
          <ActivityIndicator size="small" color="#9D2235" />
        ) : (
          <Text className={cn('text-primary h3-bold', textStyle)}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default Logout