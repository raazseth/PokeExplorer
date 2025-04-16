# React Native Pokémon App

This is a **React Native** application that allows users to interact with Pokémon data in a fun and engaging way. The app features Pokémon profiles, quizzes, wishlist functionality, and notifications. It uses **React Query** for data fetching and caching, integrates Firebase for authentication, and handles local and push notifications.

## 🌟 Features

### ✔️ **Google Authentication**
- Login using **Google** via Firebase Authentication.
- User profile picture and name are displayed on the Home screen after login.
- Includes functionality for user registration, login, and password recovery.

### ✔️ **Home Tab**
- A Tinder-like swiper to browse Pokémon.
- Multi-display options for Pokémon cards (grid and list views).
- Smooth transitions and animations for an engaging user experience.

### ✔️ **Wishlist Button**
- Users can add Pokémon to their wishlist by clicking the **wishlist button** on the Pokémon detail page.
- The Wishlist tab displays all Pokémon that the user has saved.

### ✔️ **Wishlist & Search Tabs**
- **Wishlist Tab**: Shows all the Pokémon added to the user’s wishlist.
- **Search Tab**: Allows users to search for Pokémon by name or id, displaying filtered results.

### ✔️ **Pokémon Detail Screen**
- Provides detailed information about Pokémon, including name, type, abilities, and moves.
- Users can navigate to the detail screen from the swiper or search results.

### ✔️ **Pokémon Quiz Feature**
- Users can participate in Pokémon-themed quizzes related to Pokémon moves, types, and abilities.
- Quizzes consist of multiple-choice questions with varying levels of difficulty.
- Fun and engaging for both casual players and hardcore fans.

### ✔️ **Gemini API Integration**
- The app uses the **Gemini API** to fetch rich, immersive content about Pokémon. This includes lore, unique Pokédex entries, interactive quiz questions, short stories featuring Pokémon, battle strategies, and fun personality facts.
- The **Gemini API** fetches detailed content in JSON format, structured as:
    - **Lore & Backstory**: Includes the Pokémon’s origin, habitat, characteristics, and legends.
    - **Pokédex Entry**: A quirky and fun description in the style of a real Pokédex.
    - **Quiz**: 10 multiple-choice questions varying in difficulty (easy, medium, hard), related to Pokémon trivia.
    - **Interactive Story**: A short adventure featuring the Pokémon, with 5-8 pages in a playful, kid-friendly tone.
    - **Battle Tips**: Provides strategies, strengths, weaknesses, best moveset, and synergy with other Pokémon.
    - **Personality Facts**: Imagines the Pokémon’s personality and habits in a fun and engaging way.

    This API enriches the user experience by providing deep and fun Pokémon knowledge directly in the app.

### ✔️ **Local Notifications & Firebase Cloud Messaging (FCM)**
- Local notifications are handled using **Notifee** for instant alerts about Pokémon, quiz reminders, and more. 
- Push notifications are integrated with **FCM** to notify users about app updates and important events.

### ✔️ **Tab State Management**
- The app manages state persistence for the bottom navigation tabs (Home, Wishlist, Search).
- Users return to their last visited tab when reopening the app, ensuring a seamless experience.

### ✔️ **React Query & Caching**
- Uses **React Query** for fetching Pokémon data from APIs and caches the results for **5 minutes** to optimize performance.
- The data is automatically refreshed after 5 minutes to keep it up to date.

### ✔️ **Quiz Bottom Sheet** & **Profile Bottom Sheet**
- **Quiz Bottom Sheet**: When users participate in quizzes, the app uses **React Native Bottom Sheet** to display a sleek, interactive quiz interface that slides up from the bottom of the screen. This bottom sheet allows users to take the quiz without leaving the current page.
  
- **Profile Bottom Sheet**: The user profile is managed via a **bottom sheet** that slides up when the profile button is pressed. This includes a detailed view of the user's account information, making it accessible from anywhere in the app.

