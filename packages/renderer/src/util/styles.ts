const { Processor } = require("windicss/lib");
export const generateStylesFromWindiClassName = (classNames: string) => {
  const processor = new Processor();
  const interpretedSheet = processor.interpret(classNames).styleSheet.children;
  let styles = "";
  interpretedSheet.forEach((rule) => {
    rule.property.forEach((p) => {
      const s = {
        name: p.name,
        value: p.value,
      };
      styles += `${s.name}: ${s.value};`;
    });
  });
  return styles;
};
