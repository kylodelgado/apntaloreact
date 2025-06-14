# IronSource LevelPlay Test Suite Integration Plan (iOS)

## Objective
Integrate IronSource LevelPlay Test Suite into the existing React-Native app so that it can be launched from a hidden debug modal on **iOS** only.  The modal is triggered by a **2-second long-press anywhere on `GameSetupScreen`**.  A build-time/runtime toggle will allow this feature to be disabled for production releases while keeping it available for internal testing.

---

## 1. Dependencies & Environment
1. `ironsource-mediation` v3.1.0 is already present – it exposes `IronSource.launchTestSuite()` on both Android & iOS.  No additional native code is required.
2. No extra gesture libraries are necessary. React-Native's built-in `Pressable`/`TouchableWithoutFeedback` supports `onLongPress` with `delayLongPress`.
3. **iOS-only build flags:** we can wrap calls in `Platform.OS === 'ios'` checks.

---

## 2. Toggle Strategy
| Build Stage | Toggle value | Behaviour |
|-------------|--------------|-----------|
| Development / internal testing | `false` | Modal **enabled** |
| Production / App Store build  | `true`  | Modal **suppressed** |

Implementation options (pick one — default to option A):
A. **Static constant** in `src/config/debug.ts`:
```ts
// src/config/debug.ts
export const DISABLE_TEST_SUITE_MODAL = true; // flip to false for internal builds
```
   • Easy to audit; requires manual change before building.

B. **AsyncStorage flag** that can be toggled from a hidden developer menu inside the app (requires an extra settings UI but allows OTA toggle).

We will implement option A first; option B can be added later.

---

## 3. UI/UX – Test Suite Modal
New component: `src/components/debug/TestSuiteModal.tsx`

Features:
• Uses React-Native `Modal`.
• Semi-transparent backdrop, centred card with:
  – Title: "Debug Tools".
  – Button **Launch IronSource Test Suite** → `IronSource.launchTestSuite()`; catch and log errors.
  – Button **Close** to dismiss.
• Styled to match current light/dark theme via `useTheme()`.

> Note: `IronSource.launchTestSuite()` must be called **after** the SDK is initialised.  The SDK is already initialised in `App.tsx` (`LevelPlay.init(...)`) so we are safe.

---

## 4. Trigger – 2 Second Long-Press
Modify `src/screens/GameSetupScreen.tsx`:
1. Import `Pressable` (or `TouchableWithoutFeedback`).
2. Wrap the entire screen content with the pressable container.
3. Add:
```tsx
onLongPress={() => {
  if (!DISABLE_TEST_SUITE_MODAL && Platform.OS === 'ios') {
    setShowDebugModal(true);
  }
}}
delayLongPress={2000}
```
4. Maintain `const [showDebugModal, setShowDebugModal] = useState(false);` and render `<TestSuiteModal visible={showDebugModal} onClose={() => setShowDebugModal(false)} />`.

Because the long-press fires even if child `TouchableOpacity`s consume touches, we will set `Pressable`'s `pointerEvents="box-none"` to avoid swallowing existing taps.  During implementation we can adjust if conflicts arise.

---

## 5. File-by-File Changes
1. **`src/config/debug.ts`** – new constant.
2. **`src/components/debug/TestSuiteModal.tsx`** – new component.
3. **`src/screens/GameSetupScreen.tsx`** – wrap root with long-press handler and mount the modal.
4. *(optional)* `src/screens/SettingsScreen.tsx` – add a developer-only switch that toggles `DISABLE_TEST_SUITE_MODAL` via AsyncStorage.

---

## 6. QA & Testing Checklist
- [ ] Build & run on iOS simulator/device.
- [ ] Long-press (≥2 s) anywhere on Game Setup – modal appears.
- [ ] "Launch Test Suite" opens IronSource test suite overlay.
- [ ] Toggle flag to `true`; confirm long-press no longer shows modal.
- [ ] Regular user flow (buttons, navigation) remains unaffected.

---

## 7. Risks / Mitigations
1. **Gesture interference** – If root `Pressable` conflicts with other components, adjust `pressRetentionOffset` or utilise `react-native-gesture-handler`'s `LongPressGestureHandler`.
2. **Accidental exposure in production** – Keep toggle **true** in `main` branch; flip to `false` only on internal builds.
3. **SDK not initialised yet** – Ensure modal only renders after `LevelPlay.init` promise resolved (can piggy-back on existing app initialisation state).

---

## 8. Next Steps
1. Confirm toggle strategy with stakeholders (static vs runtime switch).
2. Proceed to implement the files listed in section 5.
3. Commit & test on an iOS physical device.

---

*Document generated – Ready for review.* 