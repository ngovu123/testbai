import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { getAuth, signOut } from 'firebase/auth'; // Import the signOut function

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'green',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  headerIcon: {
    marginRight: 16,
    color: 'red',
  },
});

function HomeScreen({ navigation, user, contacts, fetchContacts, deleteContact, isLoading, favorites, setFavorites, setIsLoading }) {
  const auth = getAuth(); // Get the Firebase authentication object

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigation.navigate('Login'); // Navigate to the Login screen
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    refreshContacts();
  }, []);

  const refreshContacts = async () => {
    setIsLoading(true);
    try {
      await fetchContacts();
    } finally {
      setIsLoading(false);
    }
  }

  const confirmDeleteContact = (contact) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => handleDeleteContact(contact),
          style: 'destructive',
        },
      ]
    );
  };

  const handleDeleteContact = async (contact) => {
    setIsLoading(true);

    try {
      await deleteContact(contact.id);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Contact deleted successfully!',
      });
      await refreshContacts();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete contact',
      });
      console.error('Delete contact error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.view}>
      <View style={styles.headerRightContainer}>
        <Text style={{ marginRight: 8, fontSize: 20 }}>Home</Text>
        <TouchableOpacity
          onPress={handleLogout} // Call the handleLogout function to log out
          style={styles.headerIcon}
        >
          <FontAwesome name="sign-out" size={24} color="red" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text>Loading contacts...</Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Contact Details', { contact: item })}
            >
              <View style={styles.listItem}>
                <View>
                  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.name}</Text>
                  <Text>Email: {item.email}</Text>
                  <Text>Phone: {item.phone}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Edit Contact', { contactId: item.id, user, refreshContacts })}
                  >
                    <Text style={{ color: 'blue', fontWeight: 'bold' }}>
                      <FontAwesome name="edit" size={20} />
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmDeleteContact(item)}>
                    <Text style={styles.deleteButton}>
                      <FontAwesome name="trash" size={20} />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Add Contact', { refreshContacts })}
      >
        <Text style={{ fontSize: 20, color: 'white' }}>
          <FontAwesome name="plus" size={20} />
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default HomeScreen;
