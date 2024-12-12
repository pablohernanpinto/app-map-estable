import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Button,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function Perfil({ route }) {
  const { markers } = route.params || []; // Recuperar los pines desde los parámetros de navegación

  const [isModalVisible, setModalVisible] = useState(false); // Estado del modal
  const [username, setUsername] = useState(''); // Estado del campo usuario
  const [password, setPassword] = useState(''); // Estado del campo contraseña

  const handleLogin = async () => {
    const loginData = {
      correo: username,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:3000/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        Alert.alert('Éxito', 'Inicio de sesión exitoso');
      } else {
        const errorData = await response.json();
        console.error('Error en la respuesta:', errorData);
        Alert.alert('Error', errorData.message || 'Error al iniciar sesión.');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      Alert.alert(
        'Error',
        'No se pudo conectar con el servidor. Verifica tu conexión.'
      );
    }

    setModalVisible(false); // Cierra el modal
  };

  return (
    <View style={styles.container}>
      {/* Botón para abrir el modal */}
      <Button title="Iniciar sesión" onPress={() => setModalVisible(true)} />

      {/* Modal para iniciar sesión */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)} // Permite cerrar el modal con el botón de atrás
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Iniciar Sesión</Text>

            <TextInput
              style={styles.input}
              placeholder="Usuario"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonLogin]}
                onPress={handleLogin}
              >
                <Text style={styles.buttonText}>Iniciar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Nombre:</Text>
      <Text style={styles.title}>Correo:</Text>
      <Button title="Editar información personal" />

      <Text style={styles.title}>Reportes</Text>
      <FlatList
        data={markers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.markerItem}>
            <Text>
              Ubicación: {item.latitude}, {item.longitude}
            </Text>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: 'red',
  },
  buttonLogin: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
