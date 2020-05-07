const init = require("./init");
const generate = require("./generate");
const WhiteListParamList = ["init", "generate", "-i", "-g"];
const args = process.argv.slice(2);

if (args.length !== 1 || !WhiteListParamList.includes(args[0])) {
  console.error("传入了错误的参数");
  return;
}

let param = args[0];

param = param.startsWith("-") ? param.substr(1) : param;

switch (param) {
  case "i":
  case "init": {
    init();
    break;
  }
  case "g":
  case "generate": {
    generate();
  }
}
