// Update developer section to include notification simulator
<Card style={styles.settingsCard}>
  <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Developer</Text>
  {renderSettingItem(
    <Smartphone size={24} color={colors.text.primary} />,
    "Live Activity Preview",
    () => router.push('/live-activity-preview')
  )}
  
  {/* Added notification simulator to developer section */}
  {outboundRequests.filter(req => req.status === 'pending').length > 0 && (
    <NotificationSimulator 
      outboundRequests={outboundRequests}
      contacts={contacts}
      onSimulateConnection={handleSimulateConnection}
    />
  )}
</Card>