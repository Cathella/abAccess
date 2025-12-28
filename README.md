# ABA Access

ABA Access is a mobile-first healthcare access platform that makes quality healthcare affordable and accessible. The platform enables users to purchase healthcare bundles, manage their family members, book visits at partner facilities, and track their healthcare journey.

## About AbAccess

AbAccess is revolutionizing healthcare access by providing bundled healthcare packages that users can purchase and share with their family members. Our platform connects users with a network of partner healthcare facilities, making it easy to book appointments, track visits, and manage healthcare expenses.

## Key Features

### 🏥 Healthcare Bundles & Packages
- Browse and purchase healthcare packages tailored to different needs
- Track active packages, visits remaining, and expiry dates
- Share bundles with family members

### 👨‍👩‍👧‍👦 Family Management
- Add up to 3 dependents to your account
- Manage family member profiles (name, date of birth, gender)
- Share healthcare bundles with dependents
- Track visits for each family member
- Edit or remove dependents as needed

### 🏢 Partner Facilities
- Discover nearby partner healthcare facilities
- View facility details, services, and availability
- Book visits at partner locations

### 📅 Visit Management
- Book appointments at partner facilities
- Track visit history for yourself and dependents
- View upcoming and completed visits
- Access visit details and package usage

### 💰 Wallet System
- Top up your wallet balance
- Track transaction history
- View spending and package purchases

### 📊 Dashboard & Analytics
- View your healthcare journey at a glance
- Track visit trends over time
- Monitor bundle usage and expiry
- Quick access to key features

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Project Structure

```
abaccess/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   └── (main)/            # Main application pages
│       ├── dashboard/     # Dashboard & overview
│       ├── family/        # Family management
│       ├── packages/      # Healthcare packages
│       ├── visits/        # Visit booking & history
│       ├── wallet/        # Wallet & transactions
│       └── profile/       # User profile
├── components/            # React components
│   ├── cards/            # Card components
│   ├── common/           # Shared components
│   ├── forms/            # Form components
│   ├── modals/           # Modal dialogs
│   └── ui/               # UI primitives
├── lib/                  # Utilities & services
│   ├── services/         # API services
│   ├── supabase/         # Supabase client & queries
│   └── utils/            # Helper functions
├── stores/               # Zustand state stores
└── types/                # TypeScript type definitions
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm/bun
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/abaccess.git
cd abaccess
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Development

### Code Style
- TypeScript for type safety
- Component-first architecture
- Mobile-first responsive design
- Accessibility-first approach

### State Management
- Zustand for global state
- Local state with React hooks
- Persistent storage with localStorage

### Design System
- Geist font family
- Tailwind CSS utility classes
- Custom color palette (primary, secondary, neutral, error)
- Consistent spacing and typography scale

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential.

## Contact

For questions or support, please contact the AbAccess team.
