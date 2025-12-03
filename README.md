# 🌱 Soil Farming Agent

A smart agriculture platform that empowers farmers with comprehensive soil data and connects them with verified distributors to improve farming outcomes.

![Soil Farming Agent](https://img.shields.io/badge/Agriculture-Smart%20Platform-green)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)
![Firebase](https://img.shields.io/badge/Firebase-Enabled-orange)

## 🌾 About

Soil Farming Agent is a modern web application designed to revolutionize farming practices by providing farmers with detailed soil information and easy access to agricultural distributors. Our platform helps farmers make data-driven decisions to optimize crop yields and improve soil health.

## ✨ Features

### For Farmers
- **Soil Data Library** - Access comprehensive information about different soil types including:
  - Soil composition and characteristics
  - pH levels and nutrient content
  - Best suited crops for each soil type
  - Recommended fertilizers and treatments
  
- **Distributor Network** - Connect with verified agricultural distributors:
  - Browse distributors by category (Seeds, Fertilizers, Equipment, Pesticides)
  - View contact information and locations
  - Access product availability and pricing

- **User Dashboard** - Personalized experience with:
  - Quick access to soil information
  - Saved distributor contacts
  - Agricultural tips and recommendations

### For Administrators
- **Admin Dashboard** - Comprehensive management tools:
  - Add and manage soil data entries
  - Register and verify distributors
  - Monitor platform activity
  - User management capabilities

### Authentication
- **Secure Login System** - Firebase-powered authentication:
  - Email/password registration and login
  - Role-based access control (Farmer/Admin)
  - Protected routes and secure data access

## 🛠️ Technologies

This project is built with modern web technologies:

| Technology | Purpose |
|------------|---------|
| **React 18** | Frontend UI framework |
| **TypeScript** | Type-safe development |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Beautiful UI components |
| **Firebase** | Authentication & Database |
| **React Router** | Client-side routing |
| **Lucide React** | Modern icon library |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Firebase project (for backend services)

### Installation

1. **Clone the repository**
   ```sh
   git clone <YOUR_GIT_URL>
   cd soil-farming-agent
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication and Firestore Database
   - Add your Firebase configuration to `src/lib/firebase.ts`

4. **Start the development server**
   ```sh
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 Pages & Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Landing page with hero section | Public |
| `/auth` | Login and registration | Public |
| `/dashboard` | Farmer dashboard with soil data | Authenticated |
| `/admin` | Admin management panel | Admin only |

## 🔐 User Roles

- **Farmer** - Can view soil data, browse distributors, and access the farmer dashboard
- **Admin** - Full access including ability to add/edit soil data and manage distributors

## 📊 Database Structure

### Soil Data Collection
- Soil type name
- Description and characteristics
- pH level range
- Nutrient content
- Suitable crops
- Recommended treatments

### Distributors Collection
- Company name
- Category (Seeds/Fertilizers/Equipment/Pesticides)
- Contact information
- Location details
- Product offerings



**Built with ❤️ for farmers worldwide**
