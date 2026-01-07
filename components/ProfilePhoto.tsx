import { images } from '@/constants'
import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'

const ProfilePhoto = () => {
  return (
    <TouchableOpacity onPress={() => {}}>
      <Image source={images.businessman} resizeMode="contain" className="profile-avatar" />
      <View className='profile-edit'>
        <Image source={images.pencil} resizeMode='contain' className='size-5'/>
      </View>
    </TouchableOpacity>
  )
}

export default ProfilePhoto