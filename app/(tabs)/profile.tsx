import CustomHeader from '@/components/CustomHeader';
import EditProfile from '@/components/EditProfile';
import Logout from '@/components/Logout';
import ProfilePhoto from '@/components/ProfilePhoto';
import { images } from '@/constants';
import { getCurrentUser, updateUser } from '@/lib/appwrite';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  infoIcon: {
    width: 25,
    height: 25,
  },
  inputUnderlineWrap: {
    alignSelf: 'flex-start', // shrink to content
    borderBottomWidth: 1,
    borderBottomColor: '#780000',
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    paddingVertical: 0, // helps underline sit closer to text
  },
});

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userDocId, setUserDocId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: 'Add phone number',
    address: 'Add address',
  });

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const user = await getCurrentUser();
        if (!isMounted || !user) return;

        setUserDocId(user.$id);

        setProfile((prev) => ({
          ...prev,
          name: user.name ?? prev.name,
          email: user.email ?? prev.email,
          phone: user.phone != null ? String(user.phone) : prev.phone,
          address: user.address ?? prev.address,
        }));

        // avatar placeholder is handled by <ProfilePhoto /> when uri is undefined
      } catch {
        // keep local defaults if fetch fails
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdate = async (field: string, value: string) => {
    if (field === 'email') return; // email stays unchanged
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveOrToggle = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (!userDocId) return;

    const cleanedPhone =
      profile.phone.trim() === 'Add phone number' ? '' : profile.phone.trim();
    const cleanedAddress =
      profile.address.trim() === 'Add address' ? '' : profile.address.trim();

    try {
      setIsSaving(true);
      await updateUser(userDocId, {
        name: profile.name.trim(),
        email: profile.email, // keep same email in DB
        phone: cleanedPhone,
        address: cleanedAddress,
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePickProfilePhoto = async () => {
    try {
      const perm = await ImagePicker.getMediaLibraryPermissionsAsync();
      let granted = perm.granted;

      if (!granted) {
        const req = await ImagePicker.requestMediaLibraryPermissionsAsync();
        granted = req.granted;
      }

      if (!granted) {
        Alert.alert(
          'Permission needed',
          'Please allow photo library access to choose a profile photo.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
        exif: false,
      });

      if (result.canceled) return;

      const uri = result.assets?.[0]?.uri;
      if (!uri) return;

      // local-only preview; if user never picks, we keep placeholder
      setLocalAvatarUri(uri);
    } catch (e) {
      console.log('[ImagePicker] error:', e);
      Alert.alert('Error', 'Could not open photo library.');
    }
  };

  return (
    <SafeAreaView className="bg-background-100 h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <FlatList
          data={[]} // Empty data since you're using ListHeaderComponent and ListFooterComponent
          renderItem={() => null}
          contentContainerClassName="pb-28 px-5 pt-5"
          keyboardShouldPersistTaps="handled" // Prevent keyboard from dismissing on taps
          keyboardDismissMode="on-drag" // Dismiss keyboard only when dragging
          ListHeaderComponent={() => <CustomHeader title="Profile" />}
          ListFooterComponent={
            <View className="gap-5">
              <View className="flex items-center justify-center">
                <Pressable
                  onPress={handlePickProfilePhoto}
                  disabled={isSaving}
                  hitSlop={10}
                  android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
                >
                  <ProfilePhoto uri={localAvatarUri ?? undefined} />
                </Pressable>
              </View>
              <View className="mt-6 border-white p-5 rounded-2xl bg-white">
                {/* Name */}
                <View className="flex flex-row items-center gap-x-3">
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: '#9D2235',
                      backgroundColor: '#fcd9df',
                      borderRadius: 50,
                      padding: 8,
                    }}
                  >
                    <Image
                      source={images.user}
                      resizeMode="contain"
                      style={[styles.infoIcon, { tintColor: '#9D2235' }]}
                    />
                  </View>
                  <View>
                    <Text className="text-gray-100">Full Name</Text>
                    <View style={isEditing ? styles.inputUnderlineWrap : undefined}>
                      <TextInput
                        value={profile.name}
                        editable={isEditing}
                        onChangeText={(text) => handleUpdate('name', text)}
                        style={styles.input}
                      />
                    </View>
                  </View>
                </View>

                {/* Email */}
                <View className="flex flex-row items-center gap-x-3 mt-5">
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: '#9D2235',
                      backgroundColor: '#fcd9df',
                      borderRadius: 50,
                      padding: 8,
                    }}
                  >
                    <Image
                      source={images.envelope}
                      resizeMode="contain"
                      style={[styles.infoIcon, { tintColor: '#9D2235' }]}
                    />
                  </View>
                  <View>
                    <Text className="text-gray-100">Email</Text>
                    {/* No underline wrapper + not editable */}
                    <TextInput value={profile.email} editable={false} style={styles.input} />
                  </View>
                </View>

                {/* Phone */}
                <View className="flex flex-row items-center gap-x-3 mt-5">
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: '#9D2235',
                      backgroundColor: '#fcd9df',
                      borderRadius: 50,
                      padding: 8,
                    }}
                  >
                    <Image
                      source={images.phone}
                      resizeMode="contain"
                      style={[styles.infoIcon, { tintColor: '#9D2235' }]}
                    />
                  </View>
                  <View>
                    <Text className="text-gray-100">Phone number</Text>
                    <View style={isEditing ? styles.inputUnderlineWrap : undefined}>
                      <TextInput
                        value={profile.phone}
                        editable={isEditing}
                        keyboardType="number-pad"
                        inputMode="numeric"
                        onChangeText={(text) =>
                          handleUpdate('phone', text.replace(/[^\d]/g, ''))
                        }
                        style={styles.input}
                      />
                    </View>
                  </View>
                </View>

                {/* Address */}
                <View className="flex flex-row items-center gap-x-3 mt-5">
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: '#9D2235',
                      backgroundColor: '#fcd9df',
                      borderRadius: 50,
                      padding: 8,
                    }}
                  >
                    <Image
                      source={images.location}
                      resizeMode="contain"
                      style={[styles.infoIcon, { tintColor: '#9D2235' }]}
                    />
                  </View>
                  <View>
                    <Text className="text-gray-100">Address</Text>
                    <View style={isEditing ? styles.inputUnderlineWrap : undefined}>
                      <TextInput
                        value={profile.address}
                        editable={isEditing}
                        onChangeText={(text) => handleUpdate('address', text)}
                        style={styles.input}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Edit Profile Button */}
              <EditProfile
                title="Edit Profile"
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                onPress={handleSaveOrToggle}
                isLoading={isSaving}
              />

              {/* Logout Button */}
              <Logout title="Logout" leftIcon={images.logout} />
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Profile;