import { NextResponse, type NextRequest } from 'next/server';
import axiosInstance from './lib/axios';
import { SignJWT } from 'jose';
import { decrypt } from './lib/session';

export async function middleware(request: NextRequest) {
	// Get the path the user is trying to access
	const path = request.nextUrl.pathname;

	// Define public paths that don't require authentication
	const isAuthPath = path.startsWith('/auth');

	// Define paths that should be excluded from middleware checks
	const isExcludedPath =
		path.startsWith('/_next') ||
		path.startsWith('/api/public') ||
		path.includes('.') || // Static files
		path === '/favicon.ico';

	// Skip middleware for excluded paths
	if (isExcludedPath) {
		return NextResponse.next();
	}

	// Verify the session JWT if it exists
	const cookie = request.cookies.get('session')?.value;
	const session = await decrypt(cookie);

	let isAuthenticated = !!session;

	// if (isAuthenticated && !isAuthPath) {
	// 	try {
	// 		const res = await axiosInstance.get(`/api/profile`);

	// 		if (!res?.data?.success) throw new Error('User not found');

	// 		// Create a next response that we'll use to update the session
	// 		const response = NextResponse.next();

	// 		// Update session with the latest user data if available
	// 		if (session && res.data.data) {
	// 			const secretKey = process.env.SESSION_SECRET;
	// 			const key = new TextEncoder().encode(secretKey);
	// 			const SESSION_DURATION = 90 * 24 * 60 * 60 * 1000; // 90 days
	// 			const expiresAt = new Date(Date.now() + SESSION_DURATION);

	// 			// Create updated session payload
	// 			const updatedPayload = {
	// 				userId: session.userId,
	// 				expiresAt: expiresAt,
	// 				token: session.token,
	// 				user: res.data.data,
	// 			};

	// 			// Sign the JWT
	// 			const updatedSession = await new SignJWT(updatedPayload)
	// 				.setProtectedHeader({ alg: 'HS256' })
	// 				.setIssuedAt()
	// 				.setExpirationTime(`${SESSION_DURATION / 1000}s`)
	// 				.sign(key);

	// 			// Set the cookie in the response
	// 			response.cookies.set('session', updatedSession, {
	// 				httpOnly: true,
	// 				secure: true,
	// 				expires: expiresAt,
	// 				sameSite: 'lax',
	// 				path: '/',
	// 			});
	// 		}

	// 		return response;
	// 	} catch (error) {
	// 		console.log(error);

	// 		isAuthenticated = false;
	// 		const callbackUrl = encodeURIComponent(request.url);
	// 		const loginUrl = new URL(
	// 			`/auth/signin?callbackUrl=${callbackUrl}`,
	// 			request.url
	// 		);
	// 		// Use middleware's direct response methods instead of calling deleteSession()
	// 		const response = NextResponse.redirect(loginUrl);
	// 		response.cookies.delete('session'); // Delete cookie directly
	// 		return response;
	// 	}
	// }

	// Redirect logic
	if (!isAuthenticated && !isAuthPath) {
		// Store the original URL to redirect back after login
		const callbackUrl = encodeURIComponent(request.url);
		const loginUrl = new URL(
			`/auth/signin?callbackUrl=${callbackUrl}`,
			request.url
		);
		return NextResponse.redirect(loginUrl);
	}

	if (isAuthenticated && isAuthPath) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - Images and other static assets
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
};
