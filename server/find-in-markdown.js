
const REGEX_FENCED_CODE_BLOCK = /^( {0,3}|\t)```[^`\r\n]*$[\w\W]+?^( {0,3}|\t)``` *$/gm;


function cleanupMarkdown(markdown) {
  const replacer = (foundStr) => foundStr.replace(/[^\r\n]/g, "");
  return markdown
    .replace(REGEX_FENCED_CODE_BLOCK, replacer) //// Remove fenced code blocks
    .replace(/<!--[\W\w]+?-->/g, replacer) //// Remove comments
    .replace(/^---[\W\w]+?(\r?\n)---/, replacer); //// Remove YAML front matter
}

function getInternalReferences(string) {
  const cleanedMarkdown = cleanupMarkdown(string);

  const regexp = new RegExp("\\[[^\\]]+\\]\\(([^\\)]+)\\)", "ig")
  const unique = new Set()

  let match;
  while (match = regex.exec(markdown)) {
    const [, name] = match;
    if (name) {
      unique.add(name);
    }
  }
  
  return Array.from(unique);
};

function containsInternalReference(markdown, slug) {
  const cleanedMarkdown = cleanupMarkdown(markdown)
  const regexp = new RegExp(
    `\\[[^\\]]+\\]\\(${slug}\\)`, "ig")
  return regexp.test(cleanedMarkdown)
} 

module.exports = {
  getInternalReferences,
  containsInternalReference
}
