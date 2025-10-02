# Intro Screens

Hệ thống màn hình giới thiệu cho ứng dụng MoneyCare, bao gồm splash screen và onboarding flow.

## Components

### 1. SplashScreen

Màn hình khởi động với logo và animation đẹp mắt.

**Features:**

- ✅ Gradient background theo design system
- ✅ Logo animation với scale và fade effects
- ✅ Smooth transitions
- ✅ Auto navigation sau khi animation hoàn thành

**Usage:**

```tsx
import { SplashScreen } from "@screens/intro";

<SplashScreen onFinish={() => console.log("Splash finished")} />;
```

**Animation Sequence:**

1. Background fade in (500ms)
2. Logo scale + fade in (800ms)
3. Text fade in (600ms)
4. Hold (1000ms)
5. Fade out all (400ms)
6. Call onFinish callback

### 2. OnboardingScreen

Màn hình hướng dẫn sử dụng với multiple slides.

**Features:**

- ✅ 4 slides giới thiệu tính năng chính
- ✅ Horizontal scroll với pagination dots
- ✅ Animated pagination indicators
- ✅ Skip functionality
- ✅ Smooth transitions between slides

**Usage:**

```tsx
import { OnboardingScreen } from "@screens/intro";

<OnboardingScreen onFinish={() => console.log("Onboarding finished")} />;
```

**Slides Content:**

1. **Quản lý tài chính thông minh** - Wallet icon
2. **Lập ngân sách chi tiêu** - Pie chart icon
3. **Báo cáo chi tiết** - Bar chart icon
4. **Bảo mật tuyệt đối** - Shield icon

### 3. IntroNavigator

Logic controller cho intro flow.

**Features:**

- ✅ Kiểm tra trạng thái onboarding
- ✅ Auto skip onboarding cho returning users
- ✅ Lưu trạng thái đã xem onboarding
- ✅ Smooth navigation flow

**Flow Logic:**

```
App Start
    ↓
Splash Screen (Always show)
    ↓
Check onboarding status
    ↓
First time user? → Show Onboarding → Mark as seen → Complete
Returning user? → Skip Onboarding → Complete
```

## Integration

### RootNavigator Integration

```tsx
// src/navigation/RootNavigator.tsx
import { IntroNavigator } from "./IntroNavigator";

// App states: 'loading' | 'intro' | 'auth' | 'main'
const checkAppState = async () => {
  const hasSeenOnboarding = await AsyncStorage.getItem(
    STORAGE_KEYS.HAS_SEEN_ONBOARDING
  );

  if (hasSeenOnboarding !== "true") {
    setAppState("intro"); // Show intro flow
  } else if (isAuthenticated) {
    setAppState("main"); // Go to main app
  } else {
    setAppState("auth"); // Show login
  }
};
```

### Storage Keys

```tsx
// src/constants/index.ts
export const STORAGE_KEYS = {
  HAS_SEEN_ONBOARDING: "has_seen_onboarding",
  // ... other keys
} as const;
```

## Styling

### Design System Integration

```tsx
// Colors from design system
COLORS.primary[400] // Light blue
COLORS.primary[500] // Main blue (Picton Blue)
COLORS.primary[600] // Dark blue

// Gradient combinations
LinearGradient colors={[
  COLORS.primary[400],
  COLORS.primary[500],
  COLORS.primary[600]
]}
```

### Typography

```tsx
// App name styling
fontSize: TYPOGRAPHY.fontSize["2xl"];
fontWeight: TYPOGRAPHY.fontWeight.medium;
letterSpacing: 1;

// Onboarding titles
fontSize: TYPOGRAPHY.fontSize["2xl"];
fontWeight: TYPOGRAPHY.fontWeight.bold;
lineHeight: 32;

// Descriptions
fontSize: TYPOGRAPHY.fontSize.base;
lineHeight: 24;
```

### Animations

```tsx
// Logo scale animation
Animated.spring(logoScale, {
  toValue: 1,
  tension: 50,
  friction: 7,
  useNativeDriver: true,
});

// Fade animations
Animated.timing(opacity, {
  toValue: 1,
  duration: 800,
  useNativeDriver: true,
});

// Pagination dots
const dotWidth = scrollX.interpolate({
  inputRange: [(index - 1) * width, index * width, (index + 1) * width],
  outputRange: [8, 24, 8],
  extrapolate: "clamp",
});
```

## Customization

### Adding New Onboarding Slides

```tsx
// Add to onboardingData array
const newSlide = {
  id: "5",
  title: "New Feature",
  description: "Description of new feature",
  icon: "new-icon-name",
};
```

### Modifying Animation Timing

```tsx
// In SplashScreen component
const ANIMATION_CONFIG = {
  BACKGROUND_FADE: 500,
  LOGO_SCALE: 800,
  TEXT_FADE: 600,
  HOLD_TIME: 1000,
  FADE_OUT: 400,
};
```

### Custom Logo

```tsx
// Replace logo implementation in SplashScreen
<View style={styles.logoBackground}>
  <Image
    source={require("@assets/images/logo.png")}
    style={styles.logoImage}
    resizeMode="contain"
  />
</View>
```

## Performance

### Optimizations Applied

1. **Native Driver**: All animations use native driver
2. **Image Optimization**: Vector icons instead of images
3. **Memory Management**: Cleanup animation refs
4. **Lazy Loading**: Components only render when needed

### Bundle Size Impact

- **SplashScreen**: ~2KB (minimal dependencies)
- **OnboardingScreen**: ~4KB (includes FlatList logic)
- **Total**: ~6KB for complete intro system

## Testing

### Manual Testing Checklist

- [ ] Splash screen shows on first app launch
- [ ] Logo animation plays smoothly
- [ ] Onboarding shows for first-time users
- [ ] Onboarding can be skipped
- [ ] Pagination dots animate correctly
- [ ] Returning users skip onboarding
- [ ] Navigation flows work correctly
- [ ] Storage persistence works
- [ ] Animations are smooth on low-end devices

### Reset Onboarding (Development)

```tsx
// Clear onboarding status for testing
await AsyncStorage.removeItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING);
```

## Accessibility

### Screen Reader Support

```tsx
// Add accessibility labels
<View accessible accessibilityLabel="Money Care Logo">
  {/* Logo content */}
</View>

<Text accessibilityRole="header">
  {slide.title}
</Text>

<Button
  accessible
  accessibilityLabel={`Skip onboarding, ${onboardingData.length} slides total`}
  accessibilityHint="Skips the introduction and goes directly to login"
>
  Skip
</Button>
```

### Reduced Motion Support

```tsx
// Respect user's motion preferences
import { AccessibilityInfo } from "react-native";

const [reduceMotion, setReduceMotion] = useState(false);

useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
}, []);

// Conditional animation duration
const duration = reduceMotion ? 0 : 800;
```

## Future Enhancements

### Planned Features

1. **Video Background**: Support for video splash screens
2. **Interactive Onboarding**: Touch interactions in slides
3. **Progress Tracking**: Analytics for onboarding completion
4. **A/B Testing**: Different onboarding flows
5. **Localization**: Multi-language support
6. **Dark Mode**: Theme-aware intro screens

### Technical Improvements

1. **Lottie Animations**: Replace basic animations with Lottie
2. **Gesture Navigation**: Swipe gestures for onboarding
3. **Preloading**: Preload next screens during intro
4. **Error Boundaries**: Graceful error handling
5. **Performance Monitoring**: Track animation performance
