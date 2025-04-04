const Instruction = () => {
  return (
    <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-jetbrains-mono)]">
      <li className="mb-2 tracking-[-.01em]">
        Enter the name of the skill you want to get the img shield for. ex)
        <img
          src="https://img.shields.io/badge/React-0088CC?style=flat-square&logo=react&logoColor=white"
          className="inline-block mx-1"
        />
        ,
        <img
          src="https://img.shields.io/badge/Node.js-5FA04E?style=flat-square&logo=node.js&logoColor=white"
          className="inline-block mx-1"
        />
        ,
        <img
          src="https://img.shields.io/badge/Kotlin-7F52FF?style=flat-square&logo=kotlin&logoColor=white"
          className="inline-block mx-1"
        />
        , etc.
      </li>
      <li className="mb-2 tracking-[-.01em]">
        Click the button to get the img shield. (and wait a few seconds!
        <span className="text-xs inline-block animate-spin">⏳</span>)
      </li>
      <li className="tracking-[-.01em]">
        Copy shield's image or markdown to your clipboard.😉
      </li>
    </ol>
  );
};

export default Instruction;
