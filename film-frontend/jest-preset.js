module.exports = {
    // Menggunakan Babel untuk transpile kode
    transform: {
      "^.+\\.jsx?$": "babel-jest", // Transpile .js dan .jsx
    },
    // Mencari file dengan ekstensi .js dan .jsx
    moduleFileExtensions: ["js", "jsx", "json", "node"],
    // Menggunakan preset untuk pengujian React
    preset: "react",
    testEnvironment: "jsdom", // Pengaturan untuk pengujian berbasis browser
  };
  