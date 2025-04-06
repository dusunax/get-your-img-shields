const replaceSpace = (name: string) => {
  return name.replace(/ /g, "%20");
};

const setMarkdown = (name: string, color: string) => {
  return `![${name}](https://img.shields.io/badge/${replaceSpace(
    name
  )}-${color}?style=flat-square&logo=${replaceSpace(name)}&logoColor=white)`;
};

export { replaceSpace, setMarkdown };
