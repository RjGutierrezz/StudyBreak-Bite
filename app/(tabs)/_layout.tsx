import useAuthStore from '@/store/auth.store';
import { Redirect, Slot } from 'expo-router';
import React from 'react';

export default function TabLayout() {

  // puts the user to the sign in pafe if their not authenticated
  const {isAuthenticated} = useAuthStore()

  if(!isAuthenticated) return <Redirect href="/sign-in" />

  return <Slot/>
}