Both bottom sheets are powered by the popular **[React Native Bottom Sheet](https://gorhom.dev/react-native-bottom-sheet/)** library, providing smooth animations and an intuitive user interface.

# Assumptions:

1. **User Familiarity with Pokémon**: Let's assume that users have some basic familiarity with the Pokémon universe. This means that the app may include references to Pokémon species, moves, and lore, and users are expected to understand these terms without a lot of explanation. We’re not aiming for beginners here, but rather Pokémon fans who already know the basics.

2. **Stable Internet Connection**: Since the app pulls data from external APIs (like **PokeAPI** and **Gemini API**), we’re assuming that users have a stable internet connection. While offline mode is not the focus of this app, some features (like Pokémon profile details, quizzes, and notifications) rely on being online to fetch or update data.

3. **User Permissions**: The app assumes that users are willing to grant permissions for things like **push notifications**. Without these permissions, some app features (like notifications) may not function as expected.

4. **Device Compatibility**: We’ve designed the app to work on a wide range of Android and iOS devices. However, we’re assuming that the users are using relatively recent versions of Android or iOS. Some older devices or OS versions might not support certain features like push notifications or smooth animations.

5. **Quiz Interaction**: We assume that users will be interacting with the **Pokémon quizzes** and **story sections** with a certain level of engagement. The quiz is designed for Pokémon fans, so the difficulty levels and the content will cater to users who enjoy a challenge or a fun interactive experience.

6. **Local Notification and Cache Management**: The app assumes that users enable **local notifications** and rely on **React Query's caching** mechanism to enhance performance. We’ve put in caching limits (like 5 minutes), so users can expect a more optimized experience without hitting API rate limits often.

7. **App's Focus on Entertainment**: The primary focus of the app is entertainment, specifically around Pokémon trivia, quizzes, and interactive stories. We’re assuming users are here for fun, not for serious gameplay or other non-entertainment-focused features.

# Limitations:

1. **Gemini API Content**: The content you see in the app is strictly based on **anime** and official **Pokémon lore**. We’re sticking to canon material here, so don’t expect any fan-made Pokémon or unofficial content in the mix.

2. **Push Notifications Permissions**: I use **Firebase Cloud Messaging (FCM)** for push notifications, but for this to work, users need to give explicit permission to receive them. If a user declines, they won’t get notifications, which might mean missing out on certain app updates or features.

3. **Platform-Specific Issues**: I’ve made sure the app works well on both **Android** and **iOS**, but certain libraries (like the **React Native Bottom Sheet**) might behave slightly differently depending on the platform or device version. So, while we’re doing our best for consistency, some platform-specific quirks might pop up from time to time.

4. **API Rate Limits**: I'm pulling data from the **PokeAPI** and **Gemini API**, but these APIs have rate limits on how many requests we can make within a certain period. To help with this, I’ve set up **React Query** to manage caching and reduce unnecessary calls, but if too many requests are made too quickly, we might run into some delays fetching fresh data.

5. **Device Compatibility**: It supports both **Android** and **iOS**, but some device models or OS versions might have quirks, especially with things like push notifications or authentication. If you’re on an older device or OS version, expect some potential extra debugging or configuration to get things running smoothly.

---

## ⚡ Getting Started

Follow these steps to set up the project locally.

# Instructions for Setting Up and Running the App

## Step 1: Clone the Repository

Start by cloning the repository to your local machine using the following command:

sh
git clone git@github.com:raazseth/PokeExplorer.git

## Step 2: Navigate to the Project Directory

Once the repository is cloned, navigate to the project folder:

sh
cd PokeExplorer

## Step 3: Install Dependencies

Install all the necessary dependencies for the project using either npm or yarn.

With npm:

sh
npm install

Or with yarn:

sh
yarn install

## Step 4: Running the App

With Metro running, open another terminal:

### For Android:
To run the app on an Android emulator or physical device, execute:

sh
npm run android
# OR
yarn android

### For iOS:
For iOS, make sure CocoaPods dependencies are installed:

sh
bundle install
bundle exec pod install

Then, to run the app:

sh
npm run ios
# OR
yarn ios

## Step 5: Running the App on a Real Device (Optional)

If you're running the app on a real device, make sure to connect your device via USB and enable **Developer Mode**.

For Android, ensure **USB debugging** is enabled on your device and run the following command:

sh
npm run android
# OR
yarn android

For iOS, you may need to use Xcode to deploy the app to your device.

## Step 6: Testing and Debugging

Use **Metro Bundler** for debugging. Make sure you have the developer menu open on your device/emulator to inspect and test features. You can enable it by shaking your device or using the emulator's key combination.

To monitor the app logs, you can use:

sh
react-native log-android
# OR
react-native log-ios

