import CustomHeader from '@/components/CustomHeader'
import Logout from '@/components/Logout'
import ProfilePhoto from '@/components/ProfilePhoto'
import { images } from '@/constants'
import React from 'react'
import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'



const styles = StyleSheet.create({
  infoIcon: {
    width: 25,
    height: 25,
  },
})



const Profile = () => {
  return (
    <SafeAreaView className='bg-background-100 h-full'>
      <FlatList 
        data={[]}
        renderItem={() => null}
        contentContainerClassName='pb-28 px-5 pt-5'
        ListHeaderComponent={() => <CustomHeader title="Profile"/>} 
        ListFooterComponent={() => 
          <View className='gap-5'>
            <View className='flex items-center justify-center'>
              <ProfilePhoto />
            </View>
            <View className='mt-6 border-white p-5 rounded-2xl bg-white'>
              
              <View className="flex flex-row items-center gap-x-3">
                <View   
                    style={{
                      borderWidth: 2, 
                      borderColor: "#9D2235", 
                      backgroundColor: "#fcd9df",
                      borderRadius: 50, 
                      padding: 8, 
                    }}
                  >
                  <Image 
                    source={images.user} 
                    resizeMode='contain'
                    style={[styles.infoIcon, { tintColor: "#9D2235" }]}
                  />
                </View>

                <View>
                  <Text className="text-gray-100">Full Name</Text>
                  <Text className="base-semibold ">RJ Gutierrez</Text>
                </View>
              </View>


              <View className="flex flex-row items-center gap-x-3 mt-5">
                <View   
                  style={{
                    borderWidth: 2, 
                    borderColor: "#9D2235", 
                    backgroundColor: "#fcd9df",
                    borderRadius: 50, 
                    padding: 8, 
                  }}
                >
                  <Image source={images.envelope} 
                    resizeMode="contain" 
                    style={[styles.infoIcon, { tintColor: "#9D2235" }]}
                  />
                </View>

                <View>
                  <Text className="text-gray-100">
                    Email
                  </Text>
                  <Text className="base-semibold ">rovergutierrez007@gmail.com</Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-x-3 mt-5">
                <View   
                    style={{
                      borderWidth: 2, 
                      borderColor: "#9D2235", 
                      backgroundColor: "#fcd9df",
                      borderRadius: 50, 
                      padding: 8, 
                    }}
                  >
                  <Image  
                    source={images.phone} 
                    resizeMode="contain" 
                    style={[styles.infoIcon, { tintColor: "#9D2235" }]}
                  />
                </View>

                <View>
                  <Text className="text-gray-100">
                    Phone number
                  </Text>
                  <Text className="base-semibold ">+1 707 304 1388</Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-x-3 mt-5">
                <View   
                    style={{
                      borderWidth: 2, 
                      borderColor: "#9D2235", 
                      backgroundColor: "#fcd9df",
                      borderRadius: 50, 
                      padding: 8, 
                    }}
                  >
                  <Image 
                    source={images.location} 
                    resizeMode="contain" 
                    style={[styles.infoIcon, { tintColor: "#9D2235" }]}
                  />
                </View>

                <View>
                  <Text className="text-gray-100">
                    Address
                  </Text>
                  <Text className="base-semibold ">Sacramento, CA</Text>
                </View>
              </View>

            </View>
            {/* <EditProfile title='Edit Profile'/> */}
            <Logout 
              title='Logout'
              leftIcon={images.logout}
            />
          </View>
        }
      />
    </SafeAreaView>
  )
}

export default Profile
