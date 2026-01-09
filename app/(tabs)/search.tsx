import CartButton from '@/components/CartButton'
import Filter from '@/components/Filter'
import MenuCard from '@/components/MenuCard'
import SearchBar from '@/components/SearchBar'
import { images } from '@/constants'
import { getCategories, getMenu } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import { MenuItem } from '@/type'
import cn from 'clsx'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { FlatList, Image, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Search = () => {

  const {category, query} = useLocalSearchParams<{query: string; category: string}>()

  const { data, refetch, loading }= useAppwrite({
    fn: getMenu, 
    params: {
      category,
      query,
      limit: 6,
    }
  })

  // for reupdate the data if category or query changes
  useEffect(() => {
    refetch({category, query, limit: 6})
  }, [category, query])

  const {data: categories} = useAppwrite({fn: getCategories});

  return (
    <SafeAreaView className='bg-background-100 h-full'>
      <FlatList data={data} renderItem={({item, index}) => {

        // To cascade the items
        const isFirstRightColItem = index % 2 === 0;

        return (
          <View className={cn('flex-1 max-w-[48%]', !isFirstRightColItem ? 'mt-10' : 'mt-0')}>
            <MenuCard item={item as unknown as MenuItem}/>
          </View>
        )
      }} 
      keyExtractor={item => item.$id}
      numColumns={2}
      columnWrapperClassName='gap-7'
      contentContainerClassName='gap-7 px-5 pb-32'
      ListHeaderComponent={() => (
        <View className='my-5 gap-5'>
          <View className='flex-between flex-row w-full'>
            <View className='flex-start'>
              <Text className='small-bold uppercase text-primary'>Search</Text>
              <View className='flex-start flex-row gap-x-1 mt-0.5'>
                <Text className='paragraph-semibold text-dark-100'>Find your perfect study break meal!</Text>
              </View>
            </View>

            <CartButton />
          </View>

          {/* Search bar configurations */}
          <SearchBar/>

          {/* Filter functionality */}
          <Filter categories={categories!}/>
        </View>
      )}

      ListEmptyComponent={() => !loading && (
        <View className='flex items-center justify-center mt-10'>
          <Image source={images.emptyState} 
          className="w-40 h-40 mb-4" // Adjust width, height, and margin as needed
          resizeMode="contain"
          />
          <Text>Well this is awkward 😰 No result found.</Text>
        </View>
        )
      }
      />
      {/* Used to seed our database <Button title="Seed" onPress={() => seed().catch((error) => console.log('Failed to seed the database', error))} /> */} 
    </SafeAreaView>
  )
}

export default Search