import type { Metadata } from "next";
import { Geist, Geist_Mono, Merriweather } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from "next-intl/server";
import { ToastProvider } from "@/components/ToastProvider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const merriweather = Merriweather({
	variable: "--font-serif",
	weight: ["400", "700"],
	subsets: ["latin"],
});

export async function generateMetadata({ params, }: { params: Promise<{ locale: string }>; }): Promise<Metadata> {
	const { locale } = await params;
	const messages = await getMessages({ locale });
	const text =
		(messages as {
			general?: {
				siteName?: string;
				description?: string;
				title?: string;
				imageAlt?: string;
				image?: string;
			};
		}).general ?? {};

	return {
		title: text.siteName,
		description: text.description,
		icons: {
			icon: "/img/favicon.png",
		},
		openGraph: {
			title: text.title,
			description: text.description,
			images: [
				{
					url: `${process.env.NEXT_PUBLIC_BASE_URL}/img/og-logo.png`,
					width: 1200,
					height: 630,
					alt: text.imageAlt,
					type: "image/png",
				},
			],
			type: "website",
			locale: locale,
		},
		twitter: {
			card: "summary_large_image",
			title: text.title,
			description: text.description,
			images: [text.image || `${process.env.NEXT_PUBLIC_BASE_URL}/img/og-logo.png`],
		},
	};
}

export default async function RootLayout( {children, params,}: {children: React.ReactNode; params: Promise<{ locale: string }>;} ) {
	const { locale } = await params;
	const messages = await getMessages({ locale });

    return (
        <html lang={locale} suppressHydrationWarning>      
			<body className={`app-shell ${geistSans.variable} ${geistMono.variable} ${merriweather.variable}`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme" disableTransitionOnChange> 
					<NextIntlClientProvider locale={locale} messages={messages}>
						<ToastProvider>
							<main className="content">{children}</main>
						</ToastProvider>
					</NextIntlClientProvider>
				</ThemeProvider>
			</body>
        </html>
    );
}