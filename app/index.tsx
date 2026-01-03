import CartButton from "@/components/CartButton";
import { images, offers } from "@/constants";
import cn from 'clsx';
import { Fragment } from "react";
import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "./globals.css";
 
export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-background-100">
      <FlatList
        data ={offers}
        renderItem={({item, index}) => {

          const isEven = index % 2 === 0;


          return ( 
            <View >
              {/* cn allows the card to be checked if its even or not. */}
              <Pressable className = {cn("offer-card", isEven ? 'flex-row-reverse' : 'flex-row')} style={{backgroundColor: item.color}} android_ripple={{color: "fffff22"}}>
                {/* Dynamically search for the image and the title from our constant */}
                {({ pressed}) => (
                  <Fragment>
                    <View className="h-full w-1/2 ">
                      <Image source={item.image} className={"size-full"} resizeMode={"contain"}/>
                    </View>

                    <View className={cn("offer-card__info", isEven ? 'pl-10' : 'pr-1 0')}>
                      <Text className="h1-bold text-white leading-tight">
                        {item.title}
                      </Text>
                      <Image 
                        source={images.arrowRight}
                        className="size-10"
                        resizeMode="contain"
                        tintColor="#ffffff"
                      />
                    </View>

                  </Fragment>
                )}
              </Pressable>
            </View>
          )
        }}

        contentContainerClassName="pb-28 px-5"
        ListHeaderComponent={() => (
          <View className="flex-between flex-row w-full my-5 px-5">
            <View className="flex-start">
              <Text className="small-bold text-primary">DELIVER TO</Text>
              <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5"> 
                <Text className="paragraph-bold text-text-100">United States</Text>
                <Image source={images.arrowDown} className="size-3" resizeMode="contain"/>
                
              </TouchableOpacity>
            </View>

            <CartButton/>
          </View>
        )}
      />
    </SafeAreaView>


    // <View className="flex-1 items-center justify-center bg-background-100">
    //   <Text className="text-5xl font-bold text-text-100 font-quicksand-bold">
    //     RAAAAAAAH
    //   </Text>
    // </View>
  );
}