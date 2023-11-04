import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listItem: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const FavoritesScreen = ({ navigation, contacts, favorites }) => {
  const favoriteContacts = contacts.filter((contact) => favorites.some((fav) => fav.id === contact.id));

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Contact Details', { contact: item })}
          >
            <View style={styles.listItem}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>Email: {item.email}</Text>
              <Text>Phone: {item.phone}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default FavoritesScreen;