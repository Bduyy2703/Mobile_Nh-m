import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { commonStyles } from '../../style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import Header from './../../components/Header/header'
import { Rating } from 'react-native-ratings';
import { MaterialIcons } from '@expo/vector-icons';
import Comment from '../../components/comments/comment';

const EvaluateScreen = () => {
    const router = useRouter();
    const handleCreate = () => {
        router.push('/screen/createEvaluate');
    };

    const { t, i18n } = useTranslation();
    const totalRatings = 190;
    const ratings = {
        '5': 70,
        '4': 15,
        '3': 3,
        '2': 1,
        '1': 100,
    };



    const comments = [
        {
            id: 1,
            name: "Haylie Aminoff",
            time: "Hiện tại",
            rating: 1,
            comment: "Dich vu nhu ",
            profilePic: "https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/415064998_1690247731464067_2420857442496869886_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFSgMfFSCrGTMMByBw0e-xFQ2ln0eIBbttDaWfR4gFu22ibfynEzoY_YyhscLexl7jcsnjf4ObCZaDGiQcxsVeb&_nc_ohc=S6GHg5R9S2kQ7kNvgETf4-s&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=A5Pl687gSPsE9GnTjxLEJCE&oh=00_AYAMCyqzn9kM5IlVucs2mKW_GRekMJq8vc58QfsJ1sbS3w&oe=66EC8B18"
        },
        {
            id: 2,
            name: "Carla Septimus",
            time: "32 Phút trước",
            rating: 2,
            comment: "Qua la tuyet voi khong con gi de noiQua la tuyet voi khong con gi de noi ",
            profilePic: "https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/415064998_1690247731464067_2420857442496869886_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFSgMfFSCrGTMMByBw0e-xFQ2ln0eIBbttDaWfR4gFu22ibfynEzoY_YyhscLexl7jcsnjf4ObCZaDGiQcxsVeb&_nc_ohc=S6GHg5R9S2kQ7kNvgETf4-s&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=A5Pl687gSPsE9GnTjxLEJCE&oh=00_AYAMCyqzn9kM5IlVucs2mKW_GRekMJq8vc58QfsJ1sbS3w&oe=66EC8B18"
        },
        {
            id: 3,
            name: "Joe Dowson",
            time: "1 Giờ Trước",
            rating: 5,
            comment: "Qua la tuyet voi khong con gi de noi",
            profilePic: "https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/415064998_1690247731464067_2420857442496869886_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFSgMfFSCrGTMMByBw0e-xFQ2ln0eIBbttDaWfR4gFu22ibfynEzoY_YyhscLexl7jcsnjf4ObCZaDGiQcxsVeb&_nc_ohc=S6GHg5R9S2kQ7kNvgETf4-s&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=A5Pl687gSPsE9GnTjxLEJCE&oh=00_AYAMCyqzn9kM5IlVucs2mKW_GRekMJq8vc58QfsJ1sbS3w&oe=66EC8B18"
        },
        {
            id: 4,
            name: "Joe Dowson",
            time: "1 Giờ Trước",
            rating: 3,
            comment: "Qua la tuyet voi khong con gi de noi",
            profilePic: "https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/415064998_1690247731464067_2420857442496869886_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFSgMfFSCrGTMMByBw0e-xFQ2ln0eIBbttDaWfR4gFu22ibfynEzoY_YyhscLexl7jcsnjf4ObCZaDGiQcxsVeb&_nc_ohc=S6GHg5R9S2kQ7kNvgETf4-s&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=A5Pl687gSPsE9GnTjxLEJCE&oh=00_AYAMCyqzn9kM5IlVucs2mKW_GRekMJq8vc58QfsJ1sbS3w&oe=66EC8B18"
        },
        {
            id: 5,
            name: "Joe Dowson",
            time: "1 Giờ Trước",
            rating: 5,
            comment: "Qua la tuyet voi khong con gi de noi",
            profilePic: "https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/415064998_1690247731464067_2420857442496869886_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFSgMfFSCrGTMMByBw0e-xFQ2ln0eIBbttDaWfR4gFu22ibfynEzoY_YyhscLexl7jcsnjf4ObCZaDGiQcxsVeb&_nc_ohc=S6GHg5R9S2kQ7kNvgETf4-s&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=A5Pl687gSPsE9GnTjxLEJCE&oh=00_AYAMCyqzn9kM5IlVucs2mKW_GRekMJq8vc58QfsJ1sbS3w&oe=66EC8B18"
        },
        {
            id: 6,
            name: "Joe Dowson",
            time: "1 Giờ Trước",
            rating: 4,
            comment: "Qua la tuyet voi khong con gi de noi",
            profilePic: "https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/415064998_1690247731464067_2420857442496869886_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFSgMfFSCrGTMMByBw0e-xFQ2ln0eIBbttDaWfR4gFu22ibfynEzoY_YyhscLexl7jcsnjf4ObCZaDGiQcxsVeb&_nc_ohc=S6GHg5R9S2kQ7kNvgETf4-s&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=A5Pl687gSPsE9GnTjxLEJCE&oh=00_AYAMCyqzn9kM5IlVucs2mKW_GRekMJq8vc58QfsJ1sbS3w&oe=66EC8B18"
        }
    ];


    return (
        <SafeAreaView style={commonStyles.container}>
            <Header title={t('Evalue')} />
            <ScrollView style={commonStyles.containerContent}>
                <View style={styles.totalEvaluate}>

                    <View style={styles.starLeft}>

                        <Text style={styles.ratingText}>4.5</Text>
                        <Rating
                            imageSize={25}
                            readonly
                            startingValue={4.5}
                            ratingColor="#FFD700"
                            ratingBackgroundColor="#CCCCCC"
                        />
                        <Text style={styles.totalText}>89 đánh giá</Text>
                    </View>
                    <View style={styles.breakdownContainer}>
                        {Object.keys(ratings).map((star) => {
                            const widthPercent = (ratings[star] / totalRatings) * 100;
                            return (
                                <View style={styles.row} key={star}>
                                    <Text style={styles.starText}>
                                        <Rating
                                            imageSize={15}
                                            readonly
                                            startingValue={star}
                                            ratingColor="#FFD700"
                                            ratingBackgroundColor="#CCCCCC"
                                        />
                                    </Text>
                                    <View style={styles.barContainer}>
                                        <View style={[styles.filledBar, { width: `${widthPercent}%`, backgroundColor: '#4EA0B7', borderTopRightRadius: 3, borderBottomRightRadius: 3 }]} />
                                        <View style={styles.emptyBar} />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
                <View style={styles.comments}>
                    <Text style={{ fontSize: 20 }}>32 bình luận</Text>
                    <TouchableOpacity>
                        <Text style={{ fontSize: 20, color: '#4EA0B7' }}>Xem tất cả</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginBottom: 50 }}>
                    {comments.map(comment => (
                        <Comment
                            key={comment.id}
                            name={comment.name}
                            time={comment.time}
                            rating={comment.rating}
                            comment={comment.comment}
                            profilePic={comment.profilePic}
                        />
                    ))}
                </View>

                {/* <View style={commonStyles.mainButtonContainer}>
                    <TouchableOpacity onPress={handleUpdate} style={commonStyles.mainButton}>
                        <Text style={commonStyles.textMainButton}>{t('update')}</Text>
                    </TouchableOpacity>
                </View> */}
            </ScrollView>
            <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
                <Text style={styles.textButton}>
                    <MaterialIcons name="edit" size={20} color="white" style={styles.editIcon} />
                     Submit review
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    totalEvaluate: {
        flexDirection: 'row',
        padding: 10,
        width: '100%',
        alignItems: 'center',
        gap: 30,
    },
    starLeft: {
        flex: 2,
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 20,
    },
    ratingText: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#333',
    },
    totalText: {
        fontSize: 14,
        color: '#4EA0B7',
        marginTop: 5,
    },
    breakdownContainer: {
        flex: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    starText: {
        marginRight: 10
    },
    barContainer: {
        flex: 1,
        height: 10,
        flexDirection: 'row',
    },
    filledBar: {
        backgroundColor: '#3DA9FC',
        height: '100%',
    },
    emptyBar: {
        flex: 1,
        backgroundColor: '#E0E0E0',
        height: '100%',
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3
    },
    comments: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    addButton: {
        position: "absolute",
        bottom: 30,
        right: 30,
        backgroundColor: "#4EA0B7",
        width: 'auto',
        padding: 10,
        height: 45,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
    textButton: {
        textAlign: 'center',
        fontSize: 16,
        color: '#fff',
        fontFamily: 'nunito-bold',
    }

});

export default EvaluateScreen;
