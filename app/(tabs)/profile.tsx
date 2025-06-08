// Update profile screen to add simulator button
// ... (keep existing imports)

export default function ProfileScreen() {
  // ... (keep existing code)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* ... (keep existing content) */}
      
      <View style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Developer</Text>
        {renderSettingItem(
          <Smartphone size={24} color={colors.text.primary} />,
          "Live Activity Preview",
          () => router.push('/live-activity-preview')
        )}
      </View>

      <Text style={styles.versionText}>HitMe v1.0.0</Text>
      
      <EditProfileModal
        visible={editProfileVisible}
        user={user}
        onClose={() => setEditProfileVisible(false)}
        onUpdate={handleUpdateProfile}
      />
    </ScrollView>
  );
}