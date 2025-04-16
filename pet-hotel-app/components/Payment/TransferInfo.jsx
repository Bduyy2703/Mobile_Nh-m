import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Button, Modal, Portal } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import TransferInfoField from './TransferInfoField';
import * as MediaLibrary from 'expo-media-library';
import API from '../../config/AXIOS_API';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransferInfo = ({
  accountName,
  accountNumber,
  amount,
  bin,
  description,
  qrCode,
  orderCode,
  paymentLinkId,
  type,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [bank, setBank] = useState({ logo: undefined, name: undefined });
  const [visible, setVisible] = useState(false);
  const [isPaymentUpdated, setIsPaymentUpdated] = useState(false);
  const viewShotRef = useRef();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const getPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  };

  const captureAndSaveImage = async () => {
    try {
      const granted = await getPermission();
      if (!granted) {
        Alert.alert(t('error'), t('permissionDenied'));
        return;
      }

      if (viewShotRef.current) {
        const uri = await captureRef(viewShotRef, {
          fileName: `${accountNumber}_${bin}_${amount}_${orderCode}_Qrcode.png`,
          format: 'png',
          quality: 0.8,
        });

        const asset = await MediaLibrary.createAssetAsync(uri);
        if (asset) {
          Alert.alert(t('success'), t('imageSavedSuccess'));
        }
      }
    } catch (error) {
      console.error('Error while capturing and saving image:', error);
      Alert.alert(t('error'), t('imageSaveFailed'));
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const resBank = await API.get('/banks'); // Giả định endpoint để lấy danh sách ngân hàng
        if (resBank.status !== 200) {
          throw new Error('Failed to fetch bank list');
        }

        const bank = resBank.data.data.find((item) => item.bin === bin);
        setBank(bank || { logo: undefined, name: undefined });
      } catch (error) {
        Alert.alert(t('error'), t('fetchBankFailed'));
      }
    })();
  }, [bin]);

  useEffect(() => {
    let intervalId;

    const fetchStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert(t('error'), t('noToken'));
          router.push('/login');
          return;
        }

        const response = await API.get(`/payment/${orderCode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const statusData = response.data.data;
        let updateStatus;

        if (statusData.status === 'PAID') {
          clearInterval(intervalId);
          updateStatus = 'SUCCESS';
          await handleUpdatePayment(updateStatus);
          if (type) {
            await AsyncStorage.setItem('isPremium', JSON.stringify(true));
          }
          router.push({
            pathname: '/screen/success',
            params: { orderCode },
          });
        } else if (statusData.status === 'CANCELLED') {
          clearInterval(intervalId);
          updateStatus = 'CANCELLED';
          await handleUpdatePayment(updateStatus);
          router.push({
            pathname: '/screen/cancel',
            params: { orderCode },
          });
        }
      } catch (error) {
        console.error('Error fetching payment status:', error);
        Alert.alert(t('error'), t('fetchPaymentStatusFailed'));
      }
    };

    intervalId = setInterval(fetchStatus, 3000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderCode]);

  const cancelOrderHandle = async () => {
    Alert.alert(
      t('cancelPayment'),
      t('confirmCancelPayment'),
      [
        { text: t('cancel'), onPress: () => {} },
        { text: t('confirm'), onPress: () => handleCancel() },
      ],
      { cancelable: false }
    );
  };

  const handleCancel = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert(t('error'), t('noToken'));
        router.push('/login');
        return;
      }

      const response = await API.put(`/payment/${orderCode}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        router.push({
          pathname: '/screen/cancel',
          params: { orderCode },
        });
      }
    } catch (error) {
      console.error('Error while canceling order:', error);
      Alert.alert(t('error'), t('cancelPaymentFailed'));
    }
  };

  const handleUpdatePayment = async (status) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert(t('error'), t('noToken'));
        return;
      }

      const response = await API.put(`/payment/status/${orderCode}?status=${status}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error while updating payment:', error);
      Alert.alert(t('error'), t('updatePaymentStatusFailed'));
    }
  };

  return (
    <View style={styles.container}>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modelText}>{t('scanQRInstruction')}</Text>
          <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.8 }}>
            <View style={styles.qrCode}>
              <QRCode value={qrCode} size={200} backgroundColor="transparent" />
            </View>
          </ViewShot>
          <View style={styles.modalButton}>
            <Button
              icon="download"
              mode="outlined"
              style={styles.modalButtonStyle}
              onPress={captureAndSaveImage}
            >
              {t('download')}
            </Button>
            <Button
              icon="share"
              mode="outlined"
              style={styles.modalButtonStyle}
              onPress={() => console.log('Share pressed')}
            >
              {t('share')}
            </Button>
          </View>
        </Modal>
      </Portal>
      <View style={styles.header}>
        {bank.logo && <Image source={{ uri: bank.logo }} style={styles.image} />}
        <View style={styles.headerRight}>
          {bank.name && <Text style={styles.bankName}>{bank.name}</Text>}
        </View>
      </View>
      <View style={styles.innerContainer}>
        <TransferInfoField label={t('accountHolder')} text={accountName} />
        <TransferInfoField label={t('accountNumber')} text={accountNumber} />
        <TransferInfoField label={t('transferAmount')} text={amount} />
        <TransferInfoField label={t('transferDescription')} text={description} />
        <Text style={{ textAlign: 'center' }}>{t('scanQRInstruction2')}</Text>
        <Pressable
          android_ripple={{ color: '#f6f6f6' }}
          style={styles.qrCode}
          onPress={showModal}
        >
          <QRCode value={qrCode} size={200} backgroundColor="transparent" />
        </Pressable>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            gap: 10,
            justifyContent: 'center',
          }}
        >
          {!isPaymentUpdated && (
            <>
              <ActivityIndicator size="small" color="#6F4CC1" animating={true} />
              <Text>{t('waitingForPayment')}</Text>
            </>
          )}
          {isPaymentUpdated && (
            <>
              <FontAwesome name="check" size={20} color="#A4C936" />
              <Text>{t('paymentSuccess')}</Text>
            </>
          )}
        </View>
        <Text style={{ textAlign: 'center' }}>
          {t('note')}:{' '}
          <Text style={{ fontWeight: 'bold' }}>{t('enterDescription', { description })}</Text>
        </Text>
        <Button
          mode="contained"
          style={styles.button}
          onPress={cancelOrderHandle}
        >
          {t('cancelPayment')}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: 'grey',
    borderWidth: 0.2,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    height: 50,
    paddingVertical: 5,
    gap: 15,
    backgroundColor: '#E2D5FB',
  },
  image: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  bankName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  headerRight: {
    flex: 3,
  },
  innerContainer: {
    padding: 20,
    gap: 10,
  },
  qrCode: {
    overflow: 'hidden',
    width: 220,
    height: 220,
    padding: 10,
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: '#E2D5FB',
  },
  button: {
    width: 150,
    alignSelf: 'center',
    backgroundColor: '#FF4D4F',
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    paddingVertical: 40,
    gap: 20,
    borderRadius: 10,
    paddingHorizontal: 50,
  },
  modelText: {
    color: 'grey',
    textAlign: 'center',
  },
  modalButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButtonStyle: {
    borderWidth: 0.2,
  },
});

export default TransferInfo;