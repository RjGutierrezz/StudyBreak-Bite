import { images } from '@/constants';
import React from 'react';
import { Image, View } from 'react-native';

type ProfilePhotoProps = {
  uri?: string;
};

const ProfilePhoto = ({ uri }: ProfilePhotoProps) => {
  const source = uri ? { uri } : images.businessman;

  return (
    <View>
      <Image source={source} resizeMode="contain" className="profile-avatar" />
      <View className='profile-edit'>
        <Image source={images.pencil} resizeMode='contain' className='size-5'/>
      </View>
    </View>
  )
}

export default ProfilePhoto