import React from 'react'
import { KeyboardAvoidingView, View, Text } from 'react-native'

const Home = () => {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View>
        <Text>My Home</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

export default Home;
