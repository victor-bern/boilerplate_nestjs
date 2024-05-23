import { PrismaClient, TextType } from '@prisma/client';
import { aboutText } from './texts/aboutText';
import { cookieText } from './texts/cookieText';
import { policyText } from './texts/policyText';
import { termsText } from './texts/termsText';
import { tipsText } from './texts/tipsText';

export async function seedText(prisma: PrismaClient) {
  await prisma.text.createMany({
    data: [
      {
        text: aboutText,
        type: TextType.ABOUT,
      },
      {
        text: cookieText,
        type: TextType.COOKIES,
      },
      {
        text: policyText,
        type: TextType.POLICIES,
      },
      {
        text: termsText,
        type: TextType.TERMS,
      },
      {
        text: tipsText,
        type: TextType.TIPS,
      },
    ],
  });

  console.log('Texts seed added successfully 🌱.');
}
