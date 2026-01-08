import { CustomButtonProps } from '@/type';
import cn from 'clsx';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface EditProfileProps extends CustomButtonProps {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfile = ({
  onPress,
  title = "Click Me",
  style,
  textStyle,
  isEditing,
  setIsEditing,
  leftIcon,
  isLoading = false
}: EditProfileProps) => {
  const handlePress = () => {
    if (onPress) return onPress();
    setIsEditing((prev) => !prev);
  };

  return (
    <TouchableOpacity
      className={cn('editprofile-btn', style)}
      onPress={handlePress}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      {leftIcon}

      <View className='flex-center flex-row'>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text className={cn('text-[#003049] h3-bold', textStyle)}>
            {isEditing ? 'Save Changes' : title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default EditProfile