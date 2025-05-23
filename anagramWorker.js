onmessage = function (event) {
  const { inputString, trimmedDict, dictionary } = event.data;

  const anagrams = generateAnagrams(inputString, trimmedDict, dictionary);

  // Send the result back to the main thread
  postMessage(anagrams);
};

function countLetters(word) {
  const letterCounts = Array(26).fill(0);
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    if (char >= "a" && char <= "z") {
      letterCounts[char.charCodeAt(0) - 97]++; // Increment the corresponding index
    }
  }
  return letterCounts;
}

function spellCheck(thisWordCount, availableCount) {
  return thisWordCount.every((count, i) => availableCount[i] >= count);
}

function generateAnagrams(inputString, inputDictionary, dictionary) {
  const anagrams = new Set();
  const inputLetters = countLetters(inputString);

  function backtrack(current, availableLetters, candidates) {
    if (availableLetters.every((count) => count === 0)) {
      const combination = current.split(" ").sort().join(" ");
      if (combination !== inputString) {
        anagrams.add(combination);
      }
      return;
    }

    if (candidates.length === 0) return;

    for (let i = 0; i < candidates.length; i++) {
      const { dictWord, dictWordLtr } = candidates[i];
      if (spellCheck(dictWordLtr, availableLetters)) {
        const newCount = new Array(26);
        for (let j = 0; j < 26; j++) { newCount[j] = availableLetters[j] - dictWordLtr[j]; }
        const nextCandidates = candidates.filter( 
          ({ dictWordLtr: nextWordFreq }) => spellCheck(nextWordFreq, newCount));
        backtrack( current ? current + " " + dictWord : dictWord, newCount, nextCandidates );
      }
    }
  }

  backtrack("", inputLetters, inputDictionary);
  return [...anagrams];
}
