import { Category } from '@/type'
import cn from 'clsx'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { FlatList, Platform, Text, TouchableOpacity } from 'react-native'

const Filter = ({categories}: {categories: Category[]}) => {
  
  const searchParams = useLocalSearchParams(); //Built in from Expo
  const [active, setActive] = useState(searchParams.category || '')

  // to select some of the filter
  const handlePress = (id: string) => {
    setActive(id);

    // if no filter then all
    if(id === 'all') router.setParams({category: undefined})
      else router.setParams({category: id})
  };
  

  const filterData: (Category | {$id: string; name: string}) [] = categories 
    ? [{$id: 'all', name: 'All'}, ... categories]
    : [{$id: 'all', name: 'All'}]
  
  return (
    <FlatList 
      data={filterData}
      keyExtractor={(item) => item.$id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName='gap-x-2 pb-3'
      renderItem={({ item }) => (
        <TouchableOpacity key={item.$id} className={cn('filter', active === item.$id ? 'bg-primary' : 'bg-white')} 
          style={Platform.OS === 'android' ? {elevation: 5, shadowColor: '#878787'}: {}}
          onPress={() => handlePress(item.$id)}
        >
          <Text className={cn('body-medium', active === item.$id ? 'text-white' : 'text-gray-200')}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  )
}

export default Filter