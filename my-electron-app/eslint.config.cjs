const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const pluginReact = require('eslint-plugin-react');
const pluginHooks = require('eslint-plugin-react-hooks');
const pluginPrettier = require('eslint-plugin-prettier');
const configPrettier = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
  // React 렌더러 프로세스 전용
  {
    files: ['src/renderer/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.app.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaVersion: 2020
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: pluginReact,
      'react-hooks': pluginHooks,
      prettier: pluginPrettier
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',       // 필수 훅 순서 검사
      'react-hooks/exhaustive-deps': 'warn',       // 의존성 배열 검사
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off'
    },
    settings: {
      react: { version: 'detect' }
    }
  },

  // Electron 메인 프로세스 전용
  {
    files: ['src/main/**/*.{ts,js}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.main.json',
        tsconfigRootDir: __dirname,
        sourceType: 'commonjs',
        ecmaVersion: 2020
      },
      globals: {
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: pluginPrettier
    },
    rules: {
      'prettier/prettier': 'error',
      // 메인 프로세스에서는 console 허용
      'no-console': 'off'
    }
  },

  // Prettier와 충돌하는 ESLint 규칙 비활성화
  {
    rules: {
      ...configPrettier.rules
    }
  },

  // 검사 제외
  {
    ignores: ['dist', 'node_modules']
  }
];