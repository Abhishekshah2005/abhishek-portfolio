export type SplitType = 'chars' | 'words' | 'lines';

export interface SplitResult {
  chars: HTMLElement[];
  words: HTMLElement[];
  lines: HTMLElement[];
  /** Restore the element to its original markup. */
  revert: () => void;
}

/**
 * A dependency-free text splitter (GSAP SplitText is a paid plugin).
 *
 * Wraps characters and words in inline-block spans and groups words into
 * lines by measuring their vertical offset — enabling per-char, per-word and
 * per-line reveal animations. Always call `revert()` on cleanup to restore
 * the original DOM and accessibility tree.
 */
export function splitText(
  element: HTMLElement,
  types: SplitType[] = ['chars', 'words'],
): SplitResult {
  const original = element.innerHTML;
  const text = element.textContent ?? '';
  const wantWords = types.includes('words') || types.includes('lines') || types.includes('chars');
  const wantChars = types.includes('chars');
  const wantLines = types.includes('lines');

  const words: HTMLElement[] = [];
  const chars: HTMLElement[] = [];

  element.setAttribute('aria-label', text);
  element.textContent = '';

  const tokens = text.split(/(\s+)/);
  for (const token of tokens) {
    if (token.trim() === '') {
      element.appendChild(document.createTextNode(token));
      continue;
    }

    const word = document.createElement('span');
    word.className = 'split-word';
    word.style.display = 'inline-block';
    word.setAttribute('aria-hidden', 'true');

    if (wantChars) {
      for (const ch of Array.from(token)) {
        const charEl = document.createElement('span');
        charEl.className = 'split-char';
        charEl.style.display = 'inline-block';
        charEl.textContent = ch;
        word.appendChild(charEl);
        chars.push(charEl);
      }
    } else {
      word.textContent = token;
    }

    element.appendChild(word);
    if (wantWords) words.push(word);
  }

  const lines: HTMLElement[] = [];
  if (wantLines && words.length > 0) {
    // Group words into line wrappers by their measured vertical offset.
    const groups: HTMLElement[][] = [];
    let currentTop: number | null = null;
    for (const word of words) {
      const top = word.offsetTop;
      if (currentTop === null || top !== currentTop) {
        currentTop = top;
        groups.push([]);
      }
      groups[groups.length - 1].push(word);
    }

    element.textContent = '';
    for (const group of groups) {
      const line = document.createElement('span');
      line.className = 'split-line';
      line.style.display = 'block';
      group.forEach((word, index) => {
        line.appendChild(word);
        if (index < group.length - 1) line.appendChild(document.createTextNode(' '));
      });
      element.appendChild(line);
      lines.push(line);
    }
  }

  return {
    chars,
    words,
    lines,
    revert: () => {
      element.innerHTML = original;
      element.removeAttribute('aria-label');
    },
  };
}
