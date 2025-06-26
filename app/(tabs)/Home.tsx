import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '@/components/Header'
import Banners from '@/components/Banners'
import ProductGridSection from '@/components/ProductSection'

const Home = () => {
    return (
        <SafeAreaView>
            <ScrollView>
                <Header />
                <Banners />
                <ProductGridSection />
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home