exports.customLaunchers = {
  ChromeDebugging: {
    base: "Chrome",
    flags: [
      "--remote-debugging-port=9333",
      "--auto-open-devtools-for-tabs",
      "http://localhost:9876/debug.html",
    ],
  },
  ChromeHeadlessLocal: {
    base: "ChromeHeadless",
    flags: ["--window-size=1024,768"],
  },
  ChromeHeadlessCI: {
    base: "ChromeHeadless",
    flags: ["--window-size=1024,768", "--no-sandbox"],
  },
  FirefoxHeadless: {
    base: "Firefox",
    flags: ["-headless"],
  },
};
