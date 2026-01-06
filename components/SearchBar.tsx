import { images } from '@/constants'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { Image, TextInput, TouchableOpacity, View } from 'react-native'

const SearchBar = () => {
  const params = useLocalSearchParams<{query?: string}> ()
  const [query, setQuery] = useState(params.query);
  
  // for the debounce effect
  // const debouncedSearch = useDebouncedCallback(
    // to fix mobile keyboard issue not showing out when deleting
  //   (text: string) => router.push(`/search?query=${text}`), 500
  // )

  const handleSearch = (text: string) => {
    setQuery(text);
    // debouncedSearch(text);

    if(!text) router.setParams({query: undefined})
  }

  const handleSubmit = () => {
    if(query.trim()) router.setParams({query})
  }

  return (
    <View className='searchbar'>
      <TextInput 
        className='flex-1 p-5'
        placeholder='Search for burgers, pizzas ...'
        value={query}
        onChangeText={handleSearch}
        // will submit when you press enter on the keyboard
        onSubmitEditing={handleSubmit}

        // this changes the enter key into a search icon
        returnKeyType="search"
        placeholderTextColor='#A0A0A0'
      />
      <TouchableOpacity className='pr-5' onPress={() => router.setParams({query})}>
        <Image 
          source={images.search}
          className='size-6'
          resizeMode='contain'
          tintColor='#5D5F6D '
        />    
      </TouchableOpacity>
    </View>
  )
}

export default SearchBar