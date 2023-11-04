import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';
import LoginScreen from './screens/Login';
import SignUpScreen from './screens/SignUp';
import HomeScreen from './screens/Home';
import AddContactScreen from './screens/AddContact';
import EditContactScreen from './screens/EditContact';
import ContactDetailsScreen from './screens/ContactDetailsScreen';
import FavoritesScreen from './screens/Favorites'; // Import FavoritesScreen

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchContacts();
      } else {
        setUser(null);
        setContacts([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  const fetchContacts = async () => {
    if (!user) return;

    const db = getFirestore();
    const userContactsRef = collection(db, 'users', user.uid, 'contacts');

    try {
      const contactsSnapshot = await getDocs(userContactsRef);
      const contactList = [];
      contactsSnapshot.forEach((doc) => {
        contactList.push({ id: doc.id, ...doc.data() });
      });
      setContacts(contactList);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const addContact = async (contact) => {
    if (!user) return;

    const db = getFirestore();
    const userContactsRef = collection(db, 'users', user.uid, 'contacts');

    try {
      const docRef = await setDoc(doc(userContactsRef), contact);
      const newContact = { id: docRef.id, ...contact };
      setContacts([...contacts, newContact]);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteContact = async (contactId) => {
    if (!user) return;

    const db = getFirestore();
    const userContactsRef = collection(db, 'users', user.uid, 'contacts');
    const contactDocRef = doc(userContactsRef, contactId);

    try {
      await deleteDoc(contactDocRef);
      const updatedContacts = contacts.filter((contact) => contact.id !== contactId);
      setContacts(updatedContacts);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Home">
              {(props) => (
                <HomeScreen
                  {...props}
                  user={user}
                  contacts={contacts}
                  fetchContacts={fetchContacts}
                  deleteContact={deleteContact}
                  isLoading={isLoading}
                  favorites={favorites}
                  setFavorites={setFavorites}
                  setIsLoading={setIsLoading}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Favorites">
              {(props) => (
                <FavoritesScreen
                  {...props}
                  contacts={contacts}
                  favorites={favorites}
                  setFavorites={setFavorites}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Add Contact">
              {(props) => <AddContactScreen {...props} user={user} addContact={addContact} />}
            </Stack.Screen>
            <Stack.Screen name="Edit Contact" component={EditContactScreen} />
            <Stack.Screen name="Contact Details" component={ContactDetailsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Sign Up" component={SignUpScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}