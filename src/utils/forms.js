export function parseErrorMessages(fieldsErrorMessages) {
  return Object.entries(fieldsErrorMessages).reduce(
    (acc, [fieldName, errors]) => {
      // errors : ["m1", "m2"],join(" ") => "m1 m2" 이런식으로 변경
      acc[fieldName] = {
        validateStatus: "error",
        help: errors.join(" "),
      };
      return acc;
    },
    {} // 초기값 : {}   빈 객체로
  );
}
