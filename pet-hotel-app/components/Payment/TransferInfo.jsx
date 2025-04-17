import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Clipboard, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal'; // Thêm Modal
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import TransferInfoField from './TransferInfoField';
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
  const [isModalVisible, setModalVisible] = useState(false); // Trạng thái cho modal

  useEffect(() => {
    let intervalId;

    const fetchStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.log('No token found');
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
        console.log('Failed to fetch payment status');
      }
    };

    intervalId = setInterval(fetchStatus, 3000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderCode]);

  const cancelOrderHandle = async () => {
    console.log('cancelOrderHandle called');
    setModalVisible(true); // Hiển thị modal thay vì Alert
  };

  const handleCancel = async () => {
    setModalVisible(false); // Ẩn modal
    try {
      console.log('Handling cancel request');
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        router.push('/login');
        return;
      }

      const response = await API.put(`/payment/${orderCode}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log('Payment canceled successfully');
        router.push({
          pathname: '/screen/cancel',
          params: { orderCode },
        });
      } else {
        console.log('Failed to cancel payment, status:', response.status);
      }
    } catch (error) {
      console.error('Error while canceling order:', error);
      console.log('Failed to cancel payment');
    }
  };

  const handleUpdatePayment = async (status) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token found');
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
      console.log('Failed to update payment status');
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(description);
    console.log('Copied to clipboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <TransferInfoField label={t('accountHolder')} text={accountName} />
        <TransferInfoField label={t('accountNumber')} text={accountNumber} />
        <TransferInfoField label={t('transferAmount')} text={amount} />
        <TransferInfoField label={t('transferDescription')} text={description} />
        <Text style={styles.instructionText}>{t('scanQRInstruction')}</Text>
        <View style={styles.qrCode}>
          <QRCode value={qrCode} size={200} backgroundColor="transparent" />
        </View>
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            {t('note')}: <Text style={styles.boldText}>{t('enterDescription', { description })}</Text>
          </Text>
          <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
            <Text style={styles.copyButtonText}>{t('copy')}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log('Cancel button pressed');
            cancelOrderHandle();
          }}
        >
          <Text style={styles.buttonText}>Hủy thanh toán</Text>
        </TouchableOpacity>
      </View>

      {/* Modal thay thế cho Alert */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Cancel Payment</Text>
          <Text style={styles.modalMessage}>Are you sure you want to cancel this payment?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                console.log('Cancel action dismissed');
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#FF4D4F' }]}
              onPress={handleCancel}
            >
              <Text style={styles.modalButtonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    zIndex: 1,
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionText: {
    textAlign: 'center',
    color: 'grey',
    marginTop: 10,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  noteText: {
    textAlign: 'center',
    color: '#FF4D4F',
    fontSize: 16,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#FF4D4F',
  },
  copyButton: {
    marginLeft: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  modalButton: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransferInfo;