import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const CancelScreen = () => {
    const router = useRouter();
    const { orderCode } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <Text style={styles.cancelMessage}>Thanh toán đã bị hủy!</Text>
      <Text style={styles.details}>
        Bạn đã hủy thanh toán ({orderCode}). Nếu có thắc mắc, vui lòng liên hệ với chúng tôi.
      </Text>
      <Button
        title="Quay lại trang chủ"
        onPress={() => router.push('home')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cancelMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default CancelScreen;
