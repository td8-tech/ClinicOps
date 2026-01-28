import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="pacientes" 
        options={{ 
          title: 'Pacientes',
          tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="agenda" 
        options={{ 
          title: 'Agenda',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="documentos" 
        options={{ 
          title: 'Docs',
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="pacientes/new" 
        options={{ 
          href: null, // Hide from tab bar
        }} 
      />
      <Tabs.Screen 
        name="pacientes/[id]/index" 
        options={{ 
          href: null, // Hide from tab bar
        }} 
      />
      <Tabs.Screen 
        name="agenda/new" 
        options={{ 
          href: null, // Hide from tab bar
        }} 
      />
    </Tabs>
  );
}
