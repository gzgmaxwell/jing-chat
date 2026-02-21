/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      screens: {
        // 自定义响应式断点
        mob: { max: '767px' },      // 最大767px即手机端
        pc: { min: '768px' },       // 768px及以上视为电脑端
      },
      spacing: {
        '3.2rem': '3.2rem',
        // 也支持方括号写法无需添加spacing
      },
    },
  },
  plugins: [],
}
