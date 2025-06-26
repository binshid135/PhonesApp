import { View, Text } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const _layout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: 'black',
            }}
        >
            <Tabs.Screen
                name="Home"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" size={size} color={color} />
                    ),
                    title: 'Home',
                }}
            />
            <Tabs.Screen
                name="Search"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="search" size={size} color={color} />
                    ),
                    title: 'Search',
                }}
            />
            <Tabs.Screen
                name="Categories"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="view-grid-outline"
                            size={size}
                            color={color}
                        />
                    ),
                    title: 'Categories',
                }}
            />
            <Tabs.Screen
                name="Cart"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="shopping-cart" size={size} color={color} />
                    ),
                    title: 'Cart',
                }}
            />
        </Tabs>
    );
};

export default _layout;
