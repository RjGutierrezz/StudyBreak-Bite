import { Redirect, Slot } from 'expo-router';
import React from 'react';

export default function _layout() {

  // puts the user to the sign in pafe if their not authenticated
  const isAuthenticated = false;

  if(!isAuthenticated) return <Redirect href="/sign-in" />

  return <Slot/>
}