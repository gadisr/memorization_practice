import assert from 'assert/strict';
import {
  ONBOARDING_SCREENS,
  MEDIA_ASSETS,
  CALLOUT_CARDS,
  QUIZ_BANK
} from '../onboarding/onboarding-data.js';

function collectAttributeValues(html: string, attribute: string): Set<string> {
  const pattern = new RegExp(`${attribute}="([^"]+)"`, 'g');
  const matches = html.matchAll(pattern);
  const values = new Set<string>();

  for (const match of matches) {
    if (match[1]) {
      values.add(match[1]);
    }
  }

  return values;
}

function validateScreens(): void {
  assert.equal(ONBOARDING_SCREENS.length, 14, 'Expected 14 onboarding screens');

  const ids = new Set<string>();

  ONBOARDING_SCREENS.forEach(screen => {
    assert.ok(
      !ids.has(screen.id),
      `Duplicate screen id detected: ${screen.id}`
    );
    ids.add(screen.id);

    const mediaRefs = collectAttributeValues(screen.content, 'data-media');
    mediaRefs.forEach(mediaId => {
      assert.ok(
        MEDIA_ASSETS[mediaId],
        `Missing media asset "${mediaId}" referenced in screen "${screen.id}"`
      );
    });

    const calloutRefs = collectAttributeValues(screen.content, 'data-callout');
    calloutRefs.forEach(calloutId => {
      assert.ok(
        CALLOUT_CARDS[calloutId],
        `Missing callout "${calloutId}" referenced in screen "${screen.id}"`
      );
    });

    screen.interactiveElements?.forEach(element => {
      if (element.type === 'quiz') {
        const quizId =
          element.data &&
          typeof element.data === 'object' &&
          'quizId' in element.data &&
          typeof (element.data as { quizId?: unknown }).quizId === 'string'
            ? (element.data as { quizId: string }).quizId
            : undefined;
        assert.ok(
          quizId && QUIZ_BANK[quizId],
          `Quiz "${quizId}" referenced in screen "${screen.id}" is not configured`
        );
      }
    });
  });
}

function validateQuizIntegrity(): void {
  Object.values(QUIZ_BANK).forEach(quiz => {
    assert.ok(quiz.options.length >= 2, `Quiz "${quiz.id}" must have at least two options`);
    assert.ok(
      quiz.options.some(option => option.isCorrect),
      `Quiz "${quiz.id}" must have a correct option`
    );
  });
}

validateScreens();
validateQuizIntegrity();

console.log('✅ Onboarding data integrity checks passed.');

