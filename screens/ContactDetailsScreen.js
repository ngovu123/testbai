import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContactDetailsScreen = ({ route }) => {
  const { contact } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{contact.name}</Text>
      <Text>Email: {contact.email}</Text>
      <Text>Phone: {contact.phone}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ContactDetailsScreen;
