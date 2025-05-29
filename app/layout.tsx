import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/commonOnes/Header";
import { AuthProvider } from "@/context/AuthProvider";
import MobileNavigator from "@/components/commonOnes/MobileNavigator";
import { ContactsProvider } from "@/context/ContactsProvider";
import { RideProvider } from "@/context/states";
export const metadata: Metadata = {
  title: "VeloRide | Smarter Carpooling for Easy & Affordable Rides",
  description: "VeloRide makes carpooling effortless! Connect with trusted drivers and passengers, save money, reduce traffic, and travel smarter. Join now and ride the future!",
  icons: {
    icon: '/Images/Leonardo_Phoenix_10_A_sleek_modern_and_minimalistic_logo_desig_3-removebg-preview__1_-removebg-preview.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="inter flex relative flex-col min-h-screen"
      >
          <AuthProvider>
            <RideProvider>
              <ContactsProvider>
                <div className="fixed w-full left-0 z-40 top-0">
                  <Header />
            </div>

            <div className="flex-1 overflow-y-auto">
              {children}
            </div>

            <div className="bottom-0 z-30 fixed right-0 h-fit w-fit ml-auto">
              <MobileNavigator />
                </div>
              </ContactsProvider>
            </RideProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
