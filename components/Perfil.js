import React from 'react';
import { StyleSheet, View, Text, FlatList,Button } from 'react-native';

export default function Perfil({ route }) {
  const { markers } = route.params || []; // Recuperar los pines desde los parámetros de navegación

  return (
    <View style={styles.container}>
      <Text style= {styles.title}>Nombre:</Text>
      <Text style= {styles.title}>Correo:</Text>
      <Button title="Editar informacion personal"></Button>

      <Text style={styles.title}>Reportes</Text>
      <FlatList
        data={markers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.markerItem}>
            <Text>Ubicación: {item.latitude}, {item.longitude}</Text>
            <Text>Tipo: {item.option}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  markerItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});
