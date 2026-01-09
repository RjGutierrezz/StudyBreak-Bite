import CustomHeader from '@/components/CustomHeader'
import { images } from '@/constants'
import React from 'react'
import { FlatList, Image, SafeAreaView, Text, View } from 'react-native'

const Summer = () => {
  return (
    <SafeAreaView className='bg-background-100 h-full'>
      <FlatList 
          data={[]}
          renderItem={() => null}
          contentContainerClassName='pb-28 px-5 pt-5'
          ListHeaderComponent={() => <CustomHeader showSearch={false} /> }
          ListFooterComponent={
            <View className='gap-5'>
              <View>
                <Text className='h1-bold'>
                  Burger
                </Text>
                <Text className='text-gray-100 mt-5'>
                  Cheese Burger
                </Text>
                <View className='flex flex-row items-center gap-x-3"'>
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <Image 
                        key={index}
                        source={images.star} 
                        className='w-5 h-5'  
                        resizeMode='contain'
                      />
                    ))
                  }
                    <Text className=''>4.9/5</Text>
                </View>


              </View>
            </View>
          }
      />
    </SafeAreaView>
  )
}

export default Summer