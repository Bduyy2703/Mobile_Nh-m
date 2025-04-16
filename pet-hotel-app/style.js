import { StyleSheet, Platform } from 'react-native';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#FDFBF6',
    fontFamily: 'nunito-medium',
  },
  containerContent: {
    flex: 1,
    padding: 16,
    paddingTop: 10,
    backgroundColor: '#EDF8FD',
    fontFamily: 'nunito-medium',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  titleText: {
    fontFamily: 'nunito-bold',
    fontSize: 28,
    color: '#416FAE',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  flagButton: {
    position: 'absolute',
    right: 20,
    top: 60,
  },
  flagIcon: {
    width: 40,
    height: 40,
  },
  input: {
    height: 50,
    borderWidth: 2,
    borderColor: '#416FAE',
    borderRadius: 30,
    marginBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#EEF7FD',
    fontFamily: 'nunito-medium',
  },
  subButton: {
    textAlign: 'center',
    color: '#416FAE',
    marginBottom: 20,
    fontFamily: 'nunito-medium',
  },
  mainButtonContainer: {
    alignItems: 'center',
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 50,
  },
  mainButton: {
    backgroundColor: '#4EA0B7',
    borderRadius: 50,
    height: 45,
    padding: 10,
    fontSize: 18,
    width: '60%',
    textAlign: 'center',
    marginBottom: 10,
  },
  textMainButton: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    fontFamily: 'nunito-bold',
  },
  orText: {
    textAlign: 'center',
    color: '#ccc',
    marginVertical: 20,
    fontFamily: 'nunito-medium',
  },
  googleButton: {
    borderRadius: 30,
    height: 50,
    borderWidth: 1,
    borderColor: '#416FAE',
  },
  facebookButton: {
    borderRadius: 8,
  },
  socialButtonText: {
    marginLeft: 10,
    fontFamily: 'nunito-medium',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderRadius: 25,
    margin: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  searchIcon: {
    color: 'gray',
    fontSize: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: '#000',
    fontFamily: 'nunito-medium',
  },
});