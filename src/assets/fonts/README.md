# Font Installation Instructions

1. Download the following font files:
   - Inter-Regular.ttf
   - Inter-Medium.ttf
   - Inter-Bold.ttf
   - Nunito-Bold.ttf

2. Place them in this directory (`src/assets/fonts/`)

3. For iOS:
   - Add the fonts to the Info.plist file in the iOS project
   - Add this section under the main dict:
   ```xml
   <key>UIAppFonts</key>
   <array>
     <string>Inter-Regular.ttf</string>
     <string>Inter-Medium.ttf</string>
     <string>Inter-Bold.ttf</string>
     <string>Nunito-Bold.ttf</string>
   </array>
   ```

4. For Android:
   - Copy the font files to `android/app/src/main/assets/fonts/`
   - No additional configuration needed

5. Run the following commands:
   ```bash
   cd ios && pod install && cd ..
   npx react-native-asset
   ```

6. Rebuild your app:
   ```bash
   npx react-native run-ios
   # or
   npx react-native run-android
   ``` 