// import { CustomButtonProps } from '@/type';
// import cn from 'clsx';
// import React from 'react';
// import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

// const Logout = ({
//   onPress,
//   title="Click Me",
//   style,
//   textStyle,
//   leftIcon,
//   isLoading = false
// } : CustomButtonProps ) => {
//   return (
//     <TouchableOpacity className={cn('logout-btn', style)} onPress={onPress}>
//       {leftIcon}

//       <View className='flex-center flex-row'>
//         {isLoading ? (
//           <ActivityIndicator size ="small" color="white"/>
//         ): (
//           <Text className={cn('text-white-100 paragraph-semibold', textStyle)}>{title}</Text>
//         )}
//       </View>
//       <Text> </Text>
//     </TouchableOpacity>
//   )
// }

// export default Logout