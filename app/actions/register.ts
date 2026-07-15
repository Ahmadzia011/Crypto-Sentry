"use server";

import { prisma } from "../lib/prisma";

// This action stores a user record before the sign-in flow continues.
// It keeps the database aligned with the new Google and magic-link experience.
export async function registerUser(name: string, email: string) {
  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!trimmedName || !normalizedEmail) {
    return { success: false, message: "Please enter both your name and email." };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      if (!existingUser.name && trimmedName) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { name: trimmedName },
        });
      }

      return {
        success: true,
        message: `We prepared ${normalizedEmail} for sign-in.`,
      };
    }

    await prisma.user.create({
      data: {
        name: trimmedName,
        email: normalizedEmail,
      },
    });

    return {
      success: true,
      message: `Account details for ${normalizedEmail} have been saved.`,
    };
  } catch (error) {
    console.error("Registration save error:", error);
    return {
      success: false,
      message: "We could not save your account details right now.",
    };
  }
}