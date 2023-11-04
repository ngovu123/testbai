import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import TextBox from '../components/TextBox';
import Btn from '../components/Btn';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function LoginScreen({ navigation }) {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const handleChange = (text, eventName) => {
    setValues((prev) => ({
      ...prev,
      [eventName]: text,
    }));
  };

  const handleLogin = () => {
    const { email, password } = values;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.navigate('Home');
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  return (
    <View style={styles.view}>
      <Text style={{ fontSize: 34, fontWeight: '800', marginBottom: 20 }}>Login</Text>
      <TextBox placeholder="Email Address" onChangeText={(text) => handleChange(text, 'email')} />
      <TextBox placeholder="Password" onChangeText={(text) => handleChange(text, 'password')} secureTextEntry={true} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '92%' }}>
        <Btn onClick={handleLogin} title="Login" style={{ width: '48%' }} />
        <Btn onClick={() => navigation.navigate('Sign Up')} title="Sign Up" style={{ width: '48%', backgroundColor: '#344869' }} />
      </View>
    </View>
  );
}