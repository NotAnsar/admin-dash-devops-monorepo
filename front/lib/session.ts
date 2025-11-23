import 'server-only';

import { User } from '@/types/user';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const secretKey = process.env.SESSION_SECRET;
const key = new TextEncoder().encode(secretKey);
const SESSION_DURATION = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds

export async function encrypt(payload: {
	userId: string | number;
	expiresAt: Date;
	token: string;
	user: User;
}) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(`${SESSION_DURATION / 1000}s`) // Convert to seconds
		.sign(key);
}

export async function decrypt(session: string | undefined = '') {
	try {
		const { payload } = await jwtVerify(session, key, {
			algorithms: ['HS256'],
		});

		return payload;
	} catch (error) {
		return null;
	}
}

export async function createSession(userId: string, token: string, user: User) {
	const expiresAt = new Date(Date.now() + SESSION_DURATION);
	const session = await encrypt({ userId, expiresAt, token, user });

	cookies().set('session', session, {
		httpOnly: true,
		secure: true,
		expires: expiresAt,
		sameSite: 'lax',
		path: '/',
	});
}

export async function verifySession() {
	const cookie = cookies().get('session')?.value;
	const session = await decrypt(cookie);

	if (!session?.userId) redirect('/auth/signin');

	return {
		isAuth: true,
		userId: Number(session.userId),
		token: session.token as string,
		user: session.user as User,
	};
}
export async function getUserSession() {
	const cookie = cookies().get('session')?.value;
	const session = await decrypt(cookie);

	if (!session?.userId) return null;

	return {
		isAuth: true,
		userId: Number(session.userId),
		token: session.token as string,
		user: session.user as User,
	};
}

export async function updateSession() {
	const session = cookies().get('session')?.value;
	const payload = await decrypt(session);

	if (!session || !payload) {
		return null;
	}

	const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	cookies().set('session', session, {
		httpOnly: true,
		secure: true,
		expires: expires,
		sameSite: 'lax',
		path: '/',
	});
}

export async function deleteSession() {
	cookies().delete('session');
}

export async function updateSessionUser(updatedUser: User) {
	const cookie = cookies().get('session')?.value;
	const session = await decrypt(cookie);

	if (!session || typeof session !== 'object') {
		return null;
	}

	const updatedPayload = {
		userId: session.userId as string | number,
		expiresAt: new Date(session.expiresAt as string),
		token: session.token as string,
		user: updatedUser,
	};

	const updatedSession = await encrypt(updatedPayload);

	cookies().set('session', updatedSession, {
		httpOnly: true,
		secure: true,
		expires: updatedPayload.expiresAt,
		sameSite: 'lax',
		path: '/',
	});
}
