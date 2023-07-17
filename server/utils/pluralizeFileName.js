function pluralizeFileName(word) {
  if (/[sxz]$|[^aeioudgkprt]h$/.test(word)) {
    return word + 'es';
  } else if (/[aeiou]y$/.test(word)) {
    return word.replace(/y$/, 'ies');
  } else {
    return word + 's';
  }
}

module.exports = { pluralizeFileName };