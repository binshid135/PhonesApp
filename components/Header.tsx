import React from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const Header = () => {
    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <TouchableOpacity>
                    <Ionicons name="menu" size={28} color="white" />
                </TouchableOpacity>

                <Image
                    source={require('../assets/images/mainlogo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#888" style={{ marginLeft: 10 }} />
                <TextInput
                    style={styles.input}
                    placeholder="Search products..."
                    placeholderTextColor="#888"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgb(230, 0, 0)',
        paddingTop: 20,
        paddingBottom: 15,
        paddingHorizontal: 15,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        width: 130,
        height: 30,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: 12,
        borderRadius: 8,
        paddingVertical: 6,
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#000',
    },
});

export default Header;
