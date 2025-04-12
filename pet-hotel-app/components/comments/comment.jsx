import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Rating } from 'react-native-ratings';

const Comment = ({ name, time, rating, comment, profilePic }) => {
  return (
    <View style={styles.commentCard}>
      <View style={styles.header}>
        <Image source={{ uri: profilePic }} style={styles.profileImage} />
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
      <View style={styles.ratingContainer}>
        {/* <Text style={styles.rating}>{rating}</Text> */}
        <View style={styles.starContainer}>

          <Rating
            imageSize={15}
            readonly
            startingValue={rating}
            ratingColor="#FFD700"
            ratingBackgroundColor="#CCCCCC"
          />
        </View>
      </View>
      <Text style={styles.commentText}>{comment}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  commentCard: {
    borderColor:'#4EA0B7',
    borderWidth:1,
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    color: 'gray',
    fontSize:12
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  starContainer: {
    flexDirection: 'row',
  },
  commentText: {
    color: '#333',
    marginTop: 5,
  },
});

export default Comment;
