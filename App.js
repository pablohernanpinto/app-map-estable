import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './components/homeScreen';
import MapScreen from './components/mapScreen';
import Carabineros from './components/carabineros';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Pefil" component={HomeScreen} />

        <Tab.Screen name="Carabineros" component={Carabineros} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}
