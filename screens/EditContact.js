import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { getFirestore, collection, doc, updateDoc, getDoc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function EditContactScreen({ route, navigation }) {
  const { contactId, user, refreshContacts } = route.params;
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContactDetails() {
      try {
        const db = getFirestore();
        const userContactsRef = collection(db, 'users', user.uid, 'contacts');
        const contactDocRef = doc(userContactsRef, contactId);
        const contactSnapshot = await getDoc(contactDocRef);

        if (contactSnapshot.exists()) {
          const contactData = contactSnapshot.data();
          setContact(contactData);
        }
      } catch (error) {
        alert('Error fetching contact details: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContactDetails();
  }, [contactId, user]);

  const handleEditContact = async () => {
    setIsLoading(true);

    const db = getFirestore();
    const userContactsRef = collection(db, 'users', user.uid, 'contacts');
    const contactDocRef = doc(userContactsRef, contactId);

    try {
      await updateDoc(contactDocRef, contact);
      if (refreshContacts) {
        await refreshContacts();
      }
      navigation.navigate('Home');
    } catch (error) {
      alert('Error updating contact: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading contact details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.view}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={contact.name}
        onChangeText={(text) => setContact({ ...contact, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={contact.email}
        onChangeText={(text) => setContact({ ...contact, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={contact.phone}
        onChangeText={(text) => setContact({ ...contact, phone: text })}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleEditContact}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

export default EditContactScreen;
