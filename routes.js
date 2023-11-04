import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/Home';
import FavoritesScreen from './screens/Favorites';
import ContactDetailsScreen from './screens/ContactDetailsScreen';
import EditContactScreen from './screens/EditContact';
import AddContactScreen from './screens/AddContact';
import LoginScreen from './screens/Login'; // Import màn hình Đăng nhập
import SignUpScreen from './screens/SignUp'; // Import màn hình Đăng ký

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="CloseDrawer"
        onPress={() => props.navigation.closeDrawer()}
      />
      <DrawerItem
        label=""
        onPress={() => props.navigation.toggleDrawer()}
      />
    </DrawerContentScrollView>
  );
}

function ContactsStackScreen({ user, contacts, fetchContacts, deleteContact, isLoading, favorites, setFavorites, setIsLoading }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" options={{ headerShown: false }}>
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
    </Stack.Navigator>
  );
}

export default function App({ user, contacts, fetchContacts, deleteContact, isLoading, favorites, setFavorites, setIsLoading }) {
  return (
    <Drawer.Navigator
      useLegacyImplementation
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home">
        {(props) => (
          <ContactsStackScreen
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
      </Drawer.Screen>
      <Drawer.Screen name="Login" component={LoginScreen} /> // Màn hình Đăng nhập
      <Drawer.Screen name="SignUp" component={SignUpScreen} /> // Màn hình Đăng ký
    </Drawer.Navigator>
  );
}