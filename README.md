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

---

## ⚡ Getting Started

Follow these steps to set up the project locally.

### Step 1: Install Dependencies

First, install all necessary dependencies for the app:

```bash
# Using npm
npm install

# OR using Yarn
yarn install
