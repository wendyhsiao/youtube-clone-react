module.exports = {
  mode: "jit",
  purge: [
    "./*.{html,js}",
    "./**/*.{html,js}",
  ],
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
