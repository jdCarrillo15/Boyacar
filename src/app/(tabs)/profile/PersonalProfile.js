import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, FlatList } from "react-native";
import colors from "../../../constants/colors";
import { MaterialIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import { AuthContext, useAuth } from "../../../providers/AuthProvider";
import PhotoCarousel from '../../../components/PhotoCarousel'
import { Link, router } from "expo-router";
import CommentSection from "../../../components/CommentSection";
import ProfileOptionsSection from "../../../components/ProfileOptionsSection";

const DriverRating = ({ rating }) => (// Muestra la calificación si el usuario es pasajero
    <Text style={styles.inlineText}>
        <Entypo name="dot-single" size={15} color="black" />
        {` ${rating} `}
        <FontAwesome name="star" size={15} color={colors.PRIMARY_COLOR} />
    </Text>
);

export default function PersonalProfile() {
    const { session, initialized } = useAuth();

    const screenWidth = Dimensions.get("window").width
    const screenHeight = Dimensions.get("window").height

    const driverConfigOptions = () => {
        const options = ['Verificar perfil']
        if (actualUser.user_type.toLowerCase() === 'conductor') {
            options.push('Informacion de vehiculo', 'Información de licencia')
        }
        return options
    }

    const redirectUserToForm = () => {
        if (actualUser.user_type.toLowerCase() === 'conductor') {
            router.push('profile/tripsManage/TripForm')
        } else {
            router.push('profile/VehicleForm')
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.infoBlock, styles.userPersonalInfoSection,
                { width: screenWidth * 0.95, height: screenHeight * 0.16 }]}>
                <View style={styles.userPersonalInfo}>
                    <Text style={styles.userName}>{actualUser.person_name.split(' ')[0]} {actualUser.person_last_name.split(' ')[0]}</Text>
                    <Text style={styles.info}>
                        {actualUser.user_type}
                        {actualUser.user_type.toLowerCase() === 'conductor' && (//Condicional para saber si el usuario es conductor
                            <DriverRating rating={actualUser.rating} />
                        )}
                    </Text>
                </View>
                {actualUser.person_photo ? (
                    <Image source={{ uri: actualUser.person_photo }} style={styles.userProfilePicture} />
                ) : (
                    <FontAwesome name="user-circle-o" size={80} color={colors.PRIMARY_COLOR} />
                )}
                <MaterialIcons name="keyboard-arrow-right" size={24} color="rgba(0,0,0,0.2)"
                    style={styles.arrowIcon} />
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.infoBlock,
                { width: screenWidth * 0.95, height: screenHeight * 0.14 }]}
                onPress={() => redirectUserToForm()}>
                <View>
                    <Text style={styles.infoTitle}>Crea un viaje</Text>
                    <Text style={styles.infoText}>{actualUser.user_type.toLowerCase() === 'conductor' ?
                        'Comparte tu viaje y comparte tus gastos' : 'Vuelvete conductor y comparte tus viajes'}</Text>
                </View>
                <Image source={require('../../../../assets/images/car-icon.png')} style={{ width: 50, height: 30, }} />
                <MaterialIcons name="keyboard-arrow-right" size={24} color="rgba(0,0,0,0.2)"
                    style={styles.arrowIcon} />
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.infoBlock,
                { width: screenWidth * 0.95, height: screenHeight * 0.14, }]}>
                <View>
                    <Text style={styles.infoTitle}>Tus viajes</Text>
                    <Text style={styles.infoText}>Revisa viajes antiguos y pendientes</Text>
                </View>
                <FontAwesome name="map-o" size={28} color={colors.PRIMARY_COLOR} />
                <MaterialIcons name="keyboard-arrow-right" size={25} color="rgba(0,0,0,0.2)"
                    style={styles.arrowIcon} />
            </TouchableOpacity>
            <ScrollView style={styles.profileScroll}>
                <View style={styles.profileOptionsSection}>
                    <View style={styles.doubleTitle}>
                        <Text style={styles.infoTitle}>Tus fotos</Text>
                        <Link href={''}>
                            <Text style={styles.seeAllLink}>Ver todas</Text>
                        </Link>
                    </View>
                    <PhotoCarousel />
                </View>
                {actualUser.user_type.toLowerCase() === 'conductor' && (//Condicional para saber si el usuario es conductor
                    <View style={styles.profileOptionsSection}>
                        <View style={styles.doubleTitle}>
                            <Text style={styles.infoTitle}>Referencias</Text>
                            <Link href={''}>
                                <Text style={styles.seeAllLink}>Ver todas</Text>
                            </Link>
                        </View>
                        <CommentSection />
                    </View>
                )}

                <ProfileOptionsSection
                    title={'Configuraciones'}
                    options={driverConfigOptions()}
                />
                <ProfileOptionsSection
                    title={'Soporte'}
                    options={['Reportar una inquietud', 'Como funciona Boyacar']}
                />
            </ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: 'white'
    },

    infoBlock: {
        marginTop: 5,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: 'gray',
        elevation: 10,
        paddingLeft: 18,
        paddingRight: 40,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',

    },
    arrowIcon: {
        position: 'absolute',
        right: 5
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    infoText: {
        fontSize: 12,
        fontWeight: 'thin',
        color: 'gray'
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    userProfilePicture: {
        width: 80,
        height: 80,
        backgroundColor: 'gray',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: colors.PRIMARY_COLOR,
    },
    profileScroll: {
        // backgroundColor: 'red',
        // height: '5%',
        width: '100%',

    },
    profileOptionsSection: {
        padding: 15,
    },
    doubleTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10
    },
    seeAllLink: {
        color: colors.PRIMARY_COLOR_DARK,
        textDecorationLine: 'underline'
    }
})