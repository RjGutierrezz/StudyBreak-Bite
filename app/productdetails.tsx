import CustomHeader from '@/components/CustomHeader';
import { images } from '@/constants';
import { appwriteConfig, getMenu } from '@/lib/appwrite';
import { useCartStore } from '@/store/cart.store';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

const ProductDetails = () => {
  const params = useLocalSearchParams();
  const id = useMemo(() => {
    const raw = (params as any)?.id;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const { addItem } = useCartStore();

  const [product, setProduct] = useState<any>(null);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      if (!id) {
        setErrorText('Missing product id.');
        return;
      }

      try {
        setIsLoading(true);
        setErrorText(null);

        const menu = await getMenu({ category: '', query: '' });
        const productDetails = menu?.find((item: any) => item?.$id === id);

        if (cancelled) return;

        if (productDetails) {
          setProduct(productDetails);
          setSelectedToppings([]);
          setTotalPrice(productDetails.price ?? 0);
        } else {
          setProduct(null);
          setErrorText(`Product not found for id: ${id}`);
        }
      } catch (error) {
        if (cancelled) return;
        setProduct(null);
        setErrorText('Failed to fetch product details.');
        console.error('Failed to fetch product details:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleToggleTopping = (topping: string, price: number) => {
    if (selectedToppings.includes(topping)) {
      setSelectedToppings((prev) => prev.filter((t) => t !== topping));
      setTotalPrice((prev) => prev - price);
    } else {
      setSelectedToppings((prev) => [...prev, topping]);
      setTotalPrice((prev) => prev + price);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const imageUrl = product.image_url
      ? `${product.image_url}&project=${appwriteConfig.projectId}`
      : product.image_url;

    addItem({
      id: product.$id,
      name: product.name,
      price: totalPrice,
      image_url: imageUrl,
      rating: product.rating,
      calories: product.calories,
      protein: product.protein,
      customizations: selectedToppings.map((topping) => ({
        id: topping,
        name: topping,
        price: product.customizations?.find((c: any) => c.name === topping)?.price || 0,
      })),
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="bg-background-100 h-full items-center justify-center">
        <ActivityIndicator />
        <Text className="text-gray-100 mt-3">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (errorText) {
    return (
      <SafeAreaView className="bg-background-100 h-full items-center justify-center px-5">
        <Text className="text-dark-100">{errorText}</Text>
      </SafeAreaView>
    );
  }

  if (!product) return null;

  const imageUrl = product.image_url
    ? `${product.image_url}&project=${appwriteConfig.projectId}`
    : product.image_url;

  return (
    <SafeAreaView className="bg-background-100 h-full">
      <FlatList
        data={product.customizations || []}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex flex-row items-center justify-between p-4 border-b border-gray-200"
            onPress={() => handleToggleTopping(item.name, item.price)}
          >
            <Text className="text-dark-100">{item.name}</Text>
            <Text className="text-gray-200">${item.price.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
        contentContainerClassName="pb-28 px-5 pt-5"
        ListHeaderComponent={() => (
          <View>
            <CustomHeader showSearch={false}/>
            <View className='flex flex-row items-start gap-x-5 mt-5'>

              {/*Left part of the screen */}
              <View className='flex-1'>
                <Text className="h3-bold mt-1 mb-4" style={{fontSize: 24}}>{product.name}</Text>
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
                        <Text className='paragraph-medium'>{product.rating}/5</Text>
                    </View>
                <View className='flex flex-row items-center gap-x-3'>
                  <Text className="text-gray-100 mt-2">Calories: </Text>
                  <Text className='text-black mt-2'>{product.calories}</Text>
                  <Text className="text-gray-100 mt-2">Protein: </Text>
                  <Text className='text-black mt-2 mr-2'>{product.protein}</Text>
                </View>
                <Text className="text-gray-100 mt-2">{product.description}</Text>
                <View className="flex flex-row items-center mt-4">
                  <Text className='text-primary h1-bold'>$</Text>
                  <Text className="text-black h1-bold">{product.price.toFixed(2)}</Text>
                </View>
              </View>  

              {/* Right part of the screen */}
              <Image
                  source={{ uri: imageUrl }}
                  className="w-60 h-60 rounded-lg"
                  resizeMode="contain"
                />
            </View>

            <View className='cart-item bg-[#CEE7F7] mt-4'>
              <View className='flex flex-row items-center gap-x-3'>
                <Image source={images.dollar} resizeMode='contain' className='w-7 h-7' style={{tintColor: "#780000"}} />
                <Text className='base-semibold'>Free Delivery</Text>
                <Image source={images.clock} resizeMode='contain' className='w-4 h-4 ml-6' style={{tintColor: "#780000"}} />
                <Text className='base-semibold'>20-30 mins</Text>
                <Image source={images.star} resizeMode='contain' className='w-7 h-7 ml-6' style={{tintColor: "#780000"}} />
                <Text className='base-semibold'>{product.rating}</Text>
              </View>
            </View>

            <Text className='h3-bold'>Toppings</Text>
          </View>
        )}
        ListFooterComponent={() => (
          <TouchableOpacity className="bg-primary p-4 rounded-lg mt-4" onPress={handleAddToCart}>
            <Text className="text-white text-center">Add to cart (${totalPrice.toFixed(2)})</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default ProductDetails;