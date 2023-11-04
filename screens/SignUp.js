import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import TextBox from '../components/TextBox';
import Btn from '../components/Btn';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function SignUpScreen({ navigation }) {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleChange = (text, eventName) => {
    setValues((prev) => ({
      ...prev,
      [eventName]: text,
    }));
  };

  const handleSignup = () => {
    const { email, password } = values;
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setSignUpSuccess(true);
        navigation.navigate('Login');
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  return (
    <View style={styles.view}>
      <Text style={{ fontSize: 34, fontWeight: '800', marginBottom: 20 }}>Sign Up</Text>
      {signUpSuccess && <Text style={{ color: 'green' }}>Đăng ký thành công. Bây giờ bạn có thể đăng nhập.</Text>}
      <TextBox placeholder="Địa chỉ Email" onChangeText={(text) => handleChange(text, 'email')} />
      <TextBox placeholder="Mật khẩu" onChangeText={(text) => handleChange(text, 'password')} secureTextEntry={true} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '92%' }}>
        <Btn onClick={handleSignup} title="Đăng ký" style={{ width: '48%' }} />
        <Btn onClick={() => navigation.navigate('Login')} title="Đăng nhập" style={{ width: '48%', backgroundColor: '#344869' }} />
      </View>
    </View>
  );
}