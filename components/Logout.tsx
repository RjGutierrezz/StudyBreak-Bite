import { CustomButtonProps } from '@/type';
import cn from 'clsx';
import React from 'react';
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

  return (
    <TouchableOpacity className={cn('logout-btn', style)} onPress={onPress}>
      <View className='flex-center flex-row gap-2'> 
        {iconSource && (
          <Image
            source={iconSource}
            resizeMode="contain"
            style={{ width: 30, height: 30, marginRight: 8, tintColor: "#9D2235" }} 
          />
        )}
        {isLoading ? (
          <ActivityIndicator size ="small" color="white"/>
        ): (
          <Text className={cn('text-primary h3-bold', textStyle)}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default Logout