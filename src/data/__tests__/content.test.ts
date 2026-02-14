import { describe, it, expect } from 'vitest';
import { truthOrDarePrompts } from '../truth-or-dare';
import { hotSeatPrompts } from '../hot-seat';
import { triviaQuestions } from '../trivia';
import { wouldYouRatherPrompts } from '../would-you-rather';
import { hotTakesPrompts } from '../hot-takes';
import { challengesPrompts as challengePrompts } from '../challenges';
import { wildcardPrompts } from '../wildcard';
import { herdMentalityQuestions } from '../herd-mentality';

describe('Content Validation - Truth or Dare', () => {
  it('has prompts', () => {
    expect(truthOrDarePrompts.length).toBeGreaterThan(0);
  });

  it('all prompts have required fields', () => {
    truthOrDarePrompts.forEach(prompt => {
      expect(prompt.id).toBeTruthy();
      expect(prompt.text).toBeTruthy();
      expect(prompt.intensity).toBeDefined();
      expect(prompt.type).toBeTruthy();
    });
  });

  it('all prompts have valid intensity levels', () => {
    truthOrDarePrompts.forEach(prompt => {
      expect([1, 2, 3]).toContain(prompt.intensity);
    });
  });

  it('all prompts have valid types', () => {
    truthOrDarePrompts.forEach(prompt => {
      expect(['truth', 'dare']).toContain(prompt.type);
    });
  });

  it('has no duplicate IDs', () => {
    const ids = truthOrDarePrompts.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('has balanced content across intensity levels', () => {
    const level1 = truthOrDarePrompts.filter(p => p.intensity === 1);
    const level2 = truthOrDarePrompts.filter(p => p.intensity === 2);
    const level3 = truthOrDarePrompts.filter(p => p.intensity === 3);

    expect(level1.length).toBeGreaterThan(0);
    expect(level2.length).toBeGreaterThan(0);
    expect(level3.length).toBeGreaterThan(0);
  });
});

describe('Content Validation - Hot Seat', () => {
  it('has prompts', () => {
    expect(hotSeatPrompts.length).toBeGreaterThan(0);
  });

  it('all prompts have required fields', () => {
    hotSeatPrompts.forEach(prompt => {
      expect(prompt.id).toBeTruthy();
      expect(prompt.text).toBeTruthy();
      expect(prompt.intensity).toBeDefined();
    });
  });

  it('all prompts have valid intensity levels', () => {
    hotSeatPrompts.forEach(prompt => {
      expect([1, 2, 3]).toContain(prompt.intensity);
    });
  });

  it('has no duplicate IDs', () => {
    const ids = hotSeatPrompts.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe('Content Validation - Trivia', () => {
  it('has questions', () => {
    expect(triviaQuestions.length).toBeGreaterThan(0);
  });

  it('all questions have required fields', () => {
    triviaQuestions.forEach(question => {
      expect(question.id).toBeTruthy();
      expect(question.question).toBeTruthy();
      expect(question.answer).toBeTruthy();
      expect(question.options).toBeDefined();
      expect(question.category).toBeTruthy();
      expect(question.intensity).toBeDefined();
    });
  });

  it('all questions have valid intensity levels', () => {
    triviaQuestions.forEach(question => {
      expect([1, 2, 3]).toContain(question.intensity);
    });
  });

  it('all questions have exactly 4 options', () => {
    triviaQuestions.forEach(question => {
      expect(question.options).toHaveLength(4);
    });
  });

  it('answer is one of the options', () => {
    triviaQuestions.forEach(question => {
      expect(question.options).toContain(question.answer);
    });
  });

  it('has no duplicate IDs', () => {
    const ids = triviaQuestions.map(q => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('options are unique per question', () => {
    triviaQuestions.forEach(question => {
      const uniqueOptions = new Set(question.options);
      expect(uniqueOptions.size).toBe(4);
    });
  });
});

describe('Content Validation - Would You Rather', () => {
  it('has prompts', () => {
    expect(wouldYouRatherPrompts.length).toBeGreaterThan(0);
  });

  it('all prompts have required fields', () => {
    wouldYouRatherPrompts.forEach(prompt => {
      expect(prompt.id).toBeTruthy();
      expect(prompt.optionA).toBeTruthy();
      expect(prompt.optionB).toBeTruthy();
      expect(prompt.intensity).toBeDefined();
    });
  });

  it('all prompts have valid intensity levels', () => {
    wouldYouRatherPrompts.forEach(prompt => {
      expect([1, 2, 3]).toContain(prompt.intensity);
    });
  });

  it('has no duplicate IDs', () => {
    const ids = wouldYouRatherPrompts.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe('Content Validation - Hot Takes', () => {
  it('has prompts', () => {
    expect(hotTakesPrompts.length).toBeGreaterThan(0);
  });

  it('all prompts have required fields', () => {
    hotTakesPrompts.forEach(prompt => {
      expect(prompt.id).toBeTruthy();
      expect(prompt.opinion).toBeTruthy();
      expect(prompt.intensity).toBeDefined();
    });
  });

  it('all prompts have valid intensity levels', () => {
    hotTakesPrompts.forEach(prompt => {
      expect([1, 2, 3]).toContain(prompt.intensity);
    });
  });

  it('has no duplicate IDs', () => {
    const ids = hotTakesPrompts.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe('Content Validation - Challenges', () => {
  it('has prompts', () => {
    expect(challengePrompts.length).toBeGreaterThan(0);
  });

  it('all prompts have required fields', () => {
    challengePrompts.forEach(prompt => {
      expect(prompt.id).toBeTruthy();
      expect(prompt.challenge).toBeTruthy();
      expect(prompt.intensity).toBeDefined();
    });
  });

  it('all prompts have valid intensity levels', () => {
    challengePrompts.forEach(prompt => {
      expect([1, 2, 3]).toContain(prompt.intensity);
    });
  });

  it('has no duplicate IDs', () => {
    const ids = challengePrompts.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe('Content Validation - Wildcard', () => {
  it('has prompts', () => {
    expect(wildcardPrompts.length).toBeGreaterThan(0);
  });

  it('all prompts have required fields', () => {
    wildcardPrompts.forEach(prompt => {
      expect(prompt.id).toBeTruthy();
      expect(prompt.prompt).toBeTruthy();
      expect(prompt.intensity).toBeDefined();
    });
  });

  it('all prompts have valid intensity levels', () => {
    wildcardPrompts.forEach(prompt => {
      expect([1, 2, 3]).toContain(prompt.intensity);
    });
  });

  it('has no duplicate IDs', () => {
    const ids = wildcardPrompts.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe('Content Validation - Herd Mentality', () => {
  it('has questions', () => {
    expect(herdMentalityQuestions.length).toBeGreaterThan(0);
  });

  it('all questions have required fields', () => {
    herdMentalityQuestions.forEach(question => {
      expect(question.id).toBeTruthy();
      expect(question.text).toBeTruthy();
      expect(question.intensity).toBeDefined();
    });
  });

  it('all questions have valid intensity levels', () => {
    herdMentalityQuestions.forEach(question => {
      expect([1, 2, 3]).toContain(question.intensity);
    });
  });

  it('has no duplicate IDs', () => {
    const ids = herdMentalityQuestions.map(q => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe('Content Validation - Overall', () => {
  it('all content categories are populated', () => {
    expect(truthOrDarePrompts.length).toBeGreaterThan(0);
    expect(hotSeatPrompts.length).toBeGreaterThan(0);
    expect(triviaQuestions.length).toBeGreaterThan(0);
    expect(wouldYouRatherPrompts.length).toBeGreaterThan(0);
    expect(hotTakesPrompts.length).toBeGreaterThan(0);
    expect(challengePrompts.length).toBeGreaterThan(0);
    expect(wildcardPrompts.length).toBeGreaterThan(0);
    expect(herdMentalityQuestions.length).toBeGreaterThan(0);
  });

  it('no ID collisions across all content', () => {
    const allIds = [
      ...truthOrDarePrompts.map(p => p.id),
      ...hotSeatPrompts.map(p => p.id),
      ...triviaQuestions.map(q => q.id),
      ...wouldYouRatherPrompts.map(p => p.id),
      ...hotTakesPrompts.map(p => p.id),
      ...challengePrompts.map(p => p.id),
      ...wildcardPrompts.map(p => p.id),
      ...herdMentalityQuestions.map(q => q.id),
    ];

    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });
});
