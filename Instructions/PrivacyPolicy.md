// Create a simple Privacy screen component in your app
const PrivacyPolicy = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text>
        Our app does not collect personal data. All game data is stored locally on your device.
        We do not use analytics or tracking services.
      </Text>
      <Text>Contact: app@ardanco.com</Text>
    </View>
  );
};