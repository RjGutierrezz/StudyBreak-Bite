import CustomHeader from '@/components/CustomHeader';
import { images, sides as SIDES, toppings as TOPPINGS } from '@/constants';
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
  const [selectedToppings, setSelectedToppings] = useState<Record<string, number>>({});
  const [selectedSides, setSelectedSides] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const basePrice = useMemo(() => Number(product?.price ?? 0), [product]);

  const mergedToppings = useMemo(() => {
    const fromProduct = Array.isArray(product?.customizations) ? product.customizations : [];
    const base = fromProduct.length ? fromProduct : TOPPINGS;

    return base.map((t: any) => {
      const match = TOPPINGS.find(
        (x) => String(x.name).toLowerCase() === String(t?.name).toLowerCase()
      );

      return {
        ...t,
        image: match?.image,
        price: typeof t?.price === 'number' ? t.price : match?.price ?? 0,
      };
    });
  }, [product]);

  const mergedSides = useMemo(() => {
    const fromProduct =
      Array.isArray(product?.sides) ? product.sides :
      Array.isArray(product?.sides_customizations) ? product.sides_customizations :
      [];

    const base = fromProduct.length ? fromProduct : SIDES;

    return base.map((s: any) => {
      const match = SIDES.find(
        (x) => String(x.name).toLowerCase() === String(s?.name).toLowerCase()
      );

      return {
        ...s,
        image: match?.image,
        price: typeof s?.price === 'number' ? s.price : match?.price ?? 0,
      };
    });
  }, [product]);

  const totalPrice = useMemo(() => {
    const toppingsTotal = mergedToppings.reduce((sum, t: any) => {
      const qty = selectedToppings[t.name] ?? 0;
      return sum + Number(t.price ?? 0) * qty;
    }, 0);

    const sidesTotal = mergedSides.reduce((sum, s: any) => {
      const qty = selectedSides[s.name] ?? 0;
      return sum + Number(s.price ?? 0) * qty;
    }, 0);

    return basePrice + toppingsTotal + sidesTotal;
  }, [basePrice, mergedToppings, mergedSides, selectedToppings, selectedSides]);

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
          const normalized = {
            ...productDetails,
            customizations: Array.isArray(productDetails?.customizations)
              ? productDetails.customizations
              : [],
          };

          setProduct(normalized);
          setSelectedToppings({});
          setSelectedSides({});
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

  const increaseTopping = (name: string) => {
    setSelectedToppings((prev) => ({ ...prev, [name]: (prev[name] ?? 0) + 1 }));
  };

  const decreaseTopping = (name: string) => {
    setSelectedToppings((prev) => {
      const nextQty = (prev[name] ?? 0) - 1;
      if (nextQty <= 0) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name]: nextQty };
    });
  };

  const removeTopping = (name: string) => {
    setSelectedToppings((prev) => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  const increaseSide = (name: string) => {
    setSelectedSides((prev) => ({ ...prev, [name]: (prev[name] ?? 0) + 1 }));
  };

  const decreaseSide = (name: string) => {
    setSelectedSides((prev) => {
      const nextQty = (prev[name] ?? 0) - 1;
      if (nextQty <= 0) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name]: nextQty };
    });
  };

  const removeSide = (name: string) => {
    setSelectedSides((prev) => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;

    const imageUrl = product.image_url
      ? `${product.image_url}&project=${appwriteConfig.projectId}`
      : product.image_url;

    const toppingsWithQty = Object.entries(selectedToppings).map(([name, quantity]) => {
      const topping = mergedToppings.find((t: any) => t.name === name);
      return { id: name, name: `Topping: ${name}`, price: Number(topping?.price ?? 0), quantity };
    });

    const sidesWithQty = Object.entries(selectedSides).map(([name, quantity]) => {
      const side = mergedSides.find((s: any) => s.name === name);
      return { id: name, name: `Side: ${name}`, price: Number(side?.price ?? 0), quantity };
    });

    const expandedCustomizations = [...toppingsWithQty, ...sidesWithQty].flatMap((c) =>
      Array.from({ length: c.quantity }).map((_, idx) => ({
        id: `${c.name}-${idx}`,
        name: c.name,
        price: c.price,
      }))
    );

    addItem({
      id: product.$id,
      name: product.name,
      price: totalPrice,
      image_url: imageUrl,
      rating: product.rating,
      calories: product.calories,
      protein: product.protein,
      customizations: expandedCustomizations,
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
        data={mergedSides}
        keyExtractor={(item, index) => `${item?.name ?? "side"}-${index}`}
        renderItem={({ item }) => {
          const qty = selectedSides[item.name] ?? 0;

          return (
            <View className="cart-item flex-row items-center justify-between mb-3">
              <View className="flex flex-row items-center gap-x-3 flex-1">
                {item.image ? (
                  <View className="w-12 h-12 rounded-lg overflow-hidden">
                    <Image source={item.image} className="w-full h-full" resizeMode="cover" />
                  </View>
                ) : null}

                <View className="flex-1">
                  <Text className="base-bold text-dark-100">{item.name}</Text>
                  <Text className="paragraph-bold text-primary mt-1">
                    ${Number(item.price ?? 0).toFixed(2)}
                  </Text>

                  <View className="flex flex-row items-center gap-x-4 mt-2">
                    <TouchableOpacity
                      onPress={() => decreaseSide(item.name)}
                      className="cart-item__actions"
                      disabled={qty <= 0}
                      style={{ opacity: qty <= 0 ? 0.4 : 1 }}
                    >
                      <Image
                        source={images.minus}
                        className="size-1/2"
                        resizeMode="contain"
                        tintColor={"#FF9C01"}
                      />
                    </TouchableOpacity>

                    <Text className="base-bold text-dark-100">{qty}</Text>

                    <TouchableOpacity
                      onPress={() => increaseSide(item.name)}
                      className="cart-item__actions"
                    >
                      <Image
                        source={images.plus}
                        className="size-1/2"
                        resizeMode="contain"
                        tintColor={"#FF9C01"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => removeSide(item.name)}
                className="flex-center ml-2 shrink-0"
                disabled={qty <= 0}
                style={{ opacity: qty <= 0 ? 0.4 : 1 }}
              >
                <Image source={images.trash} className="size-5" resizeMode="contain" />
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <View className="px-4 py-3">
            <Text className="text-gray-200">No sides available for this item.</Text>
          </View>
        )}
        contentContainerClassName="pb-28 px-5 pt-5"
        ListHeaderComponent={() => (
          <View>
            <CustomHeader showSearch={false}/>
            <View className='flex flex-row items-start gap-x-5 mt-5'>

              {/*Left part of the screen */}
              <View className='flex-1'>
                <Text className="h3-bold mt-1 mb-4" style={{fontSize: 24}}>{product.name}</Text>
                    <View className='flex flex-row items-center gap-x-3'>
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

            <Text className='h3-bold'>Additional Toppings</Text>

            {mergedToppings.map((item: any, index: number) => {
              const qty = selectedToppings[item.name] ?? 0;

              return (
                <View
                  key={`${item?.name ?? "topping"}-${index}`}
                  className="cart-item flex-row items-center justify-between mb-3"
                >
                  <View className="flex flex-row items-center gap-x-3 flex-1">
                    {item.image ? (
                      <View className="w-12 h-12 rounded-lg overflow-hidden">
                        <Image source={item.image} className="w-full h-full" resizeMode="cover" />
                      </View>
                    ) : null}

                    <View className="flex-1">
                      <Text className="base-bold text-dark-100">{item.name}</Text>
                      <Text className="paragraph-bold text-primary mt-1">
                        ${Number(item.price ?? 0).toFixed(2)}
                      </Text>

                      <View className="flex flex-row items-center gap-x-4 mt-2">
                        <TouchableOpacity
                          onPress={() => decreaseTopping(item.name)}
                          className="cart-item__actions"
                          disabled={qty <= 0}
                          style={{ opacity: qty <= 0 ? 0.4 : 1 }}
                        >
                          <Image
                            source={images.minus}
                            className="size-1/2"
                            resizeMode="contain"
                            tintColor={"#FF9C01"}
                          />
                        </TouchableOpacity>

                        <Text className="base-bold text-dark-100">{qty}</Text>

                        <TouchableOpacity
                          onPress={() => increaseTopping(item.name)}
                          className="cart-item__actions"
                        >
                          <Image
                            source={images.plus}
                            className="size-1/2"
                            resizeMode="contain"
                            tintColor={"#FF9C01"}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => removeTopping(item.name)}
                    className="flex-center ml-2 shrink-0"
                    disabled={qty <= 0}
                    style={{ opacity: qty <= 0 ? 0.4 : 1 }}
                  >
                    <Image source={images.trash} className="size-5" resizeMode="contain" />
                  </TouchableOpacity>
                </View>
              );
            })}

            <Text className='h3-bold mt-2'>Additional Sides</Text>
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