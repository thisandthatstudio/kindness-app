import { Tabs } from 'expo-router';
import { Image, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import i18n, { t } from '../../lib/i18n';

export default function TabLayout() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = i18n.subscribe(() => forceUpdate({}));
    i18n.loadLocale();
    return unsubscribe;
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF8A65',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.today'),
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/house.png')}
              style={[
                styles.icon,
                { opacity: focused ? 1 : 0.5 }
              ]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('tabs.history'),
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/calendar.png')}
              style={[
                styles.icon,
                { opacity: focused ? 1 : 0.5 }
              ]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/settings.png')}
              style={[
                styles.icon,
                { opacity: focused ? 1 : 0.5 }
              ]}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});