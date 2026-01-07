import { CustomButtonProps } from '@/type';
import cn from 'clsx';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

const EditProfile = ({
  onPress,
  title="Click Me",
  style,
  textStyle,
  leftIcon,
  isLoading = false
} : CustomButtonProps ) => {
  return (
    <TouchableOpacity className={cn('editprofile-btn', style)} onPress={onPress}>
      {leftIcon}

      <View className='flex-center flex-row'>
        {isLoading ? (
          <ActivityIndicator size ="small" color="white"/>
        ): (
          <Text className={cn('text-[#32a852] h3-bold', textStyle)}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default EditProfile