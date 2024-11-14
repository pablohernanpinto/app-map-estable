import React , { useEffect } from 'react';
import { Button } from 'react-native';
import { Linking } from 'react-native';

export default function Carabineros() {
  const LLamadaCarabineros = () => {
    // Abrir la aplicación de llamadas y marcar 133
    Linking.openURL('tel:133')
      .catch((err) => console.error('Error al intentar hacer la llamada', err));
  };
  useEffect(() => {
    LLamadaCarabineros();
  }, []);  // El array vacío significa que se ejecutará solo una vez al montar el componente


  return (
    <Button title="Llamar a Carabineros" onPress={LLamadaCarabineros} />
  );
}